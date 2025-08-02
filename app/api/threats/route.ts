import { NextRequest, NextResponse } from 'next/server';
import { virusTotalService } from '@/lib/virustotal';

export async function GET(request: NextRequest) {
  try {
    const threats = await virusTotalService.getRecentThreats();
    
    return NextResponse.json({
      success: true,
      data: threats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in threats API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch threat data',
      data: []
    }, { status: 500 });
  }
}