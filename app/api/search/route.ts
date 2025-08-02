import { NextRequest, NextResponse } from 'next/server';
import { createGoogleSearchService } from '@/lib/google-search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const startIndex = parseInt(searchParams.get('start') || '1');
    const count = parseInt(searchParams.get('num') || '10');
    const siteSearch = searchParams.get('siteSearch') || undefined;
    const dateRestrict = searchParams.get('dateRestrict') || undefined;
    const gl = searchParams.get('gl') || undefined;
    const lr = searchParams.get('lr') || undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const searchService = createGoogleSearchService();
    const results = await searchService.search({
      query,
      startIndex,
      count,
      siteSearch,
      dateRestrict,
      gl,
      lr,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Google Custom Search API error:', error);
    
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
    const {
      query,
      startIndex = 1,
      count = 10,
      siteSearch,
      dateRestrict,
      sort,
      gl,
      lr,
      safe = 'active'
    } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required in request body' },
        { status: 400 }
      );
    }

    const searchService = createGoogleSearchService();
    const results = await searchService.search({
      query,
      startIndex,
      count,
      siteSearch,
      dateRestrict,
      sort,
      gl,
      lr,
      safe,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Google Custom Search API error:', error);
    
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