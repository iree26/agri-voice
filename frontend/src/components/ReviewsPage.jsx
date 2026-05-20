import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Sparkles, Star, Quote } from 'lucide-react'
import Background from './Background'

export default function ReviewsPage() {
  return (
    <div className="page-bg">
      <Background />
      <div className="page-content">
        {/* Nav */}
        <nav className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-earth hover:text-harvest transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-9 h-9 rounded-xl bg-harvest flex items-center justify-center shadow-md"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <div className="font-display font-bold text-earth leading-none">AgriVoice</div>
              <div className="text-[9px] text-earth/60 font-mono tracking-wider mt-0.5">REVIEW SIMULATION</div>
            </div>
          </div>
          <div className="ink-stamp text-harvest">v0.1 · BETA</div>
        </nav>

        {/* Hero */}
        <div className="px-6 md:px-10 pt-10 pb-6 max-w-6xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-harvest/15 border border-harvest/40 mb-7"
          >
            <Sparkles className="w-3 h-3 text-harvest" />
            <span className="text-xs text-earth font-semibold tracking-wide">BUILD A FARMER · GET THEIR REVIEW</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-earth mb-5 max-w-3xl mx-auto leading-tight"
          >
            Every farmer has a{' '}
            <span className="text-harvest">voice.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif text-base md:text-lg text-earth/75 max-w-2xl mx-auto italic leading-relaxed"
          >
            Build a Nigerian farmer persona, pick a product, and generate a review that sounds like
            it came from that specific person, in their language, in their context.
          </motion.p>
        </div>

        {/* Wavy divider */}
        <div className="divider-wavy max-w-4xl mx-auto w-full my-8" />

        {/* Placeholders for tomorrow's build */}
        <PlaceholderSection title="Persona + Product Forms" subtitle="Two columns. Left: persona builder. Right: product picker. Sample farmer buttons. Generate button." />
        <PlaceholderSection title="Generated Review Output" subtitle="Star rating animates in. Review types out character by character. Language badge, confidence badge, reasoning toggle, regenerate button." />
        <PlaceholderSection title="Comparison Mode" subtitle="Same product reviewed by two different personas, side by side." />
        <PlaceholderSection title="Recent Reviews Log" subtitle="Last 5 generated reviews, scrollable, with copy and re-open buttons." />
      </div>
    </div>
  )
}

function PlaceholderSection({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-10 py-4 max-w-5xl mx-auto w-full"
    >
      <div className="bg-cream/70 border-2 border-dashed border-harvest/40 rounded-2xl p-7">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-4 h-4 text-harvest" />
          <div className="text-xs font-mono uppercase tracking-wider text-harvest font-bold">
            to build tomorrow
          </div>
        </div>
        <div className="font-display font-bold text-earth text-lg mb-1">{title}</div>
        <div className="text-sm text-earth/65 font-serif italic">{subtitle}</div>
      </div>
    </motion.div>
  )
}