const NIGERIAN_STATES = new Set([
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
])

const SUPPORTED_CROPS = new Set([
  'rice', 'maize', 'tomato', 'yam', 'cassava', 'sorghum', 'millet', 'cowpea', 'beans', 'groundnut',
])

const SUPPORTED_LANGUAGES = new Set([
  'english', 'hausa', 'hausa-english', 'yoruba', 'yoruba-english',
  'igbo', 'igbo-english', 'pidgin',
])

const SUPPORTED_SOIL_TYPES = new Set(['loamy', 'sandy', 'clay', 'alluvial', 'laterite'])

const PRODUCT_CATEGORIES = new Set([
  'fertilizer', 'seed', 'pesticide', 'herbicide', 'tool',
  'service', 'market', 'financial', 'consumer',
])

// The frontend sends pre-serialized strings directly — validate those
function validateReviewRequest(body) {
  const { farmer_profile, product_name } = body

  if (!farmer_profile || typeof farmer_profile !== 'string' || farmer_profile.trim().length < 5) {
    return fail('farmer_profile', 'farmer_profile must be a non-empty string')
  }
  if (!product_name || typeof product_name !== 'string' || product_name.trim().length < 1) {
    return fail('product_name', 'product_name must be a non-empty string')
  }
  return { valid: true }
}

function validateRecommendRequest(body) {
  const { farmer_profile } = body
  if (!farmer_profile || typeof farmer_profile !== 'string' || farmer_profile.trim().length < 5) {
    return fail('farmer_profile', 'farmer_profile must be a non-empty string')
  }
  return { valid: true }
}

function fail(field, message) {
  return { valid: false, error: 'VALIDATION_FAILED', field, message }
}

module.exports = {
  validateReviewRequest,
  validateRecommendRequest,
  NIGERIAN_STATES,
  SUPPORTED_CROPS,
  SUPPORTED_LANGUAGES,
  SUPPORTED_SOIL_TYPES,
  PRODUCT_CATEGORIES,
}
