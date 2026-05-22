function log(module, requestId, message) {
  const prefix = requestId ? `[${requestId}] [${module}]` : `[system] [${module}]`
  console.log(`${prefix} ${message}`)
}

function logError(module, requestId, message) {
  const prefix = requestId ? `[${requestId}] [${module}]` : `[system] [${module}]`
  console.error(`${prefix} ERROR ${message}`)
}

module.exports = { log, logError }
