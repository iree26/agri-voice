const rateLimit = require('express-rate-limit')

const standard = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { status: 'error', error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Try again in 15 minutes.' },
})

module.exports = { standard }
