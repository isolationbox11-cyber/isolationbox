"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { otxAPI, type ThreatIntelligenceData } from "@/lib/api-client"

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatIntelligenceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadThreats = async () => {
    setLoading(true)
    setError(null)
    try {
      const threatData = await otxAPI.getThreatPulses(5)
      setThreats(threatData)
      setLastUpdate(new Date())
    } catch (err) {
      setError('Failed to load threat intelligence')
      console.error('Error loading threats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreats()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadThreats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-700"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={loadThreats}
            disabled={loading}
            className="ml-auto text-orange-400 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Latest threats in the digital realm
          {lastUpdate && (
            <span className="block text-xs text-orange-300/60 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && threats.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 animate-pulse">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-600/30 rounded"></div>
                    <div className="w-32 h-4 bg-orange-600/30 rounded"></div>
                  </div>
                  <div className="w-16 h-6 bg-orange-600/30 rounded"></div>
                </div>
                <div className="w-full h-3 bg-orange-600/20 rounded mb-2"></div>
                <div className="w-24 h-3 bg-orange-600/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-950/30 rounded-lg border border-red-800/20">
            <p className="text-red-300 mb-2">⚠️ {error}</p>
            <Button 
              onClick={loadThreats} 
              variant="outline" 
              size="sm"
              className="border-red-600 text-red-300 hover:bg-red-950/50"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20 hover:bg-orange-950/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg animate-pulse">{threat.emoji}</span>
                    <h4 className="font-medium text-orange-300">{threat.name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    {threat.source && (
                      <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-black/30 text-xs">
                        {threat.source}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-orange-200/60">First seen: {threat.firstSeen}</p>
                  {threat.indicators && threat.indicators.length > 0 && (
                    <p className="text-xs text-orange-300/60">
                      {threat.indicators.length} IoCs available
                    </p>
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