const Anthropic = require('@anthropic-ai/sdk')
const { SYSTEM_PROMPT, buildUserMessage } = require('../prompts/reviewPrompt')
const { log, logError } = require('../utils/logger')

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

async function generateReviewWithClaude(persona, product, requestId) {
  if (!client) throw new Error('ANTHROPIC_API_KEY not set')

  const userMessage = buildUserMessage(persona, product)
  log('claudeService', requestId, `Calling Claude persona=${persona.state} product=${product.name}`)

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage }],
  })

  const raw = response.content[0].text.trim()
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const result = JSON.parse(jsonStr)

  log('claudeService', requestId, `Claude SUCCESS rating=${result.rating} lang=${result.language}`)
  return result
}

module.exports = { generateReviewWithClaude }
