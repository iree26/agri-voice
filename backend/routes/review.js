const express = require('express')
const router = express.Router()
const { standard } = require('../middleware/rateLimiter')
const { validateReviewRequest } = require('../middleware/validator')
const { generateReview, MLServiceError } = require('../services/mlService')
const { get, set, makeReviewKey } = require('../cache/cacheManager')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')

router.post('/generate-review', standard, async (req, res) => {
  const requestId = generateRequestId()
  const { farmer_profile, product_name, optional_context, prefer_fallback } = req.body

  log('generateReview', requestId, `START farmer="${farmer_profile?.slice(0, 40)}..." product="${product_name}"`)

  const validation = validateReviewRequest(req.body)
  if (!validation.valid) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: validation.error,
      field: validation.field,
      message: validation.message,
    })
  }

  const cacheKey = makeReviewKey(farmer_profile, product_name)
  const cached = get(cacheKey)
  if (cached && !prefer_fallback) {
    log('generateReview', requestId, 'CACHE_HIT')
    return res.json({ requestId, status: 'success', cached: true, ...cached })
  }

  try {
    const result = await generateReview(
      { farmer_profile, product_name, optional_context, prefer_fallback: prefer_fallback || false },
      requestId
    )

    const payload = {
      rating: result.rating,
      review: result.review,
      confidence: result.confidence?.toLowerCase() || 'high',
      reasoning: result.reasoning,
      location: result.location,
    }

    set(cacheKey, payload, 'review')
    log('generateReview', requestId, `SUCCESS rating=${payload.rating} confidence=${payload.confidence}`)
    return res.json({ requestId, status: 'success', cached: false, ...payload })
  } catch (err) {
    logError('generateReview', requestId, err.message)
    if (err instanceof MLServiceError) {
      return res.status(503).json({
        requestId,
        status: 'error',
        error: err.code,
        message: 'The AI service is temporarily unavailable. Please try again.',
      })
    }
    return res.status(500).json({
      requestId,
      status: 'error',
      error: 'INTERNAL_ERROR',
      message: err.message,
    })
  }
})

module.exports = router
