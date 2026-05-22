const express = require('express')
const router = express.Router()
const { standard } = require('../middleware/rateLimiter')
const { validateRecommendRequest } = require('../middleware/validator')
const { getRecommendations, MLServiceError } = require('../services/mlService')
const { get, set, makeRecommendKey } = require('../cache/cacheManager')
const { generateRequestId } = require('../utils/requestId')
const { log, logError } = require('../utils/logger')

router.post('/recommendations', standard, async (req, res) => {
  const requestId = generateRequestId()
  const { farmer_profile, category = 'all' } = req.body

  log('recommendations', requestId, `START farmer="${farmer_profile?.slice(0, 40)}..." category=${category}`)

  const validation = validateRecommendRequest(req.body)
  if (!validation.valid) {
    return res.status(400).json({
      requestId,
      status: 'error',
      error: validation.error,
      field: validation.field,
      message: validation.message,
    })
  }

  const cacheKey = makeRecommendKey(farmer_profile, category)
  const cached = get(cacheKey)
  if (cached) {
    log('recommendations', requestId, 'CACHE_HIT')
    return res.json({ requestId, status: 'success', cached: true, recommendations: cached })
  }

  try {
    const result = await getRecommendations({ farmer_profile, category }, requestId)
    const recommendations = result.recommendations || result

    set(cacheKey, recommendations, 'recommend')
    log('recommendations', requestId, `SUCCESS count=${recommendations.length}`)
    return res.json({ requestId, status: 'success', cached: false, recommendations })
  } catch (err) {
    logError('recommendations', requestId, err.message)
    if (err instanceof MLServiceError) {
      const isNotBuilt = err.code === 'ML_SERVICE_ERROR' && err.message.includes('404')
      return res.status(isNotBuilt ? 501 : 503).json({
        requestId,
        status: 'error',
        error: isNotBuilt ? 'NOT_IMPLEMENTED' : err.code,
        message: isNotBuilt
          ? 'Recommendations endpoint not yet available on the ML service.'
          : 'The AI service is temporarily unavailable. Please try again.',
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
