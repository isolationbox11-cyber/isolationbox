// API client utilities for Salem Cyber Vault
// Real-time API integrations for cybersecurity data

const API_BASE_URLS = {
  SHODAN: 'https://api.shodan.io',
  OTX: 'https://otx.alienvault.com/api/v1',
  VIRUSTOTAL: 'https://www.virustotal.com/vtapi/v2',
  NVD: 'https://services.nvd.nist.gov/rest/json',
  IPGEOLOCATION: 'https://api.ipgeolocation.io'
} as const

export interface ThreatIntelligenceData {
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  description: string
  firstSeen: string
  emoji: string
  source: string
  indicators?: string[]
}

export interface VulnerabilityData {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  cvss: number
  description: string
  affected: string
  status: 'patch-available' | 'investigating' | 'patched' | 'no-fix'
  emoji: string
  publishedDate: string
}

export interface AssetData {
  name: string
  ip: string
  status: 'secure' | 'warning' | 'critical'
  lastScan: string
  vulnerabilities: number
  riskScore: number
  type: string
  emoji: string
  ports?: number[]
  services?: string[]
}

export interface AttackSourceData {
  country: string
  attacks: number
  severity: 'high' | 'medium' | 'low'
  coordinates?: [number, number]
}

export interface ShodanDevice {
  ip: string
  port: number
  product: string
  version: string
  banner: string
  country: string
  city: string
  org: string
}

// Rate limiting utility
class RateLimiter {
  private requests: { [key: string]: number[] } = {}
  private limit = parseInt(process.env.API_RATE_LIMIT_REQUESTS_PER_MINUTE || '60')

  canMakeRequest(apiKey: string): boolean {
    const now = Date.now()
    const oneMinuteAgo = now - 60000
    
    if (!this.requests[apiKey]) {
      this.requests[apiKey] = []
    }
    
    // Remove old requests
    this.requests[apiKey] = this.requests[apiKey].filter(time => time > oneMinuteAgo)
    
    return this.requests[apiKey].length < this.limit
  }

  recordRequest(apiKey: string): void {
    if (!this.requests[apiKey]) {
      this.requests[apiKey] = []
    }
    this.requests[apiKey].push(Date.now())
  }
}

const rateLimiter = new RateLimiter()

// Generic API client with error handling and caching
export class APIClient {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTTL = parseInt(process.env.API_CACHE_TTL_SECONDS || '300') * 1000

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async makeRequest(url: string, options: RequestInit = {}, cacheKey?: string): Promise<any> {
    if (cacheKey) {
      const cached = this.getCachedData(cacheKey)
      if (cached) return cached
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Salem-Cyber-Vault/1.0',
          'Accept': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (cacheKey) {
        this.setCachedData(cacheKey, data)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }
}

export const apiClient = new APIClient()

// Shodan API integration
export class ShodanAPI {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.SHODAN_API_KEY || ''
    if (!this.apiKey) {
      console.warn('SHODAN_API_KEY not configured')
    }
  }

  async search(query: string, limit = 100): Promise<ShodanDevice[]> {
    if (!this.apiKey || !rateLimiter.canMakeRequest(this.apiKey)) {
      throw new Error('API key missing or rate limit exceeded')
    }

    rateLimiter.recordRequest(this.apiKey)

    const url = `${API_BASE_URLS.SHODAN}/shodan/host/search?key=${this.apiKey}&query=${encodeURIComponent(query)}&limit=${limit}`
    const cacheKey = `shodan_search_${query}_${limit}`

    try {
      const data = await apiClient.makeRequest(url, {}, cacheKey)
      
      return data.matches?.map((match: any) => ({
        ip: match.ip_str,
        port: match.port,
        product: match.product || 'Unknown',
        version: match.version || '',
        banner: match.data || '',
        country: match.location?.country_name || 'Unknown',
        city: match.location?.city || 'Unknown',
        org: match.org || 'Unknown'
      })) || []
    } catch (error) {
      console.error('Shodan API error:', error)
      return []
    }
  }

  async getHostInfo(ip: string): Promise<ShodanDevice | null> {
    if (!this.apiKey || !rateLimiter.canMakeRequest(this.apiKey)) {
      throw new Error('API key missing or rate limit exceeded')
    }

    rateLimiter.recordRequest(this.apiKey)

    const url = `${API_BASE_URLS.SHODAN}/shodan/host/${ip}?key=${this.apiKey}`
    const cacheKey = `shodan_host_${ip}`

    try {
      const data = await apiClient.makeRequest(url, {}, cacheKey)
      
      return {
        ip: data.ip_str,
        port: data.ports?.[0] || 0,
        product: data.data?.[0]?.product || 'Unknown',
        version: data.data?.[0]?.version || '',
        banner: data.data?.[0]?.banner || '',
        country: data.country_name || 'Unknown',
        city: data.city || 'Unknown',
        org: data.org || 'Unknown'
      }
    } catch (error) {
      console.error('Shodan host info error:', error)
      return null
    }
  }
}

// AlienVault OTX API integration
export class OTXAPI {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.OTX_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OTX_API_KEY not configured')
    }
  }

  async getThreatPulses(limit = 20): Promise<ThreatIntelligenceData[]> {
    if (!this.apiKey || !rateLimiter.canMakeRequest(this.apiKey)) {
      return this.getFallbackThreats()
    }

    rateLimiter.recordRequest(this.apiKey)

    const url = `${API_BASE_URLS.OTX}/pulses/subscribed?limit=${limit}`
    const cacheKey = `otx_pulses_${limit}`

    try {
      const data = await apiClient.makeRequest(url, {
        headers: { 'X-OTX-API-KEY': this.apiKey }
      }, cacheKey)
      
      return data.results?.map((pulse: any) => ({
        name: this.addHalloweenFlair(pulse.name),
        severity: this.mapSeverity(pulse.TLP),
        description: pulse.description || 'No description available',
        firstSeen: this.formatDate(pulse.created),
        emoji: this.getSpookyEmoji(),
        source: 'OTX',
        indicators: pulse.indicators?.slice(0, 5).map((i: any) => i.indicator) || []
      })) || this.getFallbackThreats()
    } catch (error) {
      console.error('OTX API error:', error)
      return this.getFallbackThreats()
    }
  }

  private addHalloweenFlair(name: string): string {
    const spookyPrefixes = ['Phantom', 'Spectral', 'Haunted', 'Cursed', 'Witch\'s', 'Zombie', 'Ghost']
    const randomPrefix = spookyPrefixes[Math.floor(Math.random() * spookyPrefixes.length)]
    return `${randomPrefix} ${name}`
  }

  private mapSeverity(tlp: string): 'critical' | 'high' | 'medium' | 'low' {
    switch (tlp) {
      case 'red': return 'critical'
      case 'amber': return 'high'
      case 'green': return 'medium'
      default: return 'low'
    }
  }

  private getSpookyEmoji(): string {
    const emojis = ['👻', '🧙‍♀️', '🎃', '🪦', '🦇', '🕷️', '💀', '🔮']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours} hours ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} days ago`
  }

  private getFallbackThreats(): ThreatIntelligenceData[] {
    return [
      {
        name: "PhantomStrike Ransomware",
        severity: "high",
        description: "Active targeting of healthcare systems",
        firstSeen: "2 hours ago",
        emoji: "👻",
        source: "Fallback"
      },
      {
        name: "WitchCraft Botnet",
        severity: "medium",
        description: "IoT device infections spreading",
        firstSeen: "6 hours ago",
        emoji: "🧙‍♀️",
        source: "Fallback"
      },
      {
        name: "Graveyard Phishing",
        severity: "high",
        description: "Halloween-themed email campaigns",
        firstSeen: "12 hours ago",
        emoji: "🪦",
        source: "Fallback"
      }
    ]
  }
}

// NVD API integration for vulnerability data
export class NVDAPI {
  async getLatestVulnerabilities(resultsPerPage = 20): Promise<VulnerabilityData[]> {
    const url = `${API_BASE_URLS.NVD}/cves/2.0?resultsPerPage=${resultsPerPage}&startIndex=0`
    const cacheKey = `nvd_latest_${resultsPerPage}`

    try {
      const data = await apiClient.makeRequest(url, {}, cacheKey)
      
      return data.vulnerabilities?.map((vuln: any) => ({
        id: vuln.cve.id,
        title: this.addHalloweenFlair(vuln.cve.descriptions?.[0]?.value || 'Unknown vulnerability'),
        severity: this.mapCVSSSeverity(vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore),
        cvss: vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0,
        description: vuln.cve.descriptions?.[0]?.value || 'No description available',
        affected: this.extractAffectedSoftware(vuln.cve.configurations),
        status: 'investigating',
        emoji: this.getVulnEmoji(),
        publishedDate: this.formatDate(vuln.cve.published)
      })) || this.getFallbackVulnerabilities()
    } catch (error) {
      console.error('NVD API error:', error)
      return this.getFallbackVulnerabilities()
    }
  }

  private addHalloweenFlair(title: string): string {
    const spookyTerms = ['Cursed', 'Haunted', 'Spectral', 'Phantom', 'Witch\'s']
    const randomTerm = spookyTerms[Math.floor(Math.random() * spookyTerms.length)]
    return title.length > 50 ? `${randomTerm} ${title.substring(0, 47)}...` : `${randomTerm} ${title}`
  }

  private mapCVSSSeverity(score?: number): 'critical' | 'high' | 'medium' | 'low' {
    if (!score) return 'low'
    if (score >= 9.0) return 'critical'
    if (score >= 7.0) return 'high'
    if (score >= 4.0) return 'medium'
    return 'low'
  }

  private extractAffectedSoftware(configurations: any): string {
    try {
      const nodes = configurations?.nodes || []
      const cpeMatches = nodes.flatMap((node: any) => node.cpeMatch || [])
      const products = cpeMatches
        .map((match: any) => match.criteria)
        .filter(Boolean)
        .slice(0, 3)
        .map((cpe: string) => {
          const parts = cpe.split(':')
          return parts[3] || 'Unknown'
        })
      
      return products.length > 0 ? products.join(', ') : 'Multiple products'
    } catch {
      return 'Various systems'
    }
  }

  private getVulnEmoji(): string {
    const emojis = ['🚨', '🔐', '📂', '📦', '💥', '🕳️']
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 1) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  private getFallbackVulnerabilities(): VulnerabilityData[] {
    return [
      {
        id: "CVE-2023-44487",
        title: "Cursed HTTP/2 Rapid Reset Attack",
        severity: "critical",
        cvss: 9.8,
        description: "DDoS vulnerability affecting HTTP/2 implementations",
        affected: "Web servers, Load balancers",
        status: "patch-available",
        emoji: "🚨",
        publishedDate: "Today"
      },
      {
        id: "CVE-2023-42793",
        title: "Haunted TeamCity Authentication Bypass",
        severity: "high",
        cvss: 8.1,
        description: "Authentication bypass in TeamCity server",
        affected: "TeamCity instances",
        status: "patch-available",
        emoji: "🔐",
        publishedDate: "2 days ago"
      }
    ]
  }
}

// Export API instances
export const shodanAPI = new ShodanAPI()
export const otxAPI = new OTXAPI()
export const nvdAPI = new NVDAPI()