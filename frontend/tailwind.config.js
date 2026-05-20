/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // AgriVoice palette: harvest-gold dominant
        forest: '#1A6B3C',
        'forest-dark': '#0F4A28',
        harvest: '#C8821D',         // deeper gold than AgriChain's
        'harvest-light': '#E8B556',
        earth: '#3D2817',           // richer brown
        cream: '#F8F1E4',
        paper: '#FBF6EA',
        ink: '#2A1F12',
        seedling: '#F4E9D0',        // warm cream for review backgrounds
        slate: '#5C4A38',
        border: '#E5D9BD',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['"Lora"', 'serif'],  // for handwritten review feel
      },
    },
  },
  plugins: [],
}