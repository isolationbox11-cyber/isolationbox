/**
 * Real API integrations for the beginner-friendly dashboard
 * Replaces mock data with actual API calls to cybersecurity services
 */

import { API_CONFIG } from './api-config'

export interface ShodanHost {
  ip_str: string
  port: number
  transport: string
  product?: string
  version?: string
  title?: string
  location?: {
    country_name?: string
    city?: string
    region_code?: string
  }
  org?: string
  isp?: string
  asn?: string
  hostnames?: string[]
  domains?: string[]
  timestamp?: string
  vulns?: string[]
  data?: string
}

export interface ShodanSearchResult {
  matches: ShodanHost[]
  total: number
  facets?: Record<string, any>
}

export interface CVEDetails {
  id: string
  description: string
  cvss_score?: number
  published_date: string
  modified_date: string
  severity: string
  references: string[]
}

export interface ThreatIntelResult {
  ip: string
  abuse_confidence: number
  country_code: string
  usage_type: string
  is_malicious: boolean
  reports: any[]
  last_reported?: string
}

/**
 * Search Shodan with real API integration
 */
export async function searchShodan(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<ShodanSearchResult> {
  if (!API_CONFIG.SHODAN.isConfigured) {
    // Return demo data when API is not configured
    return generateDemoShodanData(query, limit)
  }

  try {
    const response = await fetch(
      `${API_CONFIG.SHODAN.baseUrl}/shodan/host/search?key=${API_CONFIG.SHODAN.key}&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    )

    if (!response.ok) {
      throw new Error(`Shodan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      matches: data.matches || [],
      total: data.total || 0,
      facets: data.facets
    }
  } catch (error) {
    console.error('Shodan search error:', error)
    throw new Error(`Failed to search Shodan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get popular Shodan queries for preset searches
 */
export async function getPopularShodanQueries(): Promise<Array<{ query: string; title: string; description: string }>> {
  if (!API_CONFIG.SHODAN.isConfigured) {
    return [
      { query: 'port:80 apache', title: 'Apache Web Servers', description: 'Find Apache HTTP servers' },
      { query: 'port:22 ssh', title: 'SSH Services', description: 'Discover SSH access points' },
      { query: 'port:3389 rdp', title: 'RDP Services', description: 'Remote Desktop Protocol endpoints' },
      { query: 'product:nginx', title: 'Nginx Servers', description: 'Nginx web servers and proxies' },
      { query: 'port:21 ftp', title: 'FTP Servers', description: 'File Transfer Protocol services' }
    ]
  }

  try {
    const response = await fetch(
      `${API_CONFIG.SHODAN.baseUrl}/shodan/query?key=${API_CONFIG.SHODAN.key}&sort=timestamp&order=desc`
    )

    if (!response.ok) {
      throw new Error(`Shodan query API error: ${response.status}`)
    }

    const data = await response.json()
    return data.matches?.slice(0, 10).map((item: any) => ({
      query: item.query,
      title: item.title || `Query: ${item.query}`,
      description: item.description || `Popular search query`
    })) || []
  } catch (error) {
    console.error('Error fetching popular queries:', error)
    return []
  }
}

/**
 * Get recent CVE vulnerabilities
 */
export async function getRecentCVEs(limit: number = 20): Promise<CVEDetails[]> {
  try {
    // Using CVE.org's public API
    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=${limit}&startIndex=0`
    )

    if (!response.ok) {
      throw new Error(`CVE API error: ${response.status}`)
    }

    const data = await response.json()
    return data.vulnerabilities?.map((vuln: any) => {
      const cve = vuln.cve
      return {
        id: cve.id,
        description: cve.descriptions?.[0]?.value || 'No description available',
        published_date: cve.published,
        modified_date: cve.lastModified,
        severity: cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN',
        cvss_score: cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
        references: cve.references?.map((ref: any) => ref.url) || []
      }
    }) || []
  } catch (error) {
    console.error('Error fetching CVEs:', error)
    return []
  }
}

/**
 * Check IP reputation with AbuseIPDB
 */
export async function checkIPReputation(ip: string): Promise<ThreatIntelResult | null> {
  if (!API_CONFIG.ABUSEIPDB.isConfigured) {
    return null
  }

  try {
    const response = await fetch(
      `${API_CONFIG.ABUSEIPDB.baseUrl}/check?ipAddress=${ip}&maxAgeInDays=90&verbose`,
      {
        headers: {
          'Key': API_CONFIG.ABUSEIPDB.key,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`AbuseIPDB API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      ip: data.data.ipAddress,
      abuse_confidence: data.data.abuseConfidencePercentage,
      country_code: data.data.countryCode,
      usage_type: data.data.usageType,
      is_malicious: data.data.abuseConfidencePercentage > 25,
      reports: data.data.reports || [],
      last_reported: data.data.lastReportedAt
    }
  } catch (error) {
    console.error('Error checking IP reputation:', error)
    return null
  }
}

/**
 * Scan file/URL with VirusTotal
 */
export async function scanWithVirusTotal(resource: string, type: 'url' | 'file' = 'url'): Promise<any> {
  if (!API_CONFIG.VIRUSTOTAL.isConfigured) {
    return null
  }

  try {
    const endpoint = type === 'url' ? 'urls' : 'files'
    const response = await fetch(
      `${API_CONFIG.VIRUSTOTAL.baseUrl}/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'X-Apikey': API_CONFIG.VIRUSTOTAL.key,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: type === 'url' ? `url=${encodeURIComponent(resource)}` : resource
      }
    )

    if (!response.ok) {
      throw new Error(`VirusTotal API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error scanning with VirusTotal:', error)
    return null
  }
}

/**
 * Get GreyNoise intelligence
 */
export async function getGreyNoiseIntel(ip: string): Promise<any> {
  if (!API_CONFIG.GREYNOISE.isConfigured) {
    return null
  }

  try {
    const response = await fetch(
      `${API_CONFIG.GREYNOISE.baseUrl}/community/${ip}`,
      {
        headers: {
          'key': API_CONFIG.GREYNOISE.key
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GreyNoise API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching GreyNoise intel:', error)
    return null
  }
}

/**
 * Generate demo data when APIs are not configured
 */
function generateDemoShodanData(query: string, limit: number): ShodanSearchResult {
  const demoHosts: ShodanHost[] = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    ip_str: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    port: query.includes('80') ? 80 : query.includes('443') ? 443 : 22,
    transport: 'tcp',
    product: query.includes('apache') ? 'Apache httpd' : query.includes('nginx') ? 'nginx' : 'OpenSSH',
    version: '2.4.41',
    title: `Demo Server ${i + 1}`,
    location: {
      country_name: ['United States', 'Germany', 'Japan', 'United Kingdom'][i % 4],
      city: ['New York', 'Berlin', 'Tokyo', 'London'][i % 4],
      region_code: ['NY', 'BE', 'TK', 'LN'][i % 4]
    },
    org: `Demo Organization ${i + 1}`,
    isp: 'Demo ISP',
    asn: `AS${12345 + i}`,
    hostnames: [`demo${i + 1}.example.com`],
    domains: ['example.com'],
    timestamp: new Date().toISOString(),
    vulns: query.includes('vuln') ? [`CVE-2024-${1000 + i}`] : []
  }))

  return {
    matches: demoHosts,
    total: 1000 + Math.floor(Math.random() * 9000),
    facets: {}
  }
}

/**
 * Get comprehensive threat intelligence for an IP
 */
export async function getComprehensiveThreatIntel(ip: string): Promise<{
  abuseipdb?: ThreatIntelResult
  greynoise?: any
  shodan?: ShodanHost[]
}> {
  const results: any = {}

  try {
    // Parallel API calls for comprehensive intelligence
    const [abuseResult, greynoiseResult, shodanResult] = await Promise.allSettled([
      checkIPReputation(ip),
      getGreyNoiseIntel(ip),
      searchShodan(`ip:${ip}`)
    ])

    if (abuseResult.status === 'fulfilled' && abuseResult.value) {
      results.abuseipdb = abuseResult.value
    }

    if (greynoiseResult.status === 'fulfilled' && greynoiseResult.value) {
      results.greynoise = greynoiseResult.value
    }

    if (shodanResult.status === 'fulfilled' && shodanResult.value) {
      results.shodan = shodanResult.value.matches
    }
  } catch (error) {
    console.error('Error getting comprehensive threat intel:', error)
  }

  return results
}