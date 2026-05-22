const { log, logError } = require('../utils/logger')

const ML_TIMEOUT = 30000

async function callML(path, body, requestId) {
  const url = process.env.ML_SERVICE_URL
  if (!url) {
    throw new MLServiceError('ML_SERVICE_NOT_CONFIGURED', 'ML_SERVICE_URL is not set')
  }

  const fullUrl = `${url}${path}`
  log('mlService', requestId, `ML_CALL url=${fullUrl}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT)

  try {
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new MLServiceError('ML_SERVICE_ERROR', `ML service returned ${res.status}: ${text}`)
    }

    const data = await res.json()
    log('mlService', requestId, `ML_CALL SUCCESS status=${res.status}`)
    return data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new MLServiceError('ML_SERVICE_TIMEOUT', 'ML service did not respond within 30 seconds')
    }
    if (err instanceof MLServiceError) throw err
    throw new MLServiceError('ML_SERVICE_UNREACHABLE', `Could not reach ML service: ${err.message}`)
  } finally {
    clearTimeout(timer)
  }
}

async function generateReview(body, requestId) {
  return callML('/generate-review', body, requestId)
}

async function getRecommendations(body, requestId) {
  return callML('/recommend', body, requestId)
}

async function pingML() {
  const url = process.env.ML_SERVICE_URL
  if (!url) return 'not_configured'
  try {
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(5000) })
    return res.ok ? 'connected' : 'unreachable'
  } catch {
    return 'unreachable'
  }
}

class MLServiceError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

module.exports = { generateReview, getRecommendations, pingML, MLServiceError }
