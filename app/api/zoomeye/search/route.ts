import { NextRequest, NextResponse } from 'next/server';
import { createZoomEyeClient } from '@/lib/zoomeye';

/**
 * ZoomEye Search API Route
 * Provides secure server-side access to ZoomEye search capabilities
 * Halloween-themed cybersecurity monitoring for Salem Cyber Vault
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { query, page = 1, type = 'host', facets } = body;

    // Validate required parameters
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameter. The spirits require a proper incantation.',
          success: false 
        },
        { status: 400 }
      );
    }

    // Validate search type
    if (type !== 'host' && type !== 'web') {
      return NextResponse.json(
        { 
          error: 'Invalid search type. Must be either "host" or "web".',
          success: false 
        },
        { status: 400 }
      );
    }

    // Create ZoomEye client
    const client = createZoomEyeClient();

    // Perform search based on type
    let results;
    if (type === 'host') {
      results = await client.searchHosts({
        query: query.trim(),
        page: parseInt(page.toString()) || 1,
        facets,
      });
    } else {
      results = await client.searchWeb({
        query: query.trim(),
        page: parseInt(page.toString()) || 1,
        facets,
      });
    }

    // Return successful response with Halloween theme
    return NextResponse.json({
      success: true,
      data: results,
      message: `🔮 The digital séance has revealed ${results.matches.length} spectral entities for your query: "${query}"`,
      metadata: {
        query,
        page,
        type,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('ZoomEye API Error:', error);
    
    // Return error response with Halloween theming
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unknown supernatural error occurred',
        success: false,
        message: '👻 The spirits are not responding. Please try your incantation again.',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user info and quota
    const client = createZoomEyeClient();
    const userInfo = await client.getUserInfo();

    return NextResponse.json({
      success: true,
      data: userInfo,
      message: '🎃 Salem Cyber Vault ZoomEye integration is active and ready for digital divination.',
    });

  } catch (error) {
    console.error('ZoomEye User Info Error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to commune with the ZoomEye spirits',
        success: false,
        message: '🦇 Unable to establish connection with the digital realm.',
      },
      { status: 500 }
    );
  }
}