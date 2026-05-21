import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  User, Package, MapPin, Sprout, Leaf, Globe, Calendar,
  Beaker, Layers, Tag, Banknote, ArrowRight, Sparkles, Check, X
} from 'lucide-react'

const SAMPLE_PERSONAS = [
  {
    id: 'amina',
    emoji: '🌾',
    label: 'Amina, 38',
    sub: 'Hausa rice farmer, Kebbi',
    data: {
      name: 'Amina',
      age: 38,
      state: 'Kebbi',
      lga: 'Birnin Kebbi',
      crop: 'rice',
      farmSize: 2,
      soilType: 'alluvial',
      fertilizerType: 'both',
      fertilizerFrequency: 'twice',
      language: 'hausa',
      yearsOfExperience: 15,
    },
  },
  {
    id: 'chinedu',
    emoji: '🥔',
    label: 'Chinedu, 45',
    sub: 'Igbo cassava farmer, Anambra',
    data: {
      name: 'Chinedu',
      age: 45,
      state: 'Anambra',
      lga: 'Awka South',
      crop: 'cassava',
      farmSize: 5,
      soilType: 'loamy',
      fertilizerType: 'natural',
      fertilizerFrequency: 'once',
      language: 'igbo',
      yearsOfExperience: 22,
    },
  },
  {
    id: 'bola',
    emoji: '🌽',
    label: 'Bola, 52',
    sub: 'Yoruba maize farmer, Oyo',
    data: {
      name: 'Bola',
      age: 52,
      state: 'Oyo',
      lga: 'Ibadan North',
      crop: 'maize',
      farmSize: 12,
      soilType: 'sandy',
      fertilizerType: 'artificial',
      fertilizerFrequency: 'multiple',
      language: 'yoruba',
      yearsOfExperience: 30,
    },
  },
  {
    id: 'grace',
    emoji: '🍅',
    label: 'Grace, 29',
    sub: 'Tomato farmer, Plateau',
    data: {
      name: 'Grace',
      age: 29,
      state: 'Plateau',
      lga: 'Jos North',
      crop: 'tomato',
      farmSize: 1.5,
      soilType: 'loamy',
      fertilizerType: 'both',
      fertilizerFrequency: 'multiple',
      language: 'english',
      yearsOfExperience: 6,
    },
  },
  {
    id: 'sani',
    emoji: '🌾',
    label: 'Mallam Sani, 61',
    sub: 'Sorghum farmer, Sokoto',
    data: {
      name: 'Mallam Sani',
      age: 61,
      state: 'Sokoto',
      lga: 'Sokoto South',
      crop: 'sorghum',
      farmSize: 4,
      soilType: 'laterite',
      fertilizerType: 'natural',
      fertilizerFrequency: 'never',
      language: 'hausa',
      yearsOfExperience: 40,
    },
  },
]

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

const CROPS = ['rice', 'maize', 'cassava', 'yam', 'tomato', 'sorghum', 'beans', 'groundnut', 'cocoa', 'cotton']
const SOIL_TYPES = ['loamy', 'clay', 'sandy', 'alluvial', 'laterite', 'unsure']
const FERTILIZER_TYPES = ['natural', 'artificial', 'both', 'none']
const FERTILIZER_FREQ = ['never', 'once', 'twice', 'multiple']
const LANGUAGES = [
  { id: 'hausa', label: 'Hausa' },
  { id: 'yoruba', label: 'Yoruba' },
  { id: 'igbo', label: 'Igbo' },
  { id: 'english', label: 'English' },
]
const PRODUCT_CATEGORIES = [
  { id: 'fertilizer', label: 'Fertilizer', emoji: '🧪' },
  { id: 'seed', label: 'Seed / seedling', emoji: '🌱' },
  { id: 'tool', label: 'Tool / equipment', emoji: '🛠️' },
  { id: 'service', label: 'Service', emoji: '🚜' },
  { id: 'loan', label: 'Loan / finance', emoji: '💰' },
  { id: 'pesticide', label: 'Pesticide', emoji: '🧴' },
]

export default function PersonaProductForms({ onGenerate, isGenerating }) {
  const [persona, setPersona] = useState({
    name: '', age: '', state: '', lga: '', crop: '', farmSize: '',
    soilType: '', fertilizerType: '', fertilizerFrequency: '',
    language: '', yearsOfExperience: '',
  })
  const [product, setProduct] = useState({
    category: '', name: '', price: '', brand: '', season: '',
  })
  const [activeSample, setActiveSample] = useState(null)

  const updatePersona = (field, value) => {
    setPersona({ ...persona, [field]: value })
    setActiveSample(null)
  }

  const updateProduct = (field, value) => {
    setProduct({ ...product, [field]: value })
  }

  const loadSample = (sample) => {
    setPersona(sample.data)
    setActiveSample(sample.id)
  }

  const clearAll = () => {
    setPersona({
      name: '', age: '', state: '', lga: '', crop: '', farmSize: '',
      soilType: '', fertilizerType: '', fertilizerFrequency: '',
      language: '', yearsOfExperience: '',
    })
    setProduct({ category: '', name: '', price: '', brand: '', season: '' })
    setActiveSample(null)
  }

  const personaValid = persona.name && persona.crop && persona.state && persona.language
  const productValid = product.category && product.name
  const canGenerate = personaValid && productValid && !isGenerating

  const handleSubmit = () => {
    if (!canGenerate) return
    onGenerate({ persona, product })
  }

  return (
    <section className="px-6 md:px-10 py-6 max-w-6xl mx-auto w-full">
      <SampleRow
        samples={SAMPLE_PERSONAS}
        activeSample={activeSample}
        onLoad={loadSample}
        onClear={clearAll}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <PersonaForm persona={persona} update={updatePersona} />
        <ProductForm product={product} update={updateProduct} />
      </div>

      <GenerateButton
        canGenerate={canGenerate}
        isGenerating={isGenerating}
        onSubmit={handleSubmit}
        personaValid={personaValid}
        productValid={productValid}
      />
    </section>
  )
}

function SampleRow({ samples, activeSample, onLoad, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-harvest" />
        <span className="text-xs font-mono uppercase tracking-wider text-earth/70 font-semibold">
          Quick start. Pick a sample farmer
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {samples.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLoad(s)}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border-2 transition-all ${
              activeSample === s.id
                ? 'bg-harvest text-white border-harvest shadow-md'
                : 'bg-cream border-border hover:border-harvest/50 text-earth'
            }`}
          >
            <span className="text-xl">{s.emoji}</span>
            <div className="text-left">
              <div className={`text-sm font-semibold ${activeSample === s.id ? 'text-white' : 'text-earth'}`}>
                {s.label}
              </div>
              <div className={`text-[10px] ${activeSample === s.id ? 'text-white/85' : 'text-earth/60'}`}>
                {s.sub}
              </div>
            </div>
          </motion.button>
        ))}
        {activeSample && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={onClear}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-dashed border-earth/30 text-earth/70 text-xs font-semibold hover:border-earth/60"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

function PersonaForm({ persona, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-cream border-2 border-border rounded-2xl p-6 card-elevated relative"
    >
      <div className="absolute -top-3 left-6 ink-stamp bg-paper text-harvest">
        ★ persona
      </div>

      <div className="flex items-center gap-3 mb-5 mt-2">
        <div className="w-10 h-10 rounded-xl bg-harvest/15 flex items-center justify-center">
          <User className="w-5 h-5 text-harvest" />
        </div>
        <div>
          <h3 className="font-display font-bold text-earth text-lg leading-none">
            Build your farmer
          </h3>
          <p className="text-xs text-earth/60 mt-1">
            The richer the persona, the more authentic the review
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Label icon={User}>Name</Label>
            <Input
              value={persona.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Amina"
            />
          </div>
          <div>
            <Label icon={Calendar}>Age</Label>
            <Input
              type="number"
              value={persona.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="38"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label icon={MapPin}>State</Label>
            <Select value={persona.state} onChange={(e) => update('state', e.target.value)}>
              <option value="">Choose state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <Label icon={MapPin}>LGA</Label>
            <Input
              value={persona.lga}
              onChange={(e) => update('lga', e.target.value)}
              placeholder="Birnin Kebbi"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label icon={Sprout}>Main crop</Label>
            <Select value={persona.crop} onChange={(e) => update('crop', e.target.value)}>
              <option value="">Choose crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{cap(c)}</option>)}
            </Select>
          </div>
          <div>
            <Label icon={Leaf}>Farm size (hectares)</Label>
            <Input
              type="number"
              step="0.1"
              value={persona.farmSize}
              onChange={(e) => update('farmSize', e.target.value)}
              placeholder="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label icon={Layers}>Soil type</Label>
            <Select value={persona.soilType} onChange={(e) => update('soilType', e.target.value)}>
              <option value="">Optional</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
            </Select>
          </div>
          <div>
            <Label icon={Calendar}>Years farming</Label>
            <Input
              type="number"
              value={persona.yearsOfExperience}
              onChange={(e) => update('yearsOfExperience', e.target.value)}
              placeholder="15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label icon={Beaker}>Fertilizer type</Label>
            <Select value={persona.fertilizerType} onChange={(e) => update('fertilizerType', e.target.value)}>
              <option value="">Optional</option>
              {FERTILIZER_TYPES.map((f) => <option key={f} value={f}>{cap(f)}</option>)}
            </Select>
          </div>
          <div>
            <Label icon={Calendar}>How often</Label>
            <Select value={persona.fertilizerFrequency} onChange={(e) => update('fertilizerFrequency', e.target.value)}>
              <option value="">Optional</option>
              {FERTILIZER_FREQ.map((f) => <option key={f} value={f}>{cap(f)}</option>)}
            </Select>
          </div>
        </div>

        <div>
          <Label icon={Globe}>Primary language</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => update('language', l.id)}
                className={`py-2.5 rounded-lg border-2 text-xs sm:text-sm font-semibold transition-all ${
                  persona.language === l.id
                    ? 'bg-harvest text-white border-harvest'
                    : 'bg-white border-border hover:border-harvest/40 text-earth'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProductForm({ product, update }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-cream border-2 border-border rounded-2xl p-6 card-elevated relative"
    >
      <div className="absolute -top-3 left-6 ink-stamp bg-paper text-forest">
        ★ product
      </div>

      <div className="flex items-center gap-3 mb-5 mt-2">
        <div className="w-10 h-10 rounded-xl bg-forest/15 flex items-center justify-center">
          <Package className="w-5 h-5 text-forest" />
        </div>
        <div>
          <h3 className="font-display font-bold text-earth text-lg leading-none">
            What did they buy?
          </h3>
          <p className="text-xs text-earth/60 mt-1">
            Add context for a sharper review
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label icon={Tag}>Category</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRODUCT_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => update('category', c.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  product.category === c.id
                    ? 'bg-forest/10 border-forest'
                    : 'bg-white border-border hover:border-forest/40'
                }`}
              >
                <div className="text-2xl mb-1">{c.emoji}</div>
                <div className={`text-xs font-semibold ${
                  product.category === c.id ? 'text-forest' : 'text-earth'
                }`}>
                  {c.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label icon={Package}>Product name</Label>
          <Input
            value={product.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Notore NPK 15:15:15"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label icon={Tag}>Brand</Label>
            <Input
              value={product.brand}
              onChange={(e) => update('brand', e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label icon={Banknote}>Price (₦)</Label>
            <Input
              type="number"
              value={product.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="35000"
            />
          </div>
        </div>

        <div>
          <Label icon={Calendar}>Season of use</Label>
          <Select value={product.season} onChange={(e) => update('season', e.target.value)}>
            <option value="">Optional</option>
            <option value="wet season">Wet season</option>
            <option value="dry season">Dry season</option>
            <option value="harmattan">Harmattan</option>
            <option value="off season">Off season</option>
          </Select>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 p-3 rounded-lg bg-forest/5 border border-forest/15"
        >
          <p className="text-xs text-earth/70 font-serif italic leading-relaxed">
            Tip: realistic prices and brands make reviews feel sharper.
            Try a real Nigerian product like Indorama Urea or BoA Smallholder Loan.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function GenerateButton({ canGenerate, isGenerating, onSubmit, personaValid, productValid }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-10 flex flex-col items-center"
    >
      <div className="flex items-center gap-4 mb-5 text-xs text-earth/70">
        <ValidStatus label="Persona" valid={personaValid} />
        <span className="text-earth/30">·</span>
        <ValidStatus label="Product" valid={productValid} />
      </div>

      <motion.button
        whileHover={canGenerate ? { scale: 1.03 } : {}}
        whileTap={canGenerate ? { scale: 0.97 } : {}}
        onClick={onSubmit}
        disabled={!canGenerate}
        className={`group inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all ${
          canGenerate
            ? 'bg-harvest text-white shadow-lg hover:shadow-2xl cursor-pointer'
            : 'bg-earth/15 text-earth/40 cursor-not-allowed'
        }`}
        style={canGenerate ? { boxShadow: '0 6px 0 #3D2817, 0 10px 30px rgba(61, 40, 23, 0.3)' } : {}}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Generating review...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate review
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>

      {!canGenerate && !isGenerating && (
        <p className="text-xs text-earth/60 font-serif italic mt-3 text-center px-4">
          Fill in name, crop, state and language. Pick a category and product name.
        </p>
      )}
    </motion.div>
  )
}

function ValidStatus({ label, valid }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${valid ? 'text-forest' : 'text-earth/40'}`}>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${valid ? 'bg-forest text-white' : 'bg-earth/15 text-earth/40'}`}>
        {valid ? <Check className="w-2.5 h-2.5" strokeWidth={3.5} /> : <X className="w-2.5 h-2.5" strokeWidth={3.5} />}
      </span>
      {label}
    </span>
  )
}

function Label({ icon: Icon, children }) {
  return (
    <label className="block text-xs font-semibold text-earth/80 mb-1.5 uppercase tracking-wide">
      <Icon className="w-3 h-3 inline mr-1 -mt-0.5" />
      {children}
    </label>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-white border-2 border-border rounded-lg py-2.5 px-3.5 text-sm text-earth placeholder:text-earth/40 focus:outline-none focus:border-harvest transition-colors font-medium"
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-white border-2 border-border rounded-lg py-2.5 px-3.5 text-sm text-earth focus:outline-none focus:border-harvest transition-colors cursor-pointer font-medium"
    >
      {children}
    </select>
  )
}

function cap(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
} 