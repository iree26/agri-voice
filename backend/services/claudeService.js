const Anthropic = require('@anthropic-ai/sdk')
const { SYSTEM_PROMPT, buildUserMessage } = require('../prompts/reviewPrompt')
const { log, logError } = require('../utils/logger')

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

async function generateReviewWithClaude(profileStr, productStr, requestId) {
  if (!client) throw new Error('ANTHROPIC_API_KEY not set')

  const userMessage = buildUserMessage(profileStr, productStr)
  log('claudeService', requestId, `Calling Claude profile="${profileStr.slice(0, 50)}..."`)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage }],
  })

  const raw = response.content[0].text.trim()
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const result = JSON.parse(jsonStr)

  if (result.review) {
    const words = result.review.split(' ')
    if (words.length > 60) {
      result.review = words.slice(0, 60).join(' ')
      if (!/[.!?]$/.test(result.review)) result.review += '.'
    }
  }

  if (result.confidence) {
    const c = result.confidence.trim().toLowerCase()
    result.confidence = c.charAt(0).toUpperCase() + c.slice(1)
    if (!['Low', 'Medium', 'High'].includes(result.confidence)) result.confidence = 'Medium'
  }

  log('claudeService', requestId, `Claude SUCCESS rating=${result.rating} confidence=${result.confidence}`)
  return result
}

module.exports = { generateReviewWithClaude }
