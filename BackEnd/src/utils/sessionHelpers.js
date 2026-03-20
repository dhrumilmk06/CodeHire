/**
 * Generates a unique 6-character uppercase alphanumeric
 * session code in format ABC-XYZ
 */
export function generateSessionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const part1 = Array(3)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')

  const part2 = Array(3)
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')

  return `${part1}-${part2}`
}

/**
 * Extracts session ID from a full URL
 * e.g. http://localhost:5173/session/abc123 → abc123
 */
export function extractSessionIdFromUrl(url) {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/')
    const sessionIndex = parts.indexOf('session')
    if (sessionIndex !== -1 && parts[sessionIndex + 1]) {
      return parts[sessionIndex + 1]
    }
    return null
  } catch {
    return null
  }
}

/**
 * Detects if input is a URL or a short code
 */
export function detectInputType(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return 'url'
  }
  return 'code'
}
