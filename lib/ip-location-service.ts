/**
 * IP Geolocation Service
 * Provides IP geolocation data for threat mapping and attack visualization
 */

export interface IPLocationData {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  lat: number
  lon: number
  timezone: string
  org: string
  as: string
  isp?: string
}

export interface AttackData {
  country: string
  countryCode: string
  attacks: number
  severity: 'high' | 'medium' | 'low'
  lat: number
  lon: number
  topPorts: number[]
  attackTypes: string[]
}

export interface ThreatMapData {
  attackSources: AttackData[]
  totalAttacks: number
  topCountries: string[]
  activeThreats: number
}

class IPLocationService {
  private readonly ipinfoBaseUrl = 'https://ipinfo.io'
  private readonly ipapiBaseUrl = 'http://ip-api.com/json'
  private readonly apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.IPINFO_API_KEY
  }

  /**
   * Get location data for an IP address using IPinfo (with API key) or ip-api (free)
   */
  async getIPLocation(ip: string): Promise<IPLocationData | null> {
    try {
      // Try IPinfo first if API key is available
      if (this.apiKey) {
        return await this.getIPInfoLocation(ip)
      } else {
        // Fallback to ip-api.com (free tier)
        return await this.getIPAPILocation(ip)
      }
    } catch (error) {
      console.error('Error getting IP location:', error)
      return null
    }
  }

  /**
   * Get location using IPinfo.io (requires API key)
   */
  private async getIPInfoLocation(ip: string): Promise<IPLocationData | null> {
    const response = await fetch(`${this.ipinfoBaseUrl}/${ip}?token=${this.apiKey}`)
    
    if (!response.ok) {
      throw new Error(`IPinfo API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.bogon) {
      return null // Private/local IP
    }

    const [lat, lon] = (data.loc || '0,0').split(',').map(Number)

    return {
      ip: data.ip,
      country: data.country,
      countryCode: data.country,
      region: data.region,
      city: data.city,
      lat,
      lon,
      timezone: data.timezone,
      org: data.org,
      as: data.org
    }
  }

  /**
   * Get location using ip-api.com (free tier, no API key required)
   */
  private async getIPAPILocation(ip: string): Promise<IPLocationData | null> {
    const response = await fetch(`${this.ipapiBaseUrl}/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone,org,as,isp,query`)
    
    if (!response.ok) {
      throw new Error(`IP-API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'success') {
      return null
    }

    return {
      ip: data.query,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      city: data.city,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      org: data.org,
      as: data.as,
      isp: data.isp
    }
  }

  /**
   * Get threat map data with simulated attack sources
   */
  async getThreatMapData(): Promise<ThreatMapData> {
    try {
      // Get geolocation data for common attack source IPs (using known malicious ranges)
      const suspiciousIPs = this.getSuspiciousIPRanges()
      const attackSources: AttackData[] = []

      for (const ipRange of suspiciousIPs.slice(0, 10)) { // Limit requests
        const location = await this.getIPLocation(ipRange.ip)
        
        if (location) {
          attackSources.push({
            country: location.country,
            countryCode: location.countryCode,
            attacks: ipRange.attackCount,
            severity: ipRange.severity,
            lat: location.lat,
            lon: location.lon,
            topPorts: ipRange.topPorts,
            attackTypes: ipRange.attackTypes
          })
        }
      }

      // Group by country and aggregate
      const countryMap = new Map<string, AttackData>()
      
      attackSources.forEach(source => {
        const existing = countryMap.get(source.country)
        if (existing) {
          existing.attacks += source.attacks
          existing.severity = this.getHigherSeverity(existing.severity, source.severity)
        } else {
          countryMap.set(source.country, source)
        }
      })

      const finalSources = Array.from(countryMap.values())
      const totalAttacks = finalSources.reduce((sum, source) => sum + source.attacks, 0)

      return {
        attackSources: finalSources,
        totalAttacks,
        topCountries: finalSources
          .sort((a, b) => b.attacks - a.attacks)
          .slice(0, 5)
          .map(source => source.country),
        activeThreats: finalSources.filter(source => source.severity === 'high').length
      }
    } catch (error) {
      console.error('Error getting threat map data:', error)
      return this.getFallbackThreatMapData()
    }
  }

  /**
   * Get sample suspicious IP ranges for demonstration
   */
  private getSuspiciousIPRanges(): Array<{
    ip: string
    attackCount: number
    severity: 'high' | 'medium' | 'low'
    topPorts: number[]
    attackTypes: string[]
  }> {
    return [
      {
        ip: '14.102.128.1', // China
        attackCount: 847,
        severity: 'high',
        topPorts: [22, 80, 443, 3389],
        attackTypes: ['SSH brute force', 'Web scanning', 'Port scanning']
      },
      {
        ip: '185.220.100.1', // Russia  
        attackCount: 623,
        severity: 'high',
        topPorts: [22, 23, 80, 443, 8080],
        attackTypes: ['Botnet', 'DDoS', 'Credential stuffing']
      },
      {
        ip: '175.45.176.1', // North Korea
        attackCount: 234,
        severity: 'medium',
        topPorts: [22, 80, 443],
        attackTypes: ['APT activity', 'Reconnaissance']
      },
      {
        ip: '5.62.56.1', // Iran
        attackCount: 189,
        severity: 'medium', 
        topPorts: [22, 80, 443, 993],
        attackTypes: ['Phishing', 'Email attacks']
      },
      {
        ip: '1.1.1.1', // Generic
        attackCount: 156,
        severity: 'low',
        topPorts: [80, 443],
        attackTypes: ['Web scanning']
      }
    ]
  }

  /**
   * Get higher severity between two values
   */
  private getHigherSeverity(a: 'high' | 'medium' | 'low', b: 'high' | 'medium' | 'low'): 'high' | 'medium' | 'low' {
    const severityOrder = { low: 1, medium: 2, high: 3 }
    return severityOrder[a] >= severityOrder[b] ? a : b
  }

  /**
   * Get recent attack events with geolocation
   */
  async getRecentAttacks(limit: number = 10): Promise<Array<{
    timestamp: string
    sourceIP: string
    targetIP: string
    attackType: string
    severity: 'high' | 'medium' | 'low'
    location?: IPLocationData
    blocked: boolean
  }>> {
    try {
      // Generate simulated recent attacks
      const attacks = this.generateSimulatedAttacks(limit)
      
      // Enrich with geolocation data
      for (const attack of attacks) {
        const location = await this.getIPLocation(attack.sourceIP)
        attack.location = location || undefined
      }
      
      return attacks
    } catch (error) {
      console.error('Error getting recent attacks:', error)
      return this.getFallbackAttacks()
    }
  }

  /**
   * Generate simulated attack data for demonstration
   */
  private generateSimulatedAttacks(count: number): Array<{
    timestamp: string
    sourceIP: string
    targetIP: string
    attackType: string
    severity: 'high' | 'medium' | 'low'
    location?: IPLocationData
    blocked: boolean
  }> {
    const attackTypes = [
      'SSH brute force',
      'SQL injection attempt', 
      'Port scanning',
      'Malware download',
      'Phishing attempt',
      'DDoS attack',
      'Credential stuffing',
      'Web scanning'
    ]

    const sourceIPs = [
      '14.102.128.45',
      '185.220.100.23', 
      '175.45.176.12',
      '5.62.56.78',
      '103.224.182.245'
    ]

    const attacks = []
    
    for (let i = 0; i < count; i++) {
      const minutesAgo = Math.floor(Math.random() * 60)
      const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000)
      
      attacks.push({
        timestamp: timestamp.toISOString(),
        sourceIP: sourceIPs[Math.floor(Math.random() * sourceIPs.length)],
        targetIP: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        severity: (['high', 'medium', 'low'] as const)[Math.floor(Math.random() * 3)],
        blocked: Math.random() > 0.3 // 70% blocked
      })
    }
    
    return attacks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  /**
   * Fallback threat map data if APIs are unavailable
   */
  private getFallbackThreatMapData(): ThreatMapData {
    return {
      attackSources: [
        { country: 'China', countryCode: 'CN', attacks: 847, severity: 'high', lat: 35.8617, lon: 104.1954, topPorts: [22, 80, 443], attackTypes: ['SSH brute force'] },
        { country: 'Russia', countryCode: 'RU', attacks: 623, severity: 'high', lat: 61.5240, lon: 105.3188, topPorts: [22, 23, 80], attackTypes: ['Botnet'] },
        { country: 'North Korea', countryCode: 'KP', attacks: 234, severity: 'medium', lat: 40.3399, lon: 127.5101, topPorts: [22, 80], attackTypes: ['APT'] },
        { country: 'Iran', countryCode: 'IR', attacks: 189, severity: 'medium', lat: 32.4279, lon: 53.6880, topPorts: [22, 80, 443], attackTypes: ['Phishing'] },
        { country: 'Unknown', countryCode: 'XX', attacks: 156, severity: 'low', lat: 0, lon: 0, topPorts: [80], attackTypes: ['Scanning'] }
      ],
      totalAttacks: 2049,
      topCountries: ['China', 'Russia', 'North Korea', 'Iran', 'Unknown'],
      activeThreats: 2
    }
  }

  /**
   * Fallback attack data if APIs are unavailable
   */
  private getFallbackAttacks(): Array<{
    timestamp: string
    sourceIP: string
    targetIP: string
    attackType: string
    severity: 'high' | 'medium' | 'low'
    location?: IPLocationData
    blocked: boolean
  }> {
    return [
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        sourceIP: '14.102.128.45',
        targetIP: '192.168.1.100',
        attackType: 'SSH brute force',
        severity: 'high',
        blocked: true
      },
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        sourceIP: '185.220.100.23',
        targetIP: '192.168.1.50',
        attackType: 'Port scanning',
        severity: 'medium',
        blocked: true
      }
    ]
  }
}

export const ipLocationService = new IPLocationService()