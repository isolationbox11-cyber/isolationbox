"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wifi, WifiOff } from "lucide-react"

interface Threat {
  name: string
  severity: string
  description: string
  firstSeen: string
  emoji: string
  ip?: string
  classification?: string
}

interface ThreatResponse {
  threats: Threat[]
  source: string
  timestamp?: string
  error?: string
}

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<string>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/greynoise/threats')
        const data: ThreatResponse = await response.json()
        
        setThreats(data.threats)
        setDataSource(data.source)
        setError(data.error || null)
      } catch (err) {
        console.error('Failed to fetch threat intelligence:', err)
        setError('Failed to commune with threat spirits')
        // Fallback to static data
        setThreats([
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
        ])
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }

    fetchThreats()
    
    // Refresh threats every 5 minutes
    const interval = setInterval(fetchThreats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const threats_fallback = [
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
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🕵️</span>
          Threat Intelligence
          {dataSource === 'greynoise' && (
            <Badge variant="outline" className="ml-auto bg-green-900/30 border-green-600/50 text-green-400">
              <Wifi className="h-3 w-3 mr-1" />
              Live GreyNoise
            </Badge>
          )}
          {dataSource === 'fallback' && (
            <Badge variant="outline" className="ml-auto bg-orange-900/30 border-orange-600/50 text-orange-400">
              <WifiOff className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {dataSource === 'greynoise' 
            ? 'Live threats detected in the digital realm via GreyNoise'
            : 'Latest threats in the digital realm'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-600/50 bg-red-900/20">
            <AlertDescription className="text-red-400">
              ⚠️ {error}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                <div className="h-4 bg-orange-800/20 rounded mb-2"></div>
                <div className="h-3 bg-orange-800/10 rounded mb-1"></div>
                <div className="h-3 bg-orange-800/10 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{threat.emoji}</span>
                    <h4 className="font-medium text-orange-300">{threat.name}</h4>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-orange-200/60">First seen: {threat.firstSeen}</p>
                  {threat.ip && (
                    <Badge variant="outline" className="text-xs bg-black/30 border-orange-600/30 text-orange-300">
                      {threat.ip}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}