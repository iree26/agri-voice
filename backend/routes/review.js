const express = require('express')
const router = express.Router()
const { standard } = require('../middleware/rateLimiter')
const { generateReviewWithClaude } = require('../services/claudeService')
const { generateReview, MLServiceError } = require('../services/mlService')
const { get, set, makeReviewKey } = require('../cache/cacheManager')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')

router.post('/generate-review', standard, async (req, res) => {
  const requestId = generateRequestId()
  const { persona, product, prefer_fallback = false } = req.body

  if (!persona || !product) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: 'VALIDATION_FAILED',
      message: 'Request must include persona and product objects.',
    })
  }

  if (!persona.state || !persona.crop) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: 'VALIDATION_FAILED',
      message: 'persona must include at least state and crop.',
    })
  }

  if (!product.name) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: 'VALIDATION_FAILED',
      message: 'product must include name.',
    })
  }

  log('generateReview', requestId, `START persona=${persona.state} crop=${persona.crop} product=${product.name}`)

  const cacheKey = makeReviewKey(persona, product.name)
  const cached = get(cacheKey)
  if (cached && !prefer_fallback) {
    log('generateReview', requestId, 'CACHE_HIT')
    return res.json({ requestId, status: 'success', cached: true, ...cached })
  }

  let result = null

  try {
    result = await generateReviewWithClaude(persona, product, requestId)
  } catch (err) {
    logError('generateReview', requestId, `Claude failed: ${err.message} — trying ML service fallback`)

    try {
      const { buildFarmerProfileString } = require('../prompts/reviewPrompt')
      const mlResult = await generateReview(
        {
          farmer_profile: buildFarmerProfileString ? buildFarmerProfileString(persona) : JSON.stringify(persona),
          product_name: [product.brand, product.name].filter(Boolean).join(' '),
          optional_context: product.category ? `category: ${product.category}` : '',
          prefer_fallback: false,
        },
        requestId
      )
      result = {
        rating: mlResult.rating,
        review: mlResult.review,
        language: mlResult.language || 'english',
        reasoning: mlResult.reasoning || '',
      }
    } catch (mlErr) {
      logError('generateReview', requestId, `ML fallback also failed: ${mlErr.message}`)
      return res.status(503).json({
        requestId,
        status: 'error',
        error: 'SERVICE_UNAVAILABLE',
        message: 'Review generation is temporarily unavailable. Please try again.',
      })
    }
  }

  set(cacheKey, result, 'review')
  log('generateReview', requestId, `SUCCESS rating=${result.rating}`)
  return res.json({ requestId, status: 'success', cached: false, ...result })
})

module.exports = router
