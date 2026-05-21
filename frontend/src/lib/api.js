const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Debug log so we can verify the env loaded correctly
console.log('[AgriVoice] API_URL configured as:', API_URL)

/**
 * Main entrypoint. Called by the UI when the user clicks Generate.
 * Translates our rich frontend objects into the flat string format
 * Temi's backend expects, then normalizes the response shape.
 */
export async function generateReview({ persona, product }) {
  // Use mock only if no backend configured
  if (!API_URL || API_URL === '') {
    console.log('[AgriVoice] No API_URL set, using mock')
    return mockReview({ persona, product })
  }

  const body = {
    farmer_profile: buildFarmerProfileString(persona),
    product_name: buildProductNameString(product),
    optional_context: buildOptionalContextString(persona, product),
    prefer_fallback: false,
  }

  console.log('[AgriVoice] Sending to', `${API_URL}/generate-review`)
  console.log('[AgriVoice] Body:', body)

  const controller = new AbortController()
const timeoutId = setTimeout(() => controller.abort(), 90000) // 90 second timeout

let res
try {
  res = await fetch(`${API_URL}/generate-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
} catch (err) {
  if (err.name === 'AbortError') {
    throw new Error('The server took too long to respond. Render free tier can be slow on cold starts. Try again in 30 seconds.')
  }
  throw new Error('Could not reach the server. Check your connection and try again.')
} finally {
  clearTimeout(timeoutId)
}

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`Review generation failed (${res.status}): ${errorText}`)
  }

  const raw = await res.json()
  console.log('[AgriVoice] Raw response:', raw)

  return {
    rating: raw.rating,
    review: raw.review,
    language: inferLanguageTag(persona.language),
    confidence: raw.confidence?.toLowerCase() || 'high',
    reasoning: raw.reasoning,
    location: raw.location,
  }
}

/**
 * Health check.
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`)
    return res.ok
  } catch {
    return false
  }
}

// ── Translators ────────────────────────────────────────

/**
 * Build a rich, comma-separated farmer description from the persona object.
 * Example: "Amina, 38 years old, rice farmer, in Birnin Kebbi, Kebbi, 2 hectares (small-scale), 15 years experience, alluvial soil, uses both fertilizer, hausa speaker, code-switches naturally"
 */
function buildFarmerProfileString(persona) {
  const parts = []

  if (persona.name) parts.push(persona.name)
  if (persona.age) parts.push(`${persona.age} years old`)

  if (persona.crop) parts.push(`${persona.crop} farmer`)

  if (persona.state) {
    const loc = persona.lga ? `${persona.lga}, ${persona.state}` : persona.state
    parts.push(`in ${loc}`)
  }

  if (persona.farmSize) {
    const size = Number(persona.farmSize)
    const scale = size >= 10 ? 'large-scale' : size >= 4 ? 'mid-scale' : 'small-scale'
    parts.push(`${persona.farmSize} hectares (${scale})`)
  }

  if (persona.yearsOfExperience) {
    parts.push(`${persona.yearsOfExperience} years experience`)
  }

  if (persona.soilType && persona.soilType !== 'unsure') {
    parts.push(`${persona.soilType} soil`)
  }

  if (persona.fertilizerType && persona.fertilizerType !== 'none') {
    parts.push(`uses ${persona.fertilizerType} fertilizer`)
  }

  if (persona.language && persona.language !== 'english') {
    parts.push(`${persona.language} speaker, code-switches naturally`)
  }

  return parts.join(', ')
}

function buildProductNameString(product) {
  const parts = []
  if (product.brand) parts.push(product.brand)
  if (product.name) parts.push(product.name)
  return parts.join(' ').trim() || product.name || 'agricultural product'
}

function buildOptionalContextString(persona, product) {
  const parts = []
  if (product.price) parts.push(`priced at ₦${Number(product.price).toLocaleString()}`)
  if (product.category) parts.push(`category: ${product.category}`)
  if (product.season) parts.push(`used during ${product.season}`)
  if (persona.language && persona.language !== 'english') {
    parts.push(`reviewer speaks ${persona.language} and Nigerian English`)
  }
  return parts.join('. ')
}

function inferLanguageTag(language) {
  const map = {
    hausa: 'hausa-english',
    yoruba: 'yoruba-english',
    igbo: 'igbo-english',
    english: 'standard-english',
  }
  return map[language?.toLowerCase()] || 'english'
}

// ── Mock Fallback ──────────────────────────────────────

async function mockReview({ persona, product }) {
  await new Promise((r) => setTimeout(r, 1800))

  const lang = persona.language?.toLowerCase() || 'english'

  const samples = {
    hausa: {
      rating: 4,
      review: `This ${product.name} na correct one for ${persona.crop}. I use am for my ${persona.farmSize} hectare farm last season for ${persona.state}, the result good but price don go up too much this year. Wallahi, ${product.price ? `₦${Number(product.price).toLocaleString()} ` : ''}is heavy o. If you get the money buy am, but try mix am with manure to stretch am.`,
      language: 'hausa-english',
      confidence: 'high',
      reasoning: `Farmer from ${persona.state} (Hausa speaking region), grows ${persona.crop}, uses ${persona.fertilizerType} fertilizer. Price sensitive given ${persona.farmSize} hectare scale.`,
    },
    yoruba: {
      rating: 3,
      review: `I tried this ${product.name} for my ${persona.crop} farm. E no bad, but I expect more for the money wey I pay. My soil for ${persona.state} dey ${persona.soilType || 'mixed'}, and the product no really match am well. Next season I go try another brand.`,
      language: 'yoruba-english',
      confidence: 'medium',
      reasoning: `Yoruba speaking farmer, skeptical tone, factors in soil compatibility.`,
    },
    igbo: {
      rating: 5,
      review: `Chai, this ${product.name} dey work true true! I plant ${persona.crop} on ${persona.farmSize} hectares and the yield improved well well. I go recommend am to my brother wey dey farm for next village.`,
      language: 'igbo-english',
      confidence: 'high',
      reasoning: `Enthusiastic Igbo speaking farmer, expressive language.`,
    },
    english: {
      rating: 4,
      review: `Solid product for ${persona.crop} cultivation. Applied across my ${persona.farmSize} hectares in ${persona.state} with consistent results. ${product.price ? `At ₦${Number(product.price).toLocaleString()}, ` : ''}it sits at the upper end of what I would pay, but quality justifies it. Will buy again.`,
      language: 'standard-english',
      confidence: 'high',
      reasoning: `Educated farmer profile, formal register, detail oriented.`,
    },
  }

  return samples[lang] || samples.english
}