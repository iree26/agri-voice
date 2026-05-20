import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Star, Quote, Zap, Globe } from 'lucide-react'
import Background from './Background'

export default function Landing() {
  return (
    <div className="page-bg">
      <Background />
      <div className="page-content">
        {/* Nav */}
        <nav className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-10 h-10 rounded-xl bg-harvest flex items-center justify-center shadow-md"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="font-display font-bold text-lg text-earth leading-none">AgriVoice</div>
              <div className="text-[10px] text-earth/60 font-mono tracking-wider mt-0.5">REVIEW SIMULATION</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="ink-stamp text-harvest"
          >
            v0.1 · BETA
          </motion.div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16 md:py-20 relative">
          {/* Floating decorative stars */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute top-20 left-[12%] hidden md:block"
          >
            <Star className="w-8 h-8 text-harvest float-slow" fill="currentColor" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute top-32 right-[15%] hidden md:block"
          >
            <Quote className="w-10 h-10 text-forest float-fast" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="absolute bottom-24 left-[20%] hidden md:block"
          >
            <Star className="w-6 h-6 text-earth float-slow" fill="currentColor" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-harvest/15 border border-harvest/40 mb-7"
          >
            <Zap className="w-3 h-3 text-harvest" />
            <span className="text-xs text-earth font-semibold tracking-wide">USER MODELING FOR NIGERIAN FARMERS</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.05] text-earth"
          >
            Reviews in the{' '}
            <span className="relative inline-block">
              <span className="text-harvest">voice</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-harvest/40 origin-left"
                style={{ borderRadius: 999 }}
              />
            </span>
            <br />
            of the farmer who would write them.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-serif text-lg md:text-xl text-earth/80 max-w-2xl mb-10 leading-relaxed italic"
          >
            "AgriVoice simulates authentic Nigerian farmer reviews using rich persona modeling.
            Build a farmer, pick a product, hear how they would rate it."
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/reviews">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-harvest text-white font-bold rounded-full shadow-lg hover:shadow-2xl transition-shadow"
                style={{ boxShadow: '0 6px 0 #3D2817, 0 10px 30px rgba(61, 40, 23, 0.3)' }}
              >
                Generate a review
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Sample review preview - the killer demo element */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 w-full max-w-2xl"
          >
            <SampleReviewCard />
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full"
          >
            {[
              { value: '4', label: 'Nigerian languages supported' },
              { value: '6', label: 'Product categories' },
              { value: '∞', label: 'Unique farmer personas' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-harvest mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-earth/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-6 py-10 text-xs text-earth/70"
        >
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            Hausa · Yoruba · Igbo · Pidgin · English
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── SAMPLE REVIEW CARD (HERO DEMO) ──────────────────
function SampleReviewCard() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative pinned-card bg-cream border-2 border-border rounded-2xl p-6 card-elevated"
    >
      {/* "Just generated" stamp */}
      <div className="absolute -top-3 right-6 ink-stamp bg-paper text-harvest">
        ★ just generated
      </div>

      {/* Persona header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-harvest/20 flex items-center justify-center text-2xl">
          🌾
        </div>
        <div className="flex-1 text-left">
          <div className="font-display font-bold text-earth">Amina, 38</div>
          <div className="text-xs text-earth/60">Rice farmer · Kebbi · 2 hectares · Hausa speaker</div>
        </div>
      </div>

      {/* Animated stars */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.4,
              delay: 1 + i * 0.1,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <Star
              className={`w-6 h-6 ${i <= 4 ? 'text-harvest' : 'text-earth/20'}`}
              fill={i <= 4 ? 'currentColor' : 'none'}
            />
          </motion.div>
        ))}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="ml-2 text-sm font-bold text-earth"
        >
          4 / 5
        </motion.span>
      </div>

      {/* Product line */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-earth/60 font-mono mb-3"
      >
        REVIEWING · Notore NPK 15:15:15 · ₦35,000
      </motion.div>

      {/* The review - typed in */}
      <TypedReview />

      {/* Language tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="mt-4 pt-3 border-t border-border flex items-center gap-2"
      >
        <Globe className="w-3 h-3 text-earth/60" />
        <span className="text-xs text-earth/70 font-mono">HAUSA-ENGLISH · code-switched naturally</span>
      </motion.div>
    </motion.div>
  )
}

function TypedReview() {
  const text = `"This NPK na correct one for rice. I use am for my 2 hectares last season for Kebbi, the result good but price don go up too much this year. Wallahi, ₦35,000 is heavy o..."`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="font-serif italic text-earth leading-relaxed text-left"
    >
      <TypingText text={text} />
    </motion.div>
  )
}

function TypingText({ text }) {
  return (
    <motion.span
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      transition={{ duration: 2.5, delay: 0.8, ease: 'linear' }}
      style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'normal' }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: 0.8 + i * 0.02 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}