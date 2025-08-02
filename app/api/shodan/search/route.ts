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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || 'port:80'
    const page = searchParams.get('page') || '1'
    const facets = searchParams.get('facets') || ''
    
    // Validate inputs
    if (query.length > 1000) {
      return NextResponse.json(
        { error: 'Query too long' },
        { status: 400 }
      )
    }

    const params: Record<string, string> = {
      q: query,
      page: page
    }

    if (facets) {
      params.facets = facets
    }

    const data = await makeShodanRequest('/shodan/host/search', params)
    
    // Transform data to match our UI expectations
    const transformedData = {
      total: data.total || 0,
      matches: (data.matches || []).slice(0, 10).map((match: any) => ({
        ip: match.ip_str,
        port: match.port,
        org: match.org || 'Unknown',
        hostnames: match.hostnames || [],
        location: {
          country_name: match.location?.country_name || 'Unknown',
          city: match.location?.city || 'Unknown'
        },
        data: match.data ? match.data.substring(0, 200) + '...' : '',
        product: match.product || 'Unknown',
        version: match.version || '',
        timestamp: match.timestamp,
        transport: match.transport || 'tcp'
      })),
      facets: data.facets || {}
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Shodan search error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.message.includes('API key') ? 401 : 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}