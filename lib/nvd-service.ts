/**
 * National Vulnerability Database (NVD) API Service
 * Provides CVE vulnerability data and security advisories
 */

export interface NVDVulnerability {
  cve: {
    id: string
    descriptions: Array<{
      lang: string
      value: string
    }>
    published: string
    lastModified: string
    metrics?: {
      cvssMetricV31?: Array<{
        cvssData: {
          baseScore: number
          baseSeverity: string
        }
      }>
    }
    weaknesses?: Array<{
      description: Array<{
        lang: string
        value: string
      }>
    }>
  }
}

export interface VulnerabilityData {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  cvss: number
  description: string
  affected: string
  status: string
  emoji: string
  published: string
}

class NVDService {
  private readonly baseUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
  private readonly apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.NVD_API_KEY
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if available for higher rate limits
    if (this.apiKey) {
      headers['apiKey'] = this.apiKey
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error(`NVD API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get recent CVE vulnerabilities from NVD
   */
  async getRecentVulnerabilities(resultsPerPage: number = 20): Promise<NVDVulnerability[]> {
    try {
      // Get CVEs published in the last 7 days
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - 7)

      const params = new URLSearchParams({
        pubStartDate: startDate.toISOString().split('T')[0] + 'T00:00:00.000',
        pubEndDate: endDate.toISOString().split('T')[0] + 'T23:59:59.999',
        resultsPerPage: resultsPerPage.toString(),
      })

      const data = await this.makeRequest(`?${params}`)
      return data.vulnerabilities || []
    } catch (error) {
      console.error('Error fetching NVD vulnerabilities:', error)
      return []
    }
  }

  /**
   * Transform NVD vulnerabilities into our vulnerability data format
   */
  async getVulnerabilityAnalysis(): Promise<VulnerabilityData[]> {
    try {
      const vulnerabilities = await this.getRecentVulnerabilities(10)
      
      return vulnerabilities.map((vuln): VulnerabilityData => ({
        id: vuln.cve.id,
        title: this.extractTitle(vuln),
        severity: this.getSeverityFromCVSS(this.getCVSSScore(vuln)),
        cvss: this.getCVSSScore(vuln),
        description: this.getDescription(vuln),
        affected: this.getAffectedSystems(vuln),
        status: 'investigating', // NVD doesn't provide patch status
        emoji: this.getEmojiForVulnerability(vuln),
        published: this.formatDate(vuln.cve.published)
      }))
    } catch (error) {
      console.error('Error transforming vulnerability analysis:', error)
      return this.getFallbackVulnerabilities()
    }
  }

  /**
   * Get vulnerability statistics
   */
  async getVulnerabilityStats(): Promise<{
    critical: number
    high: number
    medium: number
    low: number
  }> {
    try {
      const vulnerabilities = await this.getRecentVulnerabilities(100)
      
      const stats = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }

      vulnerabilities.forEach(vuln => {
        const severity = this.getSeverityFromCVSS(this.getCVSSScore(vuln))
        stats[severity]++
      })

      return stats
    } catch (error) {
      console.error('Error getting vulnerability stats:', error)
      return { critical: 1, high: 3, medium: 7, low: 12 } // Fallback stats
    }
  }

  /**
   * Extract CVSS score from vulnerability data
   */
  private getCVSSScore(vuln: NVDVulnerability): number {
    const metrics = vuln.cve.metrics?.cvssMetricV31?.[0]?.cvssData
    return metrics?.baseScore || 0
  }

  /**
   * Determine severity based on CVSS score
   */
  private getSeverityFromCVSS(score: number): 'critical' | 'high' | 'medium' | 'low' {
    if (score >= 9.0) return 'critical'
    if (score >= 7.0) return 'high'
    if (score >= 4.0) return 'medium'
    return 'low'
  }

  /**
   * Extract meaningful title from CVE description
   */
  private extractTitle(vuln: NVDVulnerability): string {
    const description = this.getDescription(vuln)
    
    // Try to extract a concise title from the description
    const sentences = description.split('. ')
    let title = sentences[0]
    
    // If title is too long, try to shorten it
    if (title.length > 80) {
      const words = title.split(' ')
      title = words.slice(0, 10).join(' ') + '...'
    }
    
    return title || vuln.cve.id
  }

  /**
   * Get description from vulnerability
   */
  private getDescription(vuln: NVDVulnerability): string {
    const englishDesc = vuln.cve.descriptions.find(desc => desc.lang === 'en')
    return englishDesc?.value || 'No description available'
  }

  /**
   * Estimate affected systems from description
   */
  private getAffectedSystems(vuln: NVDVulnerability): string {
    const description = this.getDescription(vuln).toLowerCase()
    
    if (description.includes('windows')) return 'Windows systems'
    if (description.includes('linux')) return 'Linux systems'
    if (description.includes('apache')) return 'Apache web servers'
    if (description.includes('nginx')) return 'Nginx web servers'
    if (description.includes('mysql')) return 'MySQL databases'
    if (description.includes('oracle')) return 'Oracle products'
    if (description.includes('microsoft')) return 'Microsoft products'
    if (description.includes('google')) return 'Google products'
    if (description.includes('android')) return 'Android devices'
    if (description.includes('ios')) return 'iOS devices'
    if (description.includes('docker')) return 'Docker containers'
    if (description.includes('kubernetes')) return 'Kubernetes clusters'
    
    return 'Multiple systems'
  }

  /**
   * Get appropriate emoji for vulnerability type
   */
  private getEmojiForVulnerability(vuln: NVDVulnerability): string {
    const description = this.getDescription(vuln).toLowerCase()
    const cvss = this.getCVSSScore(vuln)
    
    if (cvss >= 9.0) return '🚨' // Critical
    if (description.includes('authentication') || description.includes('bypass')) return '🔐'
    if (description.includes('file') || description.includes('path')) return '📂'
    if (description.includes('code execution') || description.includes('rce')) return '💀'
    if (description.includes('denial of service') || description.includes('dos')) return '⚡'
    if (description.includes('injection') || description.includes('sql')) return '💉'
    if (description.includes('cross-site') || description.includes('xss')) return '🕸️'
    
    return '📦' // Default
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString()
  }

  /**
   * Fallback vulnerabilities if API is unavailable
   */
  private getFallbackVulnerabilities(): VulnerabilityData[] {
    return [
      {
        id: "CVE-2023-44487",
        title: "HTTP/2 Rapid Reset Attack",
        severity: "critical",
        cvss: 9.8,
        description: "DDoS vulnerability affecting HTTP/2 implementations (Demo Data)",
        affected: "Web servers, Load balancers",
        status: "patch-available",
        emoji: "🚨",
        published: "3 days ago"
      },
      {
        id: "CVE-2023-42793",
        title: "JetBrains TeamCity Authentication Bypass",
        severity: "high",
        cvss: 8.1,
        description: "Authentication bypass in TeamCity server (Demo Data)",
        affected: "TeamCity instances",
        status: "patch-available",
        emoji: "🔐",
        published: "5 days ago"
      },
      {
        id: "CVE-2023-41265",
        title: "Qlik Sense Path Traversal",
        severity: "high",
        cvss: 7.5,
        description: "Path traversal vulnerability in Qlik Sense (Demo Data)",
        affected: "Qlik Sense servers",
        status: "investigating",
        emoji: "📂",
        published: "1 week ago"
      }
    ]
  }
}

export const nvdService = new NVDService()