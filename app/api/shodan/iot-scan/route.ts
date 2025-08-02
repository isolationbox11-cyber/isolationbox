import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Shodan API configuration
const SHODAN_BASE_URL = 'https://api.shodan.io'

// Helper function to get API key
function getShodanApiKey(): string | null {
  return process.env.SHODAN_API_KEY || null
}

// Helper function to make Shodan API requests
async function makeShodanRequest(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = getShodanApiKey()
  
  if (!apiKey) {
    throw new Error('Shodan API key not configured')
  }

  try {
    const response = await axios.get(`${SHODAN_BASE_URL}${endpoint}`, {
      params: {
        key: apiKey,
        ...params
      },
      timeout: 10000 // 10 second timeout
    })
    
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid Shodan API key')
      }
      if (error.response?.status === 403) {
        throw new Error('Shodan API access forbidden - check your subscription')
      }
      if (error.response?.status === 429) {
        throw new Error('Shodan API rate limit exceeded')
      }
      throw new Error(`Shodan API error: ${error.response?.statusText || error.message}`)
    }
    throw error
  }
}

// Device type mappings with emojis and detection patterns
const devicePatterns = [
  {
    name: "Security Camera",
    emoji: "📹",
    queries: ["webcam", "camera", "netcam", "axis camera"],
    ports: [80, 8080, 554, 81]
  },
  {
    name: "Smart Thermostat",
    emoji: "🌡️",
    queries: ["thermostat", "nest", "ecobee", "temperature"],
    ports: [80, 443, 8080]
  },
  {
    name: "Smart Doorbell",
    emoji: "🔔",
    queries: ["doorbell", "ring", "nest doorbell"],
    ports: [80, 443, 8080]
  },
  {
    name: "WiFi Router",
    emoji: "📡",
    queries: ["router", "mikrotik", "cisco", "netgear", "tp-link"],
    ports: [80, 8080, 443, 8443]
  },
  {
    name: "Smart Light",
    emoji: "💡",
    queries: ["philips hue", "smart light", "lifx", "bulb"],
    ports: [80, 443]
  },
  {
    name: "IoT Device",
    emoji: "🏠",
    queries: ["iot", "arduino", "raspberry pi", "esp8266"],
    ports: [80, 8080]
  }
]

// Function to determine device security status based on Shodan data
function getDeviceStatus(match: any): { status: string, vulnerabilities: number, risk: string } {
  let vulnerabilities = 0
  let status = "secure"
  let risk = "Low"

  // Check for common security issues
  if (match.data && match.data.toLowerCase().includes('admin:admin')) vulnerabilities++
  if (match.data && match.data.toLowerCase().includes('password:password')) vulnerabilities++
  if (match.data && match.data.toLowerCase().includes('default')) vulnerabilities++
  if (!match.product || match.product === 'Unknown') vulnerabilities++
  if (match.port === 23 || match.port === 21) vulnerabilities++ // Telnet, FTP
  if (match.data && match.data.includes('200 OK') && !match.data.includes('authentication')) vulnerabilities++

  // Determine status based on vulnerabilities
  if (vulnerabilities >= 3) {
    status = "critical"
    risk = "Critical"
  } else if (vulnerabilities >= 1) {
    status = "warning"
    risk = "Medium"
  }

  return { status, vulnerabilities, risk }
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = getShodanApiKey()
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Shodan API key not configured',
          devices: [],
          fallback: true
        },
        { status: 200 } // Don't fail completely, return empty results
      )
    }

    // Search for different types of IoT devices
    const deviceSearches = await Promise.allSettled(
      devicePatterns.slice(0, 3).map(async (deviceType) => {
        try {
          const query = deviceType.queries[0] // Use first query for each device type
          const data = await makeShodanRequest('/shodan/host/search', {
            q: query,
            page: '1'
          })
          
          if (data.matches && data.matches.length > 0) {
            const match = data.matches[0] // Take first result
            const deviceInfo = getDeviceStatus(match)
            
            return {
              name: deviceType.name,
              emoji: deviceType.emoji,
              ip: match.ip_str,
              port: match.port,
              org: match.org || 'Unknown Organization',
              location: `${match.location?.city || 'Unknown'}, ${match.location?.country_name || 'Unknown'}`,
              product: match.product || 'Unknown',
              lastScan: 'Just now',
              ...deviceInfo
            }
          }
          return null
        } catch (error) {
          console.error(`Error searching for ${deviceType.name}:`, error)
          return null
        }
      })
    )

    // Process results and filter out failed searches
    const devices = deviceSearches
      .filter((result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)

    // If we don't have enough devices, fill with some fallback data that looks realistic
    while (devices.length < 5) {
      const randomDevice = devicePatterns[devices.length % devicePatterns.length]
      devices.push({
        name: randomDevice.name,
        emoji: randomDevice.emoji,
        ip: '0.0.0.0', // Placeholder
        port: randomDevice.ports[0],
        org: 'No live data available',
        location: 'Configure SHODAN_API_KEY',
        product: 'Unknown',
        lastScan: 'N/A',
        status: 'unknown',
        vulnerabilities: 0,
        risk: 'Unknown'
      })
    }

    return NextResponse.json({
      devices: devices.slice(0, 5), // Limit to 5 devices
      timestamp: new Date().toISOString(),
      source: apiKey ? 'shodan' : 'fallback'
    })

  } catch (error) {
    console.error('IoT scan error:', error)
    
    // Return fallback data instead of failing completely
    const fallbackDevices = devicePatterns.slice(0, 5).map(device => ({
      name: device.name,
      emoji: device.emoji,
      ip: '0.0.0.0',
      port: device.ports[0],
      org: 'API Error - Check Configuration',
      location: 'Unknown',
      product: 'Unknown',
      lastScan: 'Failed',
      status: 'unknown',
      vulnerabilities: 0,
      risk: 'Unknown'
    }))

    return NextResponse.json({
      devices: fallbackDevices,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}