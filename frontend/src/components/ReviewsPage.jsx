import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router-dom'
import {
  Star, Sparkles, ArrowLeft, User, Package, Send, Copy, RotateCcw,
  Check, ChevronDown, ChevronUp, Globe, BookOpen, MapPin, Sprout, Leaf
} from 'lucide-react'

export default function ReviewsPage() {
  return (
    <div className="page-bg">
      <div className="page-content">
        {/* Nav */}
        <nav className="px-6 md:px-10 pt-5 pb-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-earth hover:text-harvest transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-harvest flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-earth">AgriVoice</span>
          </div>
          <div className="text-xs text-earth/70 font-mono">v0.1 · BETA</div>
        </nav>

        {/* Hero */}
        <div className="px-6 md:px-10 pt-8 pb-6 max-w-6xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-harvest/10 border border-harvest/30 mb-5"
          >
            <Sparkles className="w-3 h-3 text-harvest" />
            <span className="text-xs text-earth font-semibold">Review simulation. Built for Nigerian voices.</span>
          </motion.div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-earth mb-4 leading-tight">
            Reviews in the voice of the{' '}
            <span className="text-harvest">farmer who would write them.</span>
          </h1>
          <p className="text-base md:text-lg text-earth/75 max-w-2xl mx-auto">
            Build a persona. Pick a product. Generate a star rating and a written review that
            sounds like it came from that specific Nigerian farmer.
          </p>
        </div>

        {/* TODO: Two column layout - Persona form (left), Product form (right) */}
        <PlaceholderSection title="Persona + Product Forms" />

        {/* TODO: Generated review output card */}
        <PlaceholderSection title="Generated Review Output" />

        {/* TODO: Session log of last 5 reviews */}
        <PlaceholderSection title="Recent Reviews" />
      </div>
    </div>
  )
}

function PlaceholderSection({ title }) {
  return (
    <div className="px-6 md:px-10 py-6 max-w-6xl mx-auto w-full">
      <div className="bg-cream border border-border rounded-2xl p-6 card-elevated">
        <div className="text-xs font-mono uppercase tracking-wider text-harvest font-semibold mb-2">
          to build tomorrow
        </div>
        <div className="font-display font-bold text-earth text-lg">{title}</div>
      </div>
    </div>
  )
}