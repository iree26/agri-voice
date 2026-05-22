const express = require('express')
const router = express.Router()
const { standard } = require('../middleware/rateLimiter')
const { generateReviewWithClaude } = require('../services/claudeService')
const { generateReview, MLServiceError } = require('../services/mlService')
const { get, set, makeReviewKey } = require('../cache/cacheManager')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')
const { buildProfileString, buildProductString } = require('../prompts/reviewPrompt')

router.post('/generate-review', standard, async (req, res) => {
  const requestId = generateRequestId()

  const { persona, product, farmer_profile, product_name, optional_context, prefer_fallback = false } = req.body

  let profileStr, productStr

  if (farmer_profile && product_name) {
    profileStr = farmer_profile
    productStr = product_name
  } else if (persona && product) {
    if (!persona.state || !persona.crop) {
      return res.status(400).json({ requestId, status: 'error', error: 'VALIDATION_FAILED', message: 'persona must include state and crop.' })
    }
    if (!product.name) {
      return res.status(400).json({ requestId, status: 'error', error: 'VALIDATION_FAILED', message: 'product must include name.' })
    }
    profileStr = buildProfileString(persona)
    productStr = buildProductString(product)
  } else {
    return res.status(400).json({ requestId, status: 'error', error: 'VALIDATION_FAILED', message: 'Provide either {persona, product} objects or {farmer_profile, product_name} strings.' })
  }

  log('generateReview', requestId, `START profile="${profileStr.slice(0, 50)}..." product="${productStr}"`)

  const cacheKey = makeReviewKey(profileStr, productStr)
  const cached = get(cacheKey)
  if (cached && !prefer_fallback) {
    log('generateReview', requestId, 'CACHE_HIT')
    return res.json({ requestId, status: 'success', cached: true, ...cached })
  }

  let result = null

  try {
    result = await generateReviewWithClaude(profileStr, productStr, requestId)
  } catch (err) {
    logError('generateReview', requestId, `Claude failed: ${err.message} — trying ML fallback`)
    try {
      const mlResult = await generateReview({ farmer_profile: profileStr, product_name: productStr, optional_context: optional_context || '', prefer_fallback: false }, requestId)
      result = { location: mlResult.location, review: mlResult.review, rating: mlResult.rating, confidence: mlResult.confidence, reasoning: mlResult.reasoning }
    } catch (mlErr) {
      logError('generateReview', requestId, `ML fallback failed: ${mlErr.message}`)
      return res.status(503).json({ requestId, status: 'error', error: 'SERVICE_UNAVAILABLE', message: 'Review generation is temporarily unavailable. Please try again.' })
    }
  }

  set(cacheKey, result, 'review')
  log('generateReview', requestId, `SUCCESS rating=${result.rating}`)
  return res.json({ requestId, status: 'success', cached: false, ...result })
})

module.exports = router
