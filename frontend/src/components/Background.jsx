import { motion } from 'motion/react'

export default function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dotted grid pattern - subtle journal page feel */}
      <DottedGrid />

      {/* Floating ink stamps - decorative review elements */}
      <FloatingStamps />

      {/* Drifting paper-fold shadows */}
      <PaperShadows />

      {/* Corner flourishes */}
      <CornerFlourish position="top-right" />
      <CornerFlourish position="bottom-left" />

      {/* Grain texture overlay */}
      <div className="paper-grain absolute inset-0" />
    </div>
  )
}

function DottedGrid() {
  return (
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(61, 40, 23, 0.18) 1.2px, transparent 1.2px)',
        backgroundSize: '28px 28px',
      }}
    />
  )
}

function FloatingStamps() {
  const stamps = [
    { text: '★ ★ ★ ★', x: '8%', y: '15%', rotation: -8, delay: 0, color: '#C8821D' },
    { text: 'verified', x: '85%', y: '22%', rotation: 5, delay: 0.3, color: '#1A6B3C' },
    { text: '4.7 / 5', x: '12%', y: '70%', rotation: 3, delay: 0.6, color: '#A85A1E' },
    { text: 'authentic', x: '88%', y: '78%', rotation: -4, delay: 0.9, color: '#1A6B3C' },
    { text: '★ ★ ★', x: '50%', y: '8%', rotation: -2, delay: 1.2, color: '#C8821D' },
  ]

  return (
    <>
      {stamps.map((stamp, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 0.12,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 1.2, delay: stamp.delay },
            scale: { duration: 1.2, delay: stamp.delay },
            y: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            position: 'absolute',
            left: stamp.x,
            top: stamp.y,
            transform: `rotate(${stamp.rotation}deg)`,
            color: stamp.color,
            border: `2px solid ${stamp.color}`,
            borderRadius: 4,
            padding: '6px 14px',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {stamp.text}
        </motion.div>
      ))}
    </>
  )
}

function PaperShadows() {
  return (
    <>
      {/* Subtle radial blooms like ink soaking through paper */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          left: '20%',
          top: '30%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(200, 130, 29, 0.08), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          right: '15%',
          bottom: '20%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(26, 107, 60, 0.06), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </>
  )
}

function CornerFlourish({ position }) {
  const positions = {
    'top-right': { top: 24, right: 24, rotation: 90 },
    'bottom-left': { bottom: 24, left: 24, rotation: 270 },
  }
  const pos = positions[position]

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{
        position: 'absolute',
        ...pos,
        transform: `rotate(${pos.rotation}deg)`,
      }}
    >
      <path
        d="M10 10 Q 60 30, 110 10 M10 30 Q 50 50, 90 30 M10 50 Q 40 65, 70 50"
        stroke="#C8821D"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="105" cy="15" r="3" fill="#C8821D" />
      <circle cx="85" cy="35" r="2" fill="#C8821D" />
      <circle cx="65" cy="55" r="1.5" fill="#C8821D" />
    </motion.svg>
  )
}