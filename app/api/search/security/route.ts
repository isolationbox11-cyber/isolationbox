import { NextRequest, NextResponse } from 'next/server';
import { createGoogleSearchService } from '@/lib/google-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const startIndex = parseInt(searchParams.get('start') || '1');
    const count = parseInt(searchParams.get('num') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const searchService = createGoogleSearchService();
    const results = await searchService.searchSecurityContent(query, {
      startIndex,
      count,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Security search API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, startIndex = 1, count = 10 } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    const searchService = createGoogleSearchService();
    const results = await searchService.searchSecurityContent(query, {
      startIndex,
      count,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Security search API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}