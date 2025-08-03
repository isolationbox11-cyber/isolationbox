// Modern Next.js API route for cyber search functionality
import { NextRequest, NextResponse } from 'next/server';
import { CyberSearchResponse, CyberSearchResult, ApiResponse } from '@/types/api';

// Mock data generators for demonstration
function generateMockResults(query: string, count: number = 20): CyberSearchResult[] {
  const services = ['http', 'https', 'ssh', 'ftp', 'smtp', 'mysql', 'mongodb', 'redis', 'telnet', 'vnc'];
  const countries = ['US', 'CN', 'RU', 'DE', 'FR', 'BR', 'IN', 'JP', 'CA', 'UK'];
  const cities = ['New York', 'Beijing', 'Moscow', 'Berlin', 'Paris', 'São Paulo', 'Mumbai', 'Tokyo', 'Toronto', 'London'];
  const organizations = ['Google LLC', 'Amazon.com', 'Microsoft Corporation', 'Unknown', 'DigitalOcean', 'Cloudflare', 'Linode'];
  const vulnerabilities = ['CVE-2023-44487', 'CVE-2023-42793', 'CVE-2023-38831', 'CVE-2023-41265'];

  return Array.from({ length: count }, (_, i) => {
    const service = services[Math.floor(Math.random() * services.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const org = organizations[Math.floor(Math.random() * organizations.length)];
    
    // Generate realistic IP address
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    // Generate port based on service
    let port = 80;
    switch (service) {
      case 'https': port = 443; break;
      case 'ssh': port = 22; break;
      case 'ftp': port = 21; break;
      case 'smtp': port = 25; break;
      case 'mysql': port = 3306; break;
      case 'mongodb': port = 27017; break;
      case 'redis': port = 6379; break;
      case 'telnet': port = 23; break;
      case 'vnc': port = 5900; break;
      default: port = 80 + Math.floor(Math.random() * 9000);
    }

    // Add some randomness to make it feel more realistic
    const hasVulns = Math.random() < 0.3;
    const vulnCount = hasVulns ? Math.floor(Math.random() * 3) + 1 : 0;
    const selectedVulns = vulnerabilities.slice(0, vulnCount);

    return {
      id: `result_${i}_${Date.now()}`,
      ip,
      port,
      hostname: Math.random() < 0.7 ? `host-${i}.${org.toLowerCase().replace(/\s+/g, '')}.com` : undefined,
      country,
      city: Math.random() < 0.8 ? city : undefined,
      service,
      product: Math.random() < 0.6 ? `${service.charAt(0).toUpperCase() + service.slice(1)} Server` : undefined,
      version: Math.random() < 0.5 ? `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}` : undefined,
      os: Math.random() < 0.4 ? ['Linux', 'Windows', 'FreeBSD'][Math.floor(Math.random() * 3)] : undefined,
      lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      organization: Math.random() < 0.7 ? org : undefined,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
      vulnerabilities: selectedVulns.length > 0 ? selectedVulns : undefined,
      banner: Math.random() < 0.3 ? `${service.toUpperCase()}/1.1 200 OK\nServer: ${service}-server/${Math.floor(Math.random() * 5) + 1}.0` : undefined,
    };
  });
}

// Simulate API delay and potential errors
async function simulateRealisticAPI(query: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  
  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Search service temporarily unavailable');
  }
  
  // Simulate rate limiting for certain queries
  if (query.includes('test') && Math.random() < 0.3) {
    throw new Error('Rate limit exceeded. Please try again in a moment.');
  }
  
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const country = searchParams.get('country') || '';
    const service = searchParams.get('service') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(searchParams.get('perPage') || '20'), 100); // Max 100 results per page

    // Validate required parameters
    if (!query.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Query parameter is required',
          code: 'MISSING_QUERY'
        },
        { status: 400 }
      );
    }

    // Validate pagination
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Page must be a positive integer',
          code: 'INVALID_PAGE'
        },
        { status: 400 }
      );
    }

    // Simulate API processing
    await simulateRealisticAPI(query);

    // Generate mock results based on query
    const baseResults = generateMockResults(query, perPage * 3); // Generate more to simulate pagination
    
    // Apply filters
    let filteredResults = baseResults;
    
    if (country) {
      filteredResults = filteredResults.filter(result => 
        result.country.toLowerCase() === country.toLowerCase()
      );
    }
    
    if (service) {
      filteredResults = filteredResults.filter(result => 
        result.service.toLowerCase().includes(service.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);
    
    // Calculate if there are more results
    const hasMore = endIndex < filteredResults.length;
    
    const response: ApiResponse<CyberSearchResponse> = {
      success: true,
      data: {
        results: paginatedResults,
        total: filteredResults.length,
        query,
        page,
        perPage,
        hasMore,
      },
      message: `Found ${filteredResults.length} results for "${query}"`,
      timestamp: new Date().toISOString(),
    };

    // Add CORS headers for frontend access
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    console.error('Cyber search API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        code: 'SEARCH_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

// Handle POST requests for complex searches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {} } = body;

    if (!query?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Query is required in request body',
          code: 'MISSING_QUERY'
        },
        { status: 400 }
      );
    }

    // Simulate processing of complex search
    await simulateRealisticAPI(query);
    
    // Use filters from request body
    const results = generateMockResults(query, filters.perPage || 20);
    
    const response: ApiResponse<CyberSearchResponse> = {
      success: true,
      data: {
        results,
        total: results.length,
        query,
        page: filters.page || 1,
        perPage: filters.perPage || 20,
        hasMore: false,
      },
      message: `Complex search completed for "${query}"`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=30', // Shorter cache for complex searches
      },
    });

  } catch (error) {
    console.error('Complex cyber search API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'COMPLEX_SEARCH_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}