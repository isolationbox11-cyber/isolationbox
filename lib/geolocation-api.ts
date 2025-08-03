// Geolocation and attack source mapping utilities
// For real-time threat map visualization

export interface GeolocationData {
  ip: string
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
  threatLevel: 'high' | 'medium' | 'low'
  attackCount: number
}

export interface AttackEvent {
  sourceIp: string
  targetIp: string
  attackType: string
  timestamp: Date
  severity: 'critical' | 'high' | 'medium' | 'low'
  geolocation?: GeolocationData
}

// Known malicious IP ranges and threat intelligence
const KNOWN_THREAT_COUNTRIES = [
  { code: 'CN', name: 'China', baseThreatLevel: 0.8 },
  { code: 'RU', name: 'Russia', baseThreatLevel: 0.9 },
  { code: 'KP', name: 'North Korea', baseThreatLevel: 0.7 },
  { code: 'IR', name: 'Iran', baseThreatLevel: 0.6 },
  { code: 'TR', name: 'Turkey', baseThreatLevel: 0.4 },
  { code: 'BR', name: 'Brazil', baseThreatLevel: 0.3 },
  { code: 'IN', name: 'India', baseThreatLevel: 0.3 },
  { code: 'VN', name: 'Vietnam', baseThreatLevel: 0.4 },
  { code: 'UA', name: 'Ukraine', baseThreatLevel: 0.5 }
]

export class GeolocationAPI {
  private apiKey: string
  private cache = new Map<string, GeolocationData>()

  constructor() {
    this.apiKey = process.env.IPGEOLOCATION_API_KEY || ''
  }

  async getIPLocation(ip: string): Promise<GeolocationData | null> {
    // Check cache first
    if (this.cache.has(ip)) {
      return this.cache.get(ip)!
    }

    try {
      let data: any

      if (this.apiKey) {
        // Use ipgeolocation.io API if key is available
        const response = await fetch(
          `https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&ip=${ip}`
        )
        data = await response.json()
      } else {
        // Fallback to free ip-api.com (limited rate)
        const response = await fetch(`http://ip-api.com/json/${ip}`)
        data = await response.json()
      }

      const geoData: GeolocationData = {
        ip,
        country: data.country_name || data.country || 'Unknown',
        countryCode: data.country_code2 || data.countryCode || 'XX',
        city: data.city || 'Unknown',
        latitude: parseFloat(data.latitude || data.lat) || 0,
        longitude: parseFloat(data.longitude || data.lon) || 0,
        threatLevel: this.calculateThreatLevel(data.country_code2 || data.countryCode),
        attackCount: Math.floor(Math.random() * 1000) + 50 // Simulated attack count
      }

      this.cache.set(ip, geoData)
      return geoData
    } catch (error) {
      console.error('Geolocation API error for IP', ip, error)
      return this.getFallbackLocation(ip)
    }
  }

  private calculateThreatLevel(countryCode: string): 'high' | 'medium' | 'low' {
    const threat = KNOWN_THREAT_COUNTRIES.find(t => t.code === countryCode)
    if (!threat) return 'low'
    
    if (threat.baseThreatLevel >= 0.7) return 'high'
    if (threat.baseThreatLevel >= 0.4) return 'medium'
    return 'low'
  }

  private getFallbackLocation(ip: string): GeolocationData {
    // Return a random threat location as fallback
    const randomThreat = KNOWN_THREAT_COUNTRIES[
      Math.floor(Math.random() * KNOWN_THREAT_COUNTRIES.length)
    ]

    return {
      ip,
      country: randomThreat.name,
      countryCode: randomThreat.code,
      city: 'Unknown',
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      threatLevel: randomThreat.baseThreatLevel >= 0.7 ? 'high' : 
                  randomThreat.baseThreatLevel >= 0.4 ? 'medium' : 'low',
      attackCount: Math.floor(Math.random() * 1000) + 50
    }
  }

