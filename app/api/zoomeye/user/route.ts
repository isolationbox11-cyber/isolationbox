import { NextRequest, NextResponse } from 'next/server';
import { createZoomEyeClient } from '@/lib/zoomeye';

/**
 * ZoomEye User Info API Route
 * Provides secure access to ZoomEye account information and quotas
 */

export async function GET(request: NextRequest) {
  try {
    // Create ZoomEye client
    const client = createZoomEyeClient();
    
    // Get user account information
    const userInfo = await client.getUserInfo();

    return NextResponse.json({
      success: true,
      data: {
        plan: userInfo.plan || 'Unknown',
        resources: userInfo.resources || {},
        quota: userInfo.quota || {},
        email: userInfo.email || 'Unknown',
      },
      message: '🎃 Salem Cyber Vault ZoomEye connection established successfully.',
      metadata: {
        timestamp: new Date().toISOString(),
        service: 'ZoomEye API',
      },
    });

  } catch (error) {
    console.error('ZoomEye User Info Error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to retrieve user information',
        success: false,
        message: '🦇 Unable to establish connection with the ZoomEye spiritual realm.',
      },
      { status: 500 }
    );
  }
}