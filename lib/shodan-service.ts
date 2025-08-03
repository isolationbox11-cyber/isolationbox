/**
 * Shodan API Service
 * Provides device discovery, IoT security scanning, and network intelligence
 */

export interface ShodanHost {
  ip_str: string
  port: number
  org: string
  hostnames: string[]
  location: {
    country_name: string
    city: string
  }
  vulns?: string[]
  product?: string
  version?: string
  os?: string
  timestamp: string
  data: string
}

export interface ShodanSearchResult {
  matches: ShodanHost[]
  total: number
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
  location?: string
  product?: string
}

class ShodanService {
  private readonly baseUrl = 'https://api.shodan.io'
  private readonly apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.SHODAN_API_KEY
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Shodan API key not configured')
    }

    const response = await fetch(`${this.baseUrl}${endpoint}&key=${this.apiKey}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Shodan API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Search for IoT devices and services
   */
  async searchDevices(query: string = 'country:US', limit: number = 20): Promise<ShodanHost[]> {
    try {
      const data = await this.makeRequest(`/shodan/host/search?query=${encodeURIComponent(query)}&limit=${limit}`)
      return data.matches || []
    } catch (error) {
      console.error('Error searching Shodan devices:', error)
      return []
    }
  }

  /**
   * Get asset monitoring data for dashboard
   */
  async getAssetMonitoring(): Promise<AssetData[]> {
    try {
      // Search for common vulnerable services
      const queries = [
        'apache',
        'nginx', 
        'mysql',
        'ssh',
        'ftp',
        'telnet'
      ]

      const assets: AssetData[] = []
      
      for (const query of queries.slice(0, 3)) { // Limit to 3 to avoid rate limits
        const hosts = await this.searchDevices(query, 2)
        
        hosts.forEach(host => {
          assets.push(this.transformHostToAsset(host, query))
        })
      }

      return assets.slice(0, 6) // Return max 6 assets
    } catch (error) {
      console.error('Error getting asset monitoring data:', error)
      return this.getFallbackAssets()
    }
  }

  /**
   * Get IoT device statistics
   */
  async getIoTStats(): Promise<{
    totalDevices: number
    vulnerableDevices: number
    criticalIssues: number
    countries: number
  }> {
    try {
      // Get stats for common IoT devices
      const iotQuery = 'product:IoT OR product:camera OR product:router'
      const data = await this.makeRequest(`/shodan/host/search?query=${encodeURIComponent(iotQuery)}&limit=1`)
      
      return {
        totalDevices: data.total || 0,
        vulnerableDevices: Math.floor((data.total || 0) * 0.3), // Estimate 30% vulnerable
        criticalIssues: Math.floor((data.total || 0) * 0.05), // Estimate 5% critical
        countries: 50 // Approximate
      }
    } catch (error) {
      console.error('Error getting IoT stats:', error)
      return {
        totalDevices: 1234567,
        vulnerableDevices: 370370,
        criticalIssues: 61728,
        countries: 195
      }
    }
  }

  /**
   * Get scanning results for specific targets
   */
  async getScanResults(targets: string[]): Promise<Array<{
    target: string
    status: 'online' | 'offline'
    services: Array<{
      port: number
      service: string
      version?: string
    }>
    vulnerabilities: string[]
    location?: string
  }>> {
    try {
      const results = []
      
      for (const target of targets.slice(0, 3)) { // Limit requests
        try {
          const data = await this.makeRequest(`/shodan/host/${target}`)
          results.push({
            target,
            status: 'online' as const,
            services: (data.data || []).map((service: any) => ({
              port: service.port,
              service: service.product || 'Unknown',
              version: service.version
            })).slice(0, 5),
            vulnerabilities: Object.keys(data.vulns || {}),
            location: data.location ? `${data.location.city}, ${data.location.country_name}` : undefined
          })
        } catch (hostError) {
          results.push({
            target,
            status: 'offline' as const,
            services: [],
            vulnerabilities: [],
            location: undefined
          })
        }
      }
      
      return results
    } catch (error) {
      console.error('Error getting scan results:', error)
      return []
    }
  }

  /**
   * Transform Shodan host data to asset format
   */
  private transformHostToAsset(host: ShodanHost, serviceType: string): AssetData {
    const vulnerabilityCount = host.vulns ? Object.keys(host.vulns).length : 0
    const riskScore = this.calculateRiskScore(host, vulnerabilityCount)
    
    return {
      name: this.getAssetName(host, serviceType),
      ip: host.ip_str,
      status: this.getStatusFromRisk(riskScore),
      lastScan: this.formatTimestamp(host.timestamp),
      vulnerabilities: vulnerabilityCount,
      riskScore,
      type: this.getAssetType(serviceType),
      emoji: this.getEmojiForService(serviceType),
      location: host.location ? `${host.location.city}, ${host.location.country_name}` : undefined,
      product: host.product
    }
  }

  /**
   * Calculate risk score based on vulnerabilities and other factors
   */
  private calculateRiskScore(host: ShodanHost, vulnCount: number): number {
    let score = vulnCount * 15 // Base score from vulnerabilities
    
    // Increase score for older systems
    const timestamp = new Date(host.timestamp)
    const daysSinceUpdate = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate > 30) score += 10
    if (daysSinceUpdate > 90) score += 20
    
    // Increase score for sensitive services
    const data = host.data.toLowerCase()
    if (data.includes('admin') || data.includes('root')) score += 15
    if (data.includes('default') || data.includes('password')) score += 25
    
    return Math.min(score, 100) // Cap at 100
  }

  /**
   * Get asset status from risk score
   */
  private getStatusFromRisk(score: number): 'secure' | 'warning' | 'critical' {
    if (score >= 70) return 'critical'
    if (score >= 40) return 'warning'
    return 'secure'
  }

  /**
   * Generate asset name from host data
   */
  private getAssetName(host: ShodanHost, serviceType: string): string {
    if (host.hostnames.length > 0) {
      return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} (${host.hostnames[0]})`
    }
    
    return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Server`
  }

  /**
   * Get asset type from service
   */
  private getAssetType(serviceType: string): string {
    const typeMap: Record<string, string> = {
      'apache': 'server',
      'nginx': 'server',
      'mysql': 'database',
      'ssh': 'server',
      'ftp': 'file',
      'telnet': 'network'
    }
    
    return typeMap[serviceType] || 'server'
  }

  /**
   * Get emoji for service type
   */
  private getEmojiForService(serviceType: string): string {
    const emojiMap: Record<string, string> = {
      'apache': '🖥️',
      'nginx': '🖥️',
      'mysql': '🗄️',
      'ssh': '🔒',
      'ftp': '📁',
      'telnet': '🔗'
    }
    
    return emojiMap[serviceType] || '🖥️'
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than 1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  /**
   * Fallback assets if API is unavailable
   */
  private getFallbackAssets(): AssetData[] {
    return [
      {
        name: "Web Server (nginx)",
        ip: "192.168.1.10",
        status: "secure",
        lastScan: "2 hours ago",
        vulnerabilities: 0,
        riskScore: 15,
        type: "server",
        emoji: "🖥️"
      },
      {
        name: "Database Server (MySQL)",
        ip: "192.168.1.20",
        status: "warning",
        lastScan: "1 hour ago",
        vulnerabilities: 2,
        riskScore: 45,
        type: "database",
        emoji: "🗄️"
      },
      {
        name: "Email Server (Exchange)",
        ip: "192.168.1.30",
        status: "critical",
        lastScan: "30 min ago",
        vulnerabilities: 5,
        riskScore: 85,
        type: "email",
        emoji: "📧"
      }
    ]
  }
}

export const shodanService = new ShodanService()