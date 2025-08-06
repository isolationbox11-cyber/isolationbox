import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    // For now, return mock data since this is about fixing the UI
    // In production, this would integrate with the actual API clients
    const mockResults = [
      {
        id: 1,
        ip: '192.168.1.100',
        port: 80,
        service: 'HTTP',
        location: 'US',
        risk: 'medium',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        ip: '10.0.0.1',
        port: 22,
        service: 'SSH',
        location: 'UK',
        risk: 'high',
        timestamp: new Date().toISOString(),
      },
    ].filter(result => 
      result.ip.includes(query) || 
      result.service.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json({ 
      results: mockResults,
      query,
      total: mockResults.length 
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({ 
      error: 'Search failed',
      results: [],
      query 
    }, { status: 500 })
  }
}