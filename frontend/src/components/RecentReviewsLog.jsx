import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Star, Clock, Copy, Check, X, Quote, Globe,
  ScrollText, ChevronRight, Trash2
} from 'lucide-react'

export default function RecentReviewsLog({ history, onClear }) {
  const [expandedId, setExpandedId] = useState(null)

  if (!history || history.length === 0) {
    return <EmptyState />
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-10 py-10 max-w-6xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-harvest" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-earth">
            Recent reviews
          </h2>
          <span className="ink-stamp text-earth/70 ml-2">
            {history.length} / 5
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth/60 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <p className="text-sm text-earth/65 font-serif italic mb-6">
        Your last few generations. Click any review to expand.
      </p>

      {/* Reviews stack */}
      <div className="space-y-3">
        <AnimatePresence>
          {history.map((entry, i) => (
            <ReviewLogItem
              key={entry.id}
              entry={entry}
              index={i}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

// ── EMPTY STATE ─────────────────────────────────────────
function EmptyState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-10 py-8 max-w-5xl mx-auto w-full"
    >
      <div className="bg-cream/70 border-2 border-dashed border-earth/20 rounded-2xl p-8 text-center">
        <ScrollText className="w-8 h-8 text-earth/30 mx-auto mb-3" />
        <div className="font-display font-bold text-earth mb-1">No reviews yet</div>
        <div className="text-sm text-earth/60 font-serif italic">
          Generate a review above to start your log.
        </div>
      </div>
    </motion.section>
  )
}

// ── LOG ITEM ────────────────────────────────────────────
function ReviewLogItem({ entry, index, isExpanded, onToggle }) {
  const [copied, setCopied] = useState(false)
  const { review, persona, product, timestamp } = entry

  const handleCopy = (e) => {
    e.stopPropagation()
    const text = `${persona.name} (${cap(persona.crop)} farmer, ${persona.state})\n\n${review.rating} / 5 stars\n\n"${review.review}"`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`bg-cream border-2 rounded-2xl overflow-hidden transition-colors cursor-pointer ${
        isExpanded ? 'border-harvest/50' : 'border-border hover:border-harvest/30'
      }`}
      onClick={onToggle}
    >
      {/* Collapsed row */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-paper border border-border flex items-center justify-center text-xl shrink-0">
          {personaEmoji(persona.crop)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-earth text-sm">
              {persona.name}
            </span>
            <span className="text-xs text-earth/60">
              · {cap(persona.crop)} · {persona.state}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= review.rating ? 'text-harvest' : 'text-earth/15'}`}
                fill={i <= review.rating ? 'currentColor' : 'none'}
              />
            ))}
            <span className="ml-1 text-[10px] font-mono text-earth/60">
              · {review.language || 'english'}
            </span>
          </div>
        </div>

        <div className="hidden sm:block text-right shrink-0">
          <div className="text-xs text-earth/60 font-mono">
            <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
            {timeAgo(timestamp)}
          </div>
          <div className="text-[10px] text-earth/50 mt-0.5 truncate max-w-[160px]">
            {product.name}
          </div>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 text-earth/60" />
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border bg-paper/50">
              {/* Product details */}
              <div className="text-[10px] font-mono uppercase tracking-wider text-earth/60 mb-3 mt-2">
                REVIEWING · {product.name}
                {product.brand ? ` · ${product.brand}` : ''}
                {product.price ? ` · ₦${Number(product.price).toLocaleString()}` : ''}
              </div>

              {/* Review text */}
              <div className="relative mb-4">
                <Quote className="absolute -top-1 -left-1 w-4 h-4 text-harvest/30" />
                <p className="pl-5 font-serif italic text-sm text-earth leading-relaxed">
                  "{review.review}"
                </p>
              </div>

              {/* Reasoning */}
              {review.reasoning && (
                <div className="p-3 rounded-lg bg-forest/5 border border-forest/15 mb-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-forest font-bold mb-1">
                    Agent reasoning
                  </div>
                  <div className="text-xs text-earth/80 leading-relaxed font-serif italic">
                    {review.reasoning}
                  </div>
                </div>
              )}

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-border rounded-full text-xs font-semibold text-earth hover:border-harvest transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-forest" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}