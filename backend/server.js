require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { log } = require('./utils/logger')
const { pingML } = require('./services/mlService')
const reviewRoute = require('./routes/review')
const recommendRoute = require('./routes/recommend')

const app = express()
const PORT = process.env.PORT || 3000

app.set('trust proxy', 1)
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}))

app.use('/api', reviewRoute)
app.use('/api', recommendRoute)

app.get('/health', async (req, res) => {
  const mlStatus = await pingML()
  res.json({
    name: 'AgriVoice API',
    version: '1.0.0',
    status: 'running',
    mlServiceStatus: mlStatus,
  })
})

app.get('/', (req, res) => res.json({
  name: 'AgriVoice API',
  version: '1.0.0',
  status: 'running',
  endpoints: ['POST /api/generate-review', 'POST /api/recommendations', 'GET /health'],
}))

app.use((err, req, res, next) => {
  log('server', null, `Unhandled error: ${err.message}`)
  res.status(500).json({ status: 'error', error: 'INTERNAL_ERROR', message: err.message })
})

app.listen(PORT, () => log('server', null, `AgriVoice backend running on port ${PORT}`))

module.exports = app
