import { NextResponse } from 'next/server'
import { getRecentThreats, transformThreatDataForDisplay, checkGreyNoiseConnection } from '@/lib/greynoise'

// Force dynamic to ensure fresh threat data
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if GreyNoise is configured and available
    const isConnected = await checkGreyNoiseConnection()
    
    if (!isConnected) {
      console.warn('GreyNoise API not available, using fallback data')
      // Return Halloween-themed fallback data if GreyNoise is not available
      return NextResponse.json({
        threats: [
          {
            name: "PhantomStrike Ransomware",
            severity: "high",
            description: "Active targeting of healthcare systems",
            firstSeen: "2 hours ago",
            emoji: "👻"
          },
          {
            name: "WitchCraft Botnet",
            severity: "medium", 
            description: "IoT device infections spreading",
            firstSeen: "6 hours ago",
            emoji: "🧙‍♀️"
          },
          {
            name: "Graveyard Phishing",
            severity: "high",
            description: "Halloween-themed email campaigns",
            firstSeen: "12 hours ago",
            emoji: "🪦"
          }
        ],
        source: 'fallback'
      })
    }

    // Fetch real threat data from GreyNoise
    const rawThreats = await getRecentThreats(10)
    const threats = transformThreatDataForDisplay(rawThreats)
    
    return NextResponse.json({
      threats,
      source: 'greynoise',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error fetching threat intelligence:', error)
    
    // Return fallback data on error
    return NextResponse.json({
      threats: [
        {
          name: "Connection Phantom",
          severity: "medium",
          description: "Unable to commune with threat spirits",
          firstSeen: "unknown",
          emoji: "👻"
        }
      ],
      source: 'error_fallback',
      error: 'Failed to fetch threat data'
    })
  }
}