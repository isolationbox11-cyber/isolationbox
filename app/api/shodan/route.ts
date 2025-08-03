import { NextRequest, NextResponse } from 'next/server'

// Shodan API configuration
const SHODAN_API_BASE = 'https://api.shodan.io'
const SHODAN_API_KEY = process.env.SHODAN_API_KEY

interface ShodanSearchParams {
  query: string
  limit?: number
  page?: number
}

interface ShodanResult {
  ip_str: string
  port: number
  hostnames: string[]
  org: string
  os?: string
  data: string
  location: {
    country_name?: string
    city?: string
  }
  timestamp: string
}

interface ShodanResponse {
  matches: ShodanResult[]
  total: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, limit = 10, page = 1 } = body as ShodanSearchParams

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // If no API key, return mock data for demonstration
    if (!SHODAN_API_KEY) {
      console.log('Using mock data for query:', query)
      
      const mockResults = [
        {
          ip: '192.168.1.100',
          port: 80,
          hostnames: ['home-router.local'],
          organization: 'Residential ISP',
          os: 'Linux 2.6',
          country: 'United States',
          city: 'San Francisco',
          timestamp: new Date().toISOString(),
          preview: 'HTTP/1.1 200 OK Server: nginx/1.14.2'
        },
        {
          ip: '203.0.113.45',
          port: 8080,
          hostnames: ['smart-thermostat.example.com'],
          organization: 'Smart Home Corp',
          os: 'Unknown',
          country: 'Canada',
          city: 'Toronto',
          timestamp: new Date().toISOString(),
          preview: 'Smart Thermostat Control Panel - Please Login'
        },
        {
          ip: '198.51.100.78',
          port: 443,
          hostnames: [],
          organization: 'University of Technology',
          os: 'Windows Server 2019',
          country: 'United Kingdom',
          city: 'London',
          timestamp: new Date().toISOString(),
          preview: 'HTTPS/1.1 SSL Certificate - Secure Connection'
        },
        {
          ip: '172.16.0.50',
          port: 631,
          hostnames: ['printer-lab.edu'],
          organization: 'Educational Network',
          os: 'CUPS/2.3.0',
          country: 'Germany',
          city: 'Berlin',
          timestamp: new Date().toISOString(),
          preview: 'Internet Printing Protocol - CUPS Print Server'
        },
        {
          ip: '10.0.0.25',
          port: 554,
          hostnames: ['camera-01.security.local'],
          organization: 'Security Systems Inc',
          os: 'Linux ARM',
          country: 'Australia',
          city: 'Sydney',
          timestamp: new Date().toISOString(),
          preview: 'RTSP/1.0 200 OK - Video Streaming Server'
        }
      ]

      return NextResponse.json({
        results: mockResults.slice(0, limit),
        total: mockResults.length,
        query,
        page,
        limit,
        note: 'Demo data - Shodan API key not configured'
      })
    }

    // Construct Shodan API URL
    const shodanUrl = new URL('/shodan/host/search', SHODAN_API_BASE)
    shodanUrl.searchParams.set('key', SHODAN_API_KEY)
    shodanUrl.searchParams.set('query', query)
    shodanUrl.searchParams.set('limit', limit.toString())
    shodanUrl.searchParams.set('page', page.toString())

    // Make request to Shodan API
    const response = await fetch(shodanUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shodan API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch data from Shodan API' },
        { status: response.status }
      )
    }

    const data: ShodanResponse = await response.json()

    // Return sanitized results
    return NextResponse.json({
      results: data.matches?.map(result => ({
        ip: result.ip_str,
        port: result.port,
        hostnames: result.hostnames || [],
        organization: result.org || 'Unknown',
        os: result.os || 'Unknown',
        country: result.location?.country_name || 'Unknown',
        city: result.location?.city || 'Unknown',
        timestamp: result.timestamp,
        preview: result.data?.substring(0, 200) || '' // Only first 200 chars for preview
      })) || [],
      total: data.total || 0,
      query,
      page,
      limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}