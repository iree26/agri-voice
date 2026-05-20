import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Star } from 'lucide-react'

export default function Landing() {
  return (
    <div className="page-bg">
      <div className="page-content">
        <nav className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-harvest flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-earth">AgriVoice</span>
          </div>
          <div className="text-xs text-earth/70 font-mono">v0.1 · BETA</div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest/10 border border-harvest/30 mb-6"
          >
            <Star className="w-3 h-3 text-harvest" />
            <span className="text-xs text-earth font-semibold">User Modeling for Nigerian Farmers</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-earth max-w-3xl leading-tight mb-6"
          >
            Reviews from the{' '}
            <span className="text-harvest">voice that would write them.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-earth/75 max-w-xl mb-10"
          >
            AgriVoice simulates authentic Nigerian farmer reviews and ratings using rich
            persona modeling. Build a farmer, pick a product, hear how they would rate it.
          </motion.p>

          <Link to="/reviews">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-harvest text-white font-semibold rounded-full hover:bg-earth transition-colors shadow-lg"
            >
              Generate a review
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}