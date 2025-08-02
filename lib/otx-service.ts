/**
 * AlienVault OTX (Open Threat Exchange) API Service
 * Provides threat intelligence data including indicators, pulses, and malware information
 */

export interface OTXPulse {
  id: string
  name: string
  description: string
  created: string
  modified: string
  author_name: string
  indicator_count: number
  severity?: 'high' | 'medium' | 'low'
  tags: string[]
}

export interface OTXIndicator {
  indicator: string
  type: string
  description: string
  created: string
}

export interface ThreatData {
  name: string
  severity: 'high' | 'medium' | 'low'
  description: string
  firstSeen: string
  emoji: string
  source: string
}

class OTXService {
  private readonly baseUrl = 'https://otx.alienvault.com/api/v1'
  private readonly apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.OTX_API_KEY
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OTX API key not configured')
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-OTX-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OTX API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get recent threat pulses from OTX
   */
  async getRecentPulses(limit: number = 10): Promise<OTXPulse[]> {
    try {
      const data = await this.makeRequest(`/pulses/subscribed?limit=${limit}`)
      return data.results || []
    } catch (error) {
      console.error('Error fetching OTX pulses:', error)
      return []
    }
  }

  /**
   * Transform OTX pulses into threat data format
   */
  async getThreatIntelligence(): Promise<ThreatData[]> {
    try {
      const pulses = await this.getRecentPulses(5)
      
      return pulses.map((pulse): ThreatData => ({
        name: pulse.name,
        severity: this.getSeverityFromPulse(pulse),
        description: pulse.description || 'No description available',
        firstSeen: this.formatDate(pulse.created),
        emoji: this.getEmojiForThreat(pulse.name),
        source: 'AlienVault OTX'
      }))
    } catch (error) {
      console.error('Error transforming threat intelligence:', error)
      // Return fallback data if API fails
      return this.getFallbackThreats()
    }
  }

  /**
   * Determine severity based on pulse indicators and tags
   */
  private getSeverityFromPulse(pulse: OTXPulse): 'high' | 'medium' | 'low' {
    const highRiskTags = ['malware', 'ransomware', 'apt', 'exploit', 'critical']
    const mediumRiskTags = ['phishing', 'botnet', 'suspicious', 'trojan']
    
    const tags = pulse.tags.map(tag => tag.toLowerCase())
    const name = pulse.name.toLowerCase()
    
    if (highRiskTags.some(tag => tags.includes(tag) || name.includes(tag))) {
      return 'high'
    }
    
    if (mediumRiskTags.some(tag => tags.includes(tag) || name.includes(tag))) {
      return 'medium'
    }
    
    // High indicator count suggests higher severity
    if (pulse.indicator_count > 100) {
      return 'high'
    } else if (pulse.indicator_count > 50) {
      return 'medium'
    }
    
    return 'low'
  }

  /**
   * Get appropriate emoji for threat type
   */
  private getEmojiForThreat(name: string): string {
    const lowercaseName = name.toLowerCase()
    
    if (lowercaseName.includes('ransomware') || lowercaseName.includes('phantom')) return '👻'
    if (lowercaseName.includes('botnet') || lowercaseName.includes('witch')) return '🧙‍♀️'
    if (lowercaseName.includes('phishing') || lowercaseName.includes('grave')) return '🪦'
    if (lowercaseName.includes('malware') || lowercaseName.includes('virus')) return '🦠'
    if (lowercaseName.includes('apt') || lowercaseName.includes('advanced')) return '🕷️'
    if (lowercaseName.includes('exploit')) return '💀'
    
    return '⚡' // Default threat emoji
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than 1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  /**
   * Fallback threats if API is unavailable
   */
  private getFallbackThreats(): ThreatData[] {
    return [
      {
        name: "PhantomStrike Ransomware",
        severity: "high",
        description: "Active targeting of healthcare systems (Demo Data)",
        firstSeen: "2 hours ago",
        emoji: "👻",
        source: "Demo Data"
      },
      {
        name: "WitchCraft Botnet",
        severity: "medium",
        description: "IoT device infections spreading (Demo Data)",
        firstSeen: "6 hours ago",
        emoji: "🧙‍♀️",
        source: "Demo Data"
      },
      {
        name: "Graveyard Phishing",
        severity: "high",
        description: "Halloween-themed email campaigns (Demo Data)",
        firstSeen: "12 hours ago",
        emoji: "🪦",
        source: "Demo Data"
      }
    ]
  }
}

export const otxService = new OTXService()