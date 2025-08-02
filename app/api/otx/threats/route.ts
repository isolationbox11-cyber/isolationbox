import { NextRequest, NextResponse } from 'next/server';
import { createOTXClient } from '@/lib/otx-client';

// Force dynamic rendering for API routes
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const otxClient = createOTXClient();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const pulses = await otxClient.getRecentPulses(limit);
    
    // Transform OTX data to match our component format
    const threats = pulses.slice(0, 5).map((pulse, index) => ({
      name: pulse.name,
      severity: determineSeverity(pulse),
      description: pulse.description || 'No description available',
      firstSeen: formatTimeAgo(pulse.created),
      emoji: getTheatEmoji(index),
      source: 'AlienVault OTX',
      tags: pulse.tags,
      malwareFamilies: pulse.malware_families,
      indicators: pulse.indicators?.length || 0
    }));

    return NextResponse.json({ threats });
  } catch (error) {
    console.error('Error fetching OTX threats:', error);
    
    // Return fallback data if OTX API fails
    const fallbackThreats = [
      {
        name: "OTX API Connection Error",
        severity: "medium",
        description: "Unable to fetch live threat data. Check API configuration.",
        firstSeen: "Now",
        emoji: "⚠️",
        source: "System Alert"
      }
    ];
    
    return NextResponse.json({ threats: fallbackThreats });
  }
}

function determineSeverity(pulse: any): string {
  if (pulse.malware_families?.length > 0) return 'high';
  if (pulse.attack_ids?.length > 0) return 'high';
  if (pulse.indicators?.length > 10) return 'medium';
  return 'low';
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Less than 1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 48) return '1 day ago';
  return `${Math.floor(diffHours / 24)} days ago`;
}

function getTheatEmoji(index: number): string {
  const emojis = ['👻', '🧙‍♀️', '🪦', '🎃', '🕷️', '🦇', '💀', '🔮'];
  return emojis[index % emojis.length];
}