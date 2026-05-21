import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Star, Quote, Copy, Check, RotateCcw, Globe, Sparkles,
  ChevronDown, ChevronUp, Brain, Volume2
} from 'lucide-react'

export default function ReviewOutputCard({
  review,
  persona,
  product,
  onRegenerate,
  isRegenerating
}) {
  const [copied, setCopied] = useState(false)
  const [showReasoning, setShowReasoning] = useState(false)

  if (!review) return null

  const handleCopy = () => {
    const text = `${persona.name} (${cap(persona.crop)} farmer, ${persona.state})\n\n${review.rating} / 5 stars\n\n"${review.review}"`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-10 py-10 max-w-4xl mx-auto w-full"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 mb-5"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Sparkles className="w-5 h-5 text-harvest" />
        </motion.div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-earth">
          Their review
        </h2>
      </motion.div>

      {/* The review card itself */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative pinned-card bg-cream border-2 border-border rounded-2xl card-elevated overflow-hidden"
      >
        {/* Top accent stripe */}
        <div className="h-2 bg-gradient-to-r from-harvest via-harvest-light to-harvest" />

        {/* "Just generated" stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="absolute top-4 right-4 ink-stamp bg-paper text-forest z-10"
        >
          ★ just generated
        </motion.div>

        <div className="p-6 md:p-8">
          {/* Persona row */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-12 h-12 rounded-full bg-harvest/20 flex items-center justify-center text-2xl shrink-0">
              {personaEmoji(persona.crop)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-earth text-lg">
                {persona.name}{persona.age ? `, ${persona.age}` : ''}
              </div>
              <div className="text-xs text-earth/65">
                {cap(persona.crop)} farmer · {persona.state}
                {persona.lga ? `, ${persona.lga}` : ''}
                {persona.farmSize ? ` · ${persona.farmSize} hectares` : ''}
                {persona.yearsOfExperience ? ` · ${persona.yearsOfExperience} years farming` : ''}
              </div>
            </div>
          </motion.div>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + i * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <Star
                  className={`w-8 h-8 ${i <= review.rating ? 'text-harvest' : 'text-earth/15'}`}
                  fill={i <= review.rating ? 'currentColor' : 'none'}
                  strokeWidth={1.8}
                />
              </motion.div>
            ))}
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="ml-3 text-lg font-display font-bold text-earth"
            >
              {review.rating} / 5
            </motion.span>
          </div>

          {/* Product line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-earth/60 font-mono mb-5 uppercase tracking-wider"
          >
            Reviewing · {product.name}
            {product.brand ? ` · ${product.brand}` : ''}
            {product.price ? ` · ₦${Number(product.price).toLocaleString()}` : ''}
          </motion.div>

          {/* The actual review with quote marks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="relative mb-6"
          >
            <Quote className="absolute -top-2 -left-1 w-6 h-6 text-harvest/30" />
            <div className="pl-8 pr-4">
              <TypedReview text={review.review} />
            </div>
          </motion.div>

          {/* Tags row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="flex flex-wrap items-center gap-2 mb-5 pt-4 border-t border-border"
          >
            <LanguageBadge language={review.language} />
            <ConfidenceBadge confidence={review.confidence || 'high'} />
            <CategoryBadge category={product.category} />
          </motion.div>

          {/* Reasoning toggle */}
          {review.reasoning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
              className="mb-5"
            >
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-earth/70 hover:text-harvest transition-colors"
              >
                <Brain className="w-3.5 h-3.5" />
                {showReasoning ? 'Hide reasoning' : 'Why this rating + voice?'}
                {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <AnimatePresence>
                {showReasoning && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-forest/5 border border-forest/15">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold mb-2">
                        Agent reasoning
                      </div>
                      <div className="text-xs text-earth/80 leading-relaxed font-serif italic">
                        {review.reasoning}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-harvest text-white font-semibold rounded-full hover:bg-earth transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isRegenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Regenerating...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-border text-earth font-semibold rounded-full hover:border-harvest transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-forest" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy review
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

// ── TYPED REVIEW (letter by letter animation) ──────────
function TypedReview({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval)
        setIsDone(true)
        return
      }
      setDisplayed(text.slice(0, i + 1))
      i++
    }, 18)
    return () => clearInterval(interval)
  }, [text])

  return (
    <p className={`font-serif italic text-base md:text-lg text-earth leading-relaxed ${!isDone ? 'typing-cursor' : ''}`}>
      "{displayed}"
    </p>
  )
}

// ── BADGES ──────────────────────────────────────────────
function LanguageBadge({ language }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-harvest/10 border border-harvest/30">
      <Globe className="w-3 h-3 text-harvest" />
      <span className="text-[10px] font-mono uppercase tracking-wider text-harvest font-semibold">
        {language || 'English'}
      </span>
    </div>
  )
}

function ConfidenceBadge({ confidence }) {
  const styles = {
    high: { bg: 'bg-forest/10', text: 'text-forest', border: 'border-forest/30', dot: 'bg-forest' },
    medium: { bg: 'bg-harvest/15', text: 'text-harvest', border: 'border-harvest/40', dot: 'bg-harvest' },
    low: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
  }
  const style = styles[confidence?.toLowerCase()] || styles.high

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${style.bg} ${style.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${style.text}`}>
        {cap(confidence || 'high')} confidence
      </span>
    </div>
  )
}

function CategoryBadge({ category }) {
  if (!category) return null
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth/10 border border-earth/20">
      <span className="text-[10px] font-mono uppercase tracking-wider text-earth/70 font-semibold">
        {category}
      </span>
    </div>
  )
}

// ── HELPERS ─────────────────────────────────────────────
function personaEmoji(crop) {
  const map = {
    rice: '🌾', maize: '🌽', cassava: '🥔', yam: '🍠', tomato: '🍅',
    sorghum: '🌾', beans: '🌱', groundnut: '🥜', cocoa: '🌰', cotton: '🌿',
  }
  return map[crop?.toLowerCase()] || '🌱'
}

function cap(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}