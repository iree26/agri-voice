const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Generate a review for a given persona and product.
 * Returns { rating, review, language, reasoning }
 */
export async function generateReview({ persona, product }) {
  // Mock fallback for development before backend is ready
  if (!API_URL || API_URL.includes('localhost') && !import.meta.env.VITE_API_LIVE) {
    return mockReview({ persona, product })
  }

  const res = await fetch(`${API_URL}/api/generate-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, product }),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`Review generation failed (${res.status}): ${errorText}`)
  }

  return res.json()
}

/**
 * Quick mock for frontend development before Temi finishes the endpoint.
 * Returns realistic looking output based on persona type.
 */
async function mockReview({ persona, product }) {
    await new Promise((r) => setTimeout(r, 1800))
  
    const lang = persona.language?.toLowerCase() || 'english'
  
    const samples = {
      hausa: {
        rating: 4,
        review: `This ${product.name} na correct one for ${persona.crop}. I use am for my ${persona.farmSize} hectare farm last season for ${persona.state}, the result good but price don go up too much this year. Wallahi, ${product.price ? `₦${Number(product.price).toLocaleString()} ` : ''}is heavy o. If you get the money buy am, but try mix am with manure to stretch am.`,
        language: 'hausa-english',
        reasoning: `Farmer is from ${persona.state} (Hausa speaking region), grows ${persona.crop}, uses ${persona.fertilizerType} fertilizer. Price sensitive given ${persona.farmSize} hectare scale. Pidgin and Hausa expressions woven in naturally.`,
      },
      yoruba: {
        rating: 3,
        review: `I tried this ${product.name} for my ${persona.crop} farm. E no bad, but I expect more for the money wey I pay. My soil for ${persona.state} dey ${persona.soilType || 'mixed'}, and the product no really match am well. Next season I go try another brand. For ${persona.farmSize} hectares, e too cost.`,
        language: 'yoruba-english',
        reasoning: `Yoruba speaking farmer in ${persona.state}, more skeptical tone, factors in soil compatibility. Heavy code switching to Pidgin.`,
      },
      igbo: {
        rating: 5,
        review: `Chai, this ${product.name} dey work true true! I plant ${persona.crop} on ${persona.farmSize} hectares and the yield improved well well. The soil here na ${persona.soilType || 'good'} and e match the product perfectly. ${product.price ? `For ₦${Number(product.price).toLocaleString()}, ` : ''}I no regret am at all. I go recommend am to my brother wey dey farm for next village.`,
        language: 'igbo-english',
        reasoning: `Enthusiastic Igbo speaking farmer, expressive language with "chai" and "true true". Positive bias when product matches their setup.`,
      },
      english: {
        rating: 4,
        review: `Solid product for ${persona.crop} cultivation. I applied it across my ${persona.farmSize} hectares in ${persona.state} and saw consistent results. The ${persona.soilType || 'soil'} here responded well. ${product.price ? `At ₦${Number(product.price).toLocaleString()}, ` : ''}it sits at the upper end of what I would pay, but the quality justifies it. Will buy again next planting season.`,
        language: 'standard-english',
        reasoning: `Educated farmer profile, more formal register, detail oriented, less code switching.`,
      },
    }
  
    return samples[lang] || samples.english
  }