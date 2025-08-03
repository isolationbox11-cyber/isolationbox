import { NextRequest, NextResponse } from 'next/server';
import { virusTotalService } from '@/lib/virustotal';

export async function GET(request: NextRequest) {
  try {
    const vulnerabilities = await virusTotalService.getRecentCVEs();
    
    return NextResponse.json({
      success: true,
      data: vulnerabilities,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in vulnerabilities API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch vulnerability data',
      data: []
    }, { status: 500 });
  }
}