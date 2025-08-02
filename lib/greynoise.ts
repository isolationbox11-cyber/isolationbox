/**
 * GreyNoise API integration utilities
 * Provides functions to interact with GreyNoise API for threat intelligence and IP reputation
 */

const GREYNOISE_API_BASE = 'https://api.greynoise.io/v3'

interface GreyNoiseIPContext {
  ip: string
  noise: boolean
  riot: boolean
  classification: 'malicious' | 'benign' | 'unknown'
  name: string
  link: string
  last_seen: string
  message?: string
}

interface GreyNoiseStatsResponse {
  query: string
  count: number
  stats: {
    [key: string]: {
      count: number
    }
  }
}

/**
 * Get API key from environment variables
 */
function getApiKey(): string {
  const apiKey = process.env.GREYNOISE_API_KEY
  if (!apiKey) {
    throw new Error('GREYNOISE_API_KEY environment variable is not set')
  }
  return apiKey
}

/**
 * Make authenticated request to GreyNoise API
 */
async function makeGreyNoiseRequest(endpoint: string): Promise<any> {
  const apiKey = getApiKey()
  
  const response = await fetch(`${GREYNOISE_API_BASE}${endpoint}`, {
    headers: {
      'key': apiKey,
      'Accept': 'application/json',
      'User-Agent': 'Salem-Cyber-Vault/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`GreyNoise API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get IP context information from GreyNoise
 */
export async function getIPContext(ip: string): Promise<GreyNoiseIPContext> {
  return makeGreyNoiseRequest(`/noise/context/${ip}`)
}

/**
 * Get current threat statistics for the dashboard
 */
export async function getThreatStats(): Promise<any> {
  // Get stats for various threat categories
  const threats = [
    'classification:malicious',
    'tags:malware',
    'tags:exploit',
    'tags:scanner'
  ]
  
  const results = await Promise.all(
    threats.map(query => 
      makeGreyNoiseRequest(`/experimental/gnql/stats?query=${encodeURIComponent(query)}`)
        .catch(() => ({ query, count: 0, stats: {} }))
    )
  )
  
  return results
}

/**
 * Get recent malicious IPs for threat intelligence display
 */
export async function getRecentThreats(limit = 10): Promise<any[]> {
  try {
    // Query for recent malicious activity
    const query = 'classification:malicious last_seen:1d'
    const response = await makeGreyNoiseRequest(
      `/experimental/gnql?query=${encodeURIComponent(query)}&size=${limit}`
    )
    
    return response.data || []
  } catch (error) {
    console.error('Error fetching recent threats:', error)
    return []
  }
}

/**
 * Transform GreyNoise threat data for Halloween-themed display
 */
export function transformThreatDataForDisplay(threats: any[]): Array<{
  name: string
  severity: string
  description: string
  firstSeen: string
  emoji: string
  ip?: string
  classification?: string
}> {
  const spookyEmojis = ['👻', '🧙‍♀️', '🎃', '💀', '🦇', '🕷️', '🕸️', '⚰️']
  const spookyNames = [
    'PhantomStrike', 'WitchCraft', 'Graveyard', 'Vampire', 'Banshee',
    'Poltergeist', 'Specter', 'Wraith', 'Ghoul', 'Demon'
  ]
  
  return threats.slice(0, 3).map((threat, index) => {
    const emoji = spookyEmojis[index % spookyEmojis.length]
    const spookyName = spookyNames[index % spookyNames.length]
    
    // Determine severity based on classification and tags
    let severity = 'medium'
    if (threat.classification === 'malicious') {
      severity = threat.tags?.includes('exploit') || threat.tags?.includes('malware') ? 'high' : 'medium'
    }
    
    // Create spooky description based on threat data
    let description = 'Mysterious digital entity detected'
    if (threat.tags?.includes('scanner')) {
      description = `${spookyName} scanning rituals targeting vulnerable systems`
    } else if (threat.tags?.includes('malware')) {
      description = `${spookyName} malware haunting network infrastructure`
    } else if (threat.tags?.includes('exploit')) {
      description = `${spookyName} exploitation spells being cast`
    }
    
    return {
      name: `${spookyName} Entity`,
      severity,
      description,
      firstSeen: threat.last_seen ? formatLastSeen(threat.last_seen) : `${Math.floor(Math.random() * 12) + 1} hours ago`,
      emoji,
      ip: threat.ip,
      classification: threat.classification
    }
  })
}

/**
 * Format last seen date for display
 */
function formatLastSeen(lastSeen: string): string {
  try {
    const date = new Date(lastSeen)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'less than 1 hour ago'
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} days ago`
    }
  } catch (error) {
    return 'recently'
  }
}

/**
 * Check if GreyNoise API is available and configured
 */
export async function checkGreyNoiseConnection(): Promise<boolean> {
  try {
    const apiKey = process.env.GREYNOISE_API_KEY
    if (!apiKey) return false
    
    // Simple ping to check API availability
    const response = await makeGreyNoiseRequest('/ping')
    return response.pong === true
  } catch (error) {
    console.error('GreyNoise connection check failed:', error)
    return false
  }
}