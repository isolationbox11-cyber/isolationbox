import { NextRequest, NextResponse } from 'next/server';
import { createOTXClient } from '@/lib/otx-client';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const otxClient = createOTXClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    const indicators = await otxClient.getRecentIndicators(['IPv4', 'domain', 'hostname', 'FileHash-SHA256'], limit);
    
    // Transform indicators to IOC format
    const iocs = indicators.map((indicator, index) => ({
      indicator: indicator.indicator,
      type: indicator.type,
      description: indicator.description || `${indicator.type} indicator from OTX`,
      created: indicator.created,
      severity: determineIOCSeverity(indicator.type),
      source: 'AlienVault OTX'
    }));

    return NextResponse.json({ indicators: iocs });
  } catch (error) {
    console.error('Error fetching OTX indicators:', error);
    
    // Return fallback data if OTX API fails
    const fallbackIOCs = [
      {
        indicator: "API_CONNECTION_ERROR",
        type: "system",
        description: "Unable to fetch live IOC data. Check OTX API configuration.",
        created: new Date().toISOString(),
        severity: "medium",
        source: "System Alert"
      }
    ];
    
    return NextResponse.json({ indicators: fallbackIOCs });
  }
}

function determineIOCSeverity(type: string): string {
  switch (type) {
    case 'FileHash-SHA256':
    case 'FileHash-MD5':
      return 'high';
    case 'IPv4':
    case 'hostname':
      return 'medium';
    case 'domain':
      return 'low';
    default:
      return 'medium';
  }
}