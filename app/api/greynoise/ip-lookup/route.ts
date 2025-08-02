import { NextRequest, NextResponse } from 'next/server'
import { getIPContext } from '@/lib/greynoise'

// Force dynamic to handle query parameters
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')
    
    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 })
    }
    
    // Validate IP format (basic validation)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(ip)) {
      return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 })
    }
    
    const context = await getIPContext(ip)
    
    // Transform the data for Halloween theme
    const spookyResponse = {
      ip,
      isNoisy: context.noise,
      isRiot: context.riot,
      classification: context.classification,
      threatLevel: getThreatLevel(context.classification, context.noise),
      lastSeen: context.last_seen,
      spookyDescription: getSpookyDescription(context),
      emoji: getSpookyEmoji(context.classification),
      source: 'greynoise',
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(spookyResponse)
    
  } catch (error) {
    console.error('Error looking up IP:', error)
    
    return NextResponse.json({
      error: 'Failed to commune with the digital spirits',
      source: 'error',
      emoji: '💀'
    }, { status: 500 })
  }
}

function getThreatLevel(classification: string, noise: boolean): string {
  if (classification === 'malicious') return 'high'
  if (classification === 'benign' && noise) return 'low'
  if (noise) return 'medium'
  return 'unknown'
}

function getSpookyDescription(context: any): string {
  if (context.classification === 'malicious') {
    return `This IP haunts the digital realm with malicious intent. It has been spotted casting dark spells across the internet.`
  }
  if (context.riot) {
    return `This IP belongs to a known digital entity in the GreyNoise RIOT dataset - generally trustworthy but active.`
  }
  if (context.noise) {
    return `This IP creates digital noise in the ether - it's actively scanning or probing the internet.`
  }
  return `This IP appears to be a quiet spirit, not making much noise in the digital realm.`
}

function getSpookyEmoji(classification: string): string {
  switch (classification) {
    case 'malicious': return '💀'
    case 'benign': return '👻'
    default: return '🔮'
  }
}