const { createHash } = require('crypto')

const TTL = {
  review: 60 * 60 * 1000,       // 1 hour
  recommend: 30 * 60 * 1000,    // 30 minutes
}

const store = new Map()

function get(key) {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

function set(key, value, ttlType) {
  const ttl = TTL[ttlType] || TTL.review
  store.set(key, { value, expiresAt: Date.now() + ttl })
}

function hash(obj) {
  return createHash('md5').update(JSON.stringify(obj)).digest('hex').slice(0, 12)
}

function makeReviewKey(farmerProfile, productName) {
  return `review_${hash(farmerProfile)}_${hash(productName)}`
}

function makeRecommendKey(farmerProfile, category) {
  return `recommend_${hash(farmerProfile)}_${category || 'all'}`
}

function getStats() {
  return { entries: store.size }
}

module.exports = { get, set, makeReviewKey, makeRecommendKey, getStats }