  // Generate simulated attack data for demonstration
  async generateLiveAttackData(): Promise<AttackEvent[]> {
    const attackTypes = [
      'SSH Brute Force', 'SQL Injection', 'DDoS Attack', 'Port Scan',
      'Malware Download', 'Phishing Attempt', 'Cryptocurrency Mining',
      'Ransomware Deployment', 'Data Exfiltration', 'Zombie Botnet'
    ]

    const events: AttackEvent[] = []
    const threatIPs = [
      '1.2.3.4', '185.220.101.182', '91.219.236.131', '185.220.102.8',
      '162.142.125.40', '89.248.165.154', '185.220.103.7', '37.139.129.146'
    ]

    for (let i = 0; i < 20; i++) {
      const sourceIp = threatIPs[Math.floor(Math.random() * threatIPs.length)]
      const geolocation = await this.getIPLocation(sourceIp)
      
      events.push({
        sourceIp,
        targetIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        severity: geolocation?.threatLevel === 'high' ? 'critical' : 
                 geolocation?.threatLevel === 'medium' ? 'high' : 'medium',
        geolocation: geolocation || undefined
      })
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get aggregated attack sources for the map
  async getAttackSources(): Promise<GeolocationData[]> {
    const sources: GeolocationData[] = []
    
    for (const country of KNOWN_THREAT_COUNTRIES) {
      const attackCount = Math.floor(Math.random() * 1000) + 
                         (country.baseThreatLevel * 500)
      
      sources.push({
        ip: '',
        country: country.name,
        countryCode: country.code,
        city: '',
        latitude: this.getCountryCoordinates(country.code).lat,
        longitude: this.getCountryCoordinates(country.code).lng,
        threatLevel: country.baseThreatLevel >= 0.7 ? 'high' : 
                    country.baseThreatLevel >= 0.4 ? 'medium' : 'low',
        attackCount
      })
    }

    return sources.sort((a, b) => b.attackCount - a.attackCount)
  }

  private getCountryCoordinates(countryCode: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'CN': { lat: 35.8617, lng: 104.1954 },
      'RU': { lat: 61.5240, lng: 105.3188 },
      'KP': { lat: 40.3399, lng: 127.5101 },
      'IR': { lat: 32.4279, lng: 53.6880 },
      'TR': { lat: 38.9637, lng: 35.2433 },
      'BR': { lat: -14.2350, lng: -51.9253 },
      'IN': { lat: 20.5937, lng: 78.9629 },
      'VN': { lat: 14.0583, lng: 108.2772 },
      'UA': { lat: 48.3794, lng: 31.1656 }
    }
    return coordinates[countryCode] || { lat: 0, lng: 0 }
  }
}

// Network scanning utilities for asset discovery
export class NetworkScanner {
  // Simulate network asset discovery
  async scanNetwork(subnet = '192.168.1.0/24'): Promise<any[]> {
    // In a real implementation, this would use actual network scanning
    // For now, we'll generate realistic-looking asset data
    
    const assetTypes = [
      { name: 'Web Server (nginx)', type: 'server', emoji: '🖥️', baseRisk: 15 },
      { name: 'Database Server (MySQL)', type: 'database', emoji: '🗄️', baseRisk: 45 },
      { name: 'Email Server (Exchange)', type: 'email', emoji: '📧', baseRisk: 85 },
      { name: 'File Server (Windows)', type: 'file', emoji: '📁', baseRisk: 20 },
      { name: 'Backup Server', type: 'backup', emoji: '💾', baseRisk: 35 },
      { name: 'Network Router', type: 'network', emoji: '🔗', baseRisk: 10 },
      { name: 'Security Camera', type: 'iot', emoji: '📹', baseRisk: 60 },
      { name: 'Smart Thermostat', type: 'iot', emoji: '🌡️', baseRisk: 25 },
      { name: 'Wireless Access Point', type: 'network', emoji: '📶', baseRisk: 30 },
      { name: 'Network Printer', type: 'printer', emoji: '🖨️', baseRisk: 40 }
    ]

    const assets = []
    const usedIPs = new Set()

    for (let i = 0; i < 12; i++) {
      let ip: string
      do {
        ip = `192.168.1.${Math.floor(Math.random() * 254) + 1}`
      } while (usedIPs.has(ip))
      usedIPs.add(ip)

      const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]
      const vulnerabilities = Math.floor(Math.random() * 6)
      const riskScore = assetType.baseRisk + (vulnerabilities * 10) + Math.floor(Math.random() * 20)
      
      assets.push({
        name: assetType.name,
        ip,
        status: riskScore > 70 ? 'critical' : riskScore > 40 ? 'warning' : 'secure',
        lastScan: this.getRandomTimeAgo(),
        vulnerabilities,
        riskScore: Math.min(riskScore, 100),
        type: assetType.type,
        emoji: assetType.emoji,
        ports: this.generateOpenPorts(assetType.type),
        services: this.generateServices(assetType.type)
      })
    }

    return assets.sort((a, b) => b.riskScore - a.riskScore)
  }

  private getRandomTimeAgo(): string {
    const timeOptions = [
      '30 min ago', '1 hour ago', '2 hours ago', '3 hours ago', '4 hours ago',
      '6 hours ago', '12 hours ago', '1 day ago', '2 days ago'
    ]
    return timeOptions[Math.floor(Math.random() * timeOptions.length)]
  }

  private generateOpenPorts(type: string): number[] {
    const portsByType: { [key: string]: number[] } = {
      'server': [80, 443, 22, 21],
      'database': [3306, 5432, 1433, 27017],
      'email': [25, 110, 143, 993, 995],
      'file': [445, 139, 21, 22],
      'backup': [22, 443, 8080],
      'network': [80, 443, 23, 161],
      'iot': [80, 443, 8080, 554],
      'printer': [80, 443, 515, 631, 9100]
    }
    
    const basePorts = portsByType[type] || [80, 443]
    const numPorts = Math.floor(Math.random() * 3) + 1
    return basePorts.slice(0, numPorts)
  }

  private generateServices(type: string): string[] {
    const servicesByType: { [key: string]: string[] } = {
      'server': ['nginx', 'apache', 'ssh'],
      'database': ['mysql', 'postgresql', 'mongodb'],
      'email': ['postfix', 'exchange', 'dovecot'],
      'file': ['samba', 'ftp', 'ssh'],
      'backup': ['rsync', 'bacula', 'veeam'],
      'network': ['http', 'snmp', 'telnet'],
      'iot': ['rtsp', 'http', 'upnp'],
      'printer': ['ipp', 'lpd', 'jetdirect']
    }
    
    return servicesByType[type] || ['unknown']
  }
}

export const geolocationAPI = new GeolocationAPI()
export const networkScanner = new NetworkScanner()