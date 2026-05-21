import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Star, Sparkles, Users, ArrowRight, Quote, Globe, X, Check,
  Loader2, Split
} from 'lucide-react'
import { generateReview } from '../lib/api'

const SAMPLE_PERSONAS = [
  {
    id: 'amina', emoji: '🌾', label: 'Amina, 38', sub: 'Hausa rice, Kebbi',
    data: { name: 'Amina', age: 38, state: 'Kebbi', lga: 'Birnin Kebbi', crop: 'rice', farmSize: 2, soilType: 'alluvial', fertilizerType: 'both', fertilizerFrequency: 'twice', language: 'hausa', yearsOfExperience: 15 },
  },
  {
    id: 'chinedu', emoji: '🥔', label: 'Chinedu, 45', sub: 'Igbo cassava, Anambra',
    data: { name: 'Chinedu', age: 45, state: 'Anambra', lga: 'Awka South', crop: 'cassava', farmSize: 5, soilType: 'loamy', fertilizerType: 'natural', fertilizerFrequency: 'once', language: 'igbo', yearsOfExperience: 22 },
  },
  {
    id: 'bola', emoji: '🌽', label: 'Bola, 52', sub: 'Yoruba maize, Oyo',
    data: { name: 'Bola', age: 52, state: 'Oyo', lga: 'Ibadan North', crop: 'maize', farmSize: 12, soilType: 'sandy', fertilizerType: 'artificial', fertilizerFrequency: 'multiple', language: 'yoruba', yearsOfExperience: 30 },
  },
  {
    id: 'grace', emoji: '🍅', label: 'Grace, 29', sub: 'Tomato, Plateau',
    data: { name: 'Grace', age: 29, state: 'Plateau', lga: 'Jos North', crop: 'tomato', farmSize: 1.5, soilType: 'loamy', fertilizerType: 'both', fertilizerFrequency: 'multiple', language: 'english', yearsOfExperience: 6 },
  },
  {
    id: 'sani', emoji: '🌾', label: 'Mallam Sani, 61', sub: 'Sorghum, Sokoto',
    data: { name: 'Mallam Sani', age: 61, state: 'Sokoto', lga: 'Sokoto South', crop: 'sorghum', farmSize: 4, soilType: 'laterite', fertilizerType: 'natural', fertilizerFrequency: 'never', language: 'hausa', yearsOfExperience: 40 },
  },
]

export default function ComparisonMode() {
  const [isOpen, setIsOpen] = useState(false)
  const [personaA, setPersonaA] = useState(SAMPLE_PERSONAS[0])
  const [personaB, setPersonaB] = useState(SAMPLE_PERSONAS[1])
  const [product, setProduct] = useState({
    category: 'fertilizer',
    name: 'Notore NPK 15:15:15',
    price: '35000',
    brand: 'Notore',
    season: 'wet season',
  })
  const [reviewA, setReviewA] = useState(null)
  const [reviewB, setReviewB] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCompare = async () => {
    if (personaA.id === personaB.id) return
    setIsLoading(true)
    setReviewA(null)
    setReviewB(null)
    try {
      const [resA, resB] = await Promise.all([
        generateReview({ persona: personaA.data, product }),
        generateReview({ persona: personaB.data, product }),
      ])
      setReviewA(resA)
      setReviewB(resB)
    } catch (err) {
      console.error('Comparison failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return <ComparisonTeaser onOpen={() => setIsOpen(true)} />
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-10 py-10 max-w-6xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Split className="w-5 h-5 text-harvest" />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-earth">
              Side by side comparison
            </h2>
          </div>
          <p className="text-sm text-earth/70 font-serif italic">
            Same product. Two farmers. Watch how the voice changes.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="shrink-0 w-9 h-9 rounded-full bg-cream border border-border hover:border-harvest/50 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-earth" />
        </button>
      </div>

      {/* Persona picker row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch mb-5">
        <PersonaPicker
          label="Persona A"
          selected={personaA}
          options={SAMPLE_PERSONAS.filter((p) => p.id !== personaB.id)}
          onChange={setPersonaA}
          accent="harvest"
        />

        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-cream border-2 border-border flex items-center justify-center">
            <span className="font-display font-bold text-earth text-xs">VS</span>
          </div>
        </div>

        <PersonaPicker
          label="Persona B"
          selected={personaB}
          options={SAMPLE_PERSONAS.filter((p) => p.id !== personaA.id)}
          onChange={setPersonaB}
          accent="forest"
        />
      </div>

      {/* Shared product */}
      <ProductBar product={product} setProduct={setProduct} />

      {/* Compare button */}
      <div className="mt-6 mb-8 text-center">
        <motion.button
          whileHover={!isLoading ? { scale: 1.03 } : {}}
          whileTap={!isLoading ? { scale: 0.97 } : {}}
          onClick={handleCompare}
          disabled={isLoading || personaA.id === personaB.id}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all ${
            isLoading || personaA.id === personaB.id
              ? 'bg-earth/15 text-earth/40 cursor-not-allowed'
              : 'bg-harvest text-white shadow-lg cursor-pointer'
          }`}
          style={
            !isLoading && personaA.id !== personaB.id
              ? { boxShadow: '0 4px 0 #3D2817, 0 8px 20px rgba(61, 40, 23, 0.25)' }
              : {}
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating both reviews...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Compare reviews
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>

      {/* Result cards */}
      <AnimatePresence mode="wait">
        {(reviewA || reviewB || isLoading) && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            <ComparisonReviewCard
              persona={personaA}
              review={reviewA}
              isLoading={isLoading}
              accent="harvest"
              delay={0}
            />
            <ComparisonReviewCard
              persona={personaB}
              review={reviewB}
              isLoading={isLoading}
              accent="forest"
              delay={0.2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight banner once both reviews are done */}
      {reviewA && reviewB && (
        <ComparisonInsight personaA={personaA} reviewA={reviewA} personaB={personaB} reviewB={reviewB} />
      )}
    </motion.section>
  )
}

// ── TEASER ───────────────────────────────────────────────
function ComparisonTeaser({ onOpen }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-10 py-6 max-w-5xl mx-auto w-full"
    >
      <motion.button
        whileHover={{ y: -3 }}
        onClick={onOpen}
        className="w-full text-left bg-cream border-2 border-border rounded-2xl p-6 card-elevated hover:border-harvest/50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-harvest/15 flex items-center justify-center shrink-0">
            <Split className="w-7 h-7 text-harvest" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-bold text-earth text-lg">Comparison mode</h3>
              <span className="ink-stamp text-forest text-[8px] py-0.5">try it</span>
            </div>
            <p className="text-sm text-earth/70 font-serif italic">
              Generate the same product reviewed by two different farmers, side by side. Prove
              the AI's persona sensitivity in one click.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-harvest group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </motion.button>
    </motion.section>
  )
}

// ── PERSONA PICKER ──────────────────────────────────────
function PersonaPicker({ label, selected, options, onChange, accent }) {
  const accentClass = accent === 'harvest' ? 'border-harvest/40 bg-harvest/5' : 'border-forest/40 bg-forest/5'
  const labelClass = accent === 'harvest' ? 'text-harvest' : 'text-forest'

  return (
    <div className={`bg-cream border-2 rounded-2xl p-4 ${accentClass}`}>
      <div className={`text-[10px] font-mono uppercase tracking-wider font-bold mb-3 ${labelClass}`}>
        ★ {label}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-paper border border-border flex items-center justify-center text-2xl shrink-0">
          {selected.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-earth text-sm leading-none">{selected.label}</div>
          <div className="text-[11px] text-earth/65 mt-1">{selected.sub}</div>
        </div>
      </div>
      <select
        value={selected.id}
        onChange={(e) => onChange(options.find((p) => p.id === e.target.value) || selected)}
        className="w-full bg-white border-2 border-border rounded-lg py-2 px-3 text-xs text-earth focus:outline-none focus:border-harvest cursor-pointer font-medium"
      >
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label} · {p.sub}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── PRODUCT BAR ─────────────────────────────────────────
function ProductBar({ product, setProduct }) {
  return (
    <div className="bg-paper border-2 border-dashed border-earth/20 rounded-2xl p-4">
      <div className="text-[10px] font-mono uppercase tracking-wider text-earth/70 font-bold mb-3">
        ★ Shared product (both will review this)
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Product name"
          className="bg-white border-2 border-border rounded-lg py-2.5 px-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-harvest font-medium"
        />
        <input
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          placeholder="Brand (optional)"
          className="bg-white border-2 border-border rounded-lg py-2.5 px-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-harvest font-medium"
        />
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          placeholder="Price ₦"
          className="bg-white border-2 border-border rounded-lg py-2.5 px-3 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-harvest font-medium font-mono"
        />
      </div>
    </div>
  )
}

// ── COMPARISON REVIEW CARD ──────────────────────────────
function ComparisonReviewCard({ persona, review, isLoading, accent, delay }) {
  const accentBorder = accent === 'harvest' ? 'border-harvest/40' : 'border-forest/40'
  const accentBar = accent === 'harvest'
    ? 'bg-gradient-to-r from-harvest to-harvest-light'
    : 'bg-gradient-to-r from-forest to-growth'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-cream border-2 ${accentBorder} rounded-2xl card-elevated overflow-hidden relative`}
    >
      <div className={`h-1.5 ${accentBar}`} />

      <div className="p-5">
        {/* Persona header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-full bg-paper border border-border flex items-center justify-center text-xl shrink-0">
            {persona.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-earth text-sm leading-none">{persona.label}</div>
            <div className="text-[11px] text-earth/65 mt-1">{persona.sub}</div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : review ? (
          <>
            {/* Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + i * 0.06,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <Star
                    className={`w-5 h-5 ${i <= review.rating ? (accent === 'harvest' ? 'text-harvest' : 'text-forest') : 'text-earth/15'}`}
                    fill={i <= review.rating ? 'currentColor' : 'none'}
                  />
                </motion.div>
              ))}
              <span className="ml-2 text-sm font-display font-bold text-earth">
                {review.rating}/5
              </span>
            </div>

            {/* Review text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative mt-4 mb-4"
            >
              <Quote className="absolute -top-1 -left-1 w-4 h-4 text-earth/20" />
              <p className="pl-5 font-serif italic text-sm text-earth leading-relaxed">
                "{review.review}"
              </p>
            </motion.div>

            {/* Language tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-3 border-t border-border flex items-center gap-2"
            >
              <Globe className="w-3 h-3 text-earth/60" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-earth/70 font-semibold">
                {review.language || 'English'}
              </span>
            </motion.div>
          </>
        ) : null}
      </div>
    </motion.div>
  )
}

// ── LOADING STATE ───────────────────────────────────────
function LoadingState() {
  return (
    <div className="py-6 flex flex-col items-center justify-center text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-harvest border-t-transparent rounded-full mb-3"
      />
      <span className="text-xs font-mono uppercase tracking-wider text-earth/60">
        Generating...
      </span>
    </div>
  )
}

// ── INSIGHT BANNER ──────────────────────────────────────
function ComparisonInsight({ personaA, reviewA, personaB, reviewB }) {
  const ratingDiff = Math.abs(reviewA.rating - reviewB.rating)
  const sameRating = reviewA.rating === reviewB.rating
  const differentLanguage = reviewA.language !== reviewB.language

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="mt-8 bg-paper border-2 border-dashed border-harvest/40 rounded-2xl p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-harvest/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-harvest" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-harvest font-bold mb-2">
            ★ persona sensitivity
          </div>
          <div className="font-display font-bold text-earth mb-2">
            {sameRating
              ? `Both rated ${reviewA.rating} stars but the voice differs.`
              : `Rating gap: ${ratingDiff} stars between ${personaA.data.name} (${reviewA.rating}) and ${personaB.data.name} (${reviewB.rating}).`}
          </div>
          <div className="text-sm text-earth/75 font-serif italic">
            {differentLanguage
              ? `${personaA.data.name} responds in ${reviewA.language}, ${personaB.data.name} in ${reviewB.language}. Same product, different cultural lens, different voice. This is what behavioral fidelity looks like.`
              : `Same language register, but notice how the framing shifts based on crop, scale, and farming experience. The agent isn't producing one review with different names. It's reasoning from each persona.`}
          </div>
        </div>
      </div>
    </motion.div>
  )
}