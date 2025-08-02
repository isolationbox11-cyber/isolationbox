"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useThreatIntelligence } from "@/lib/hooks"
import { ThreatIntelligenceSkeleton } from "@/components/loading-skeletons"
import { ThreatIntelligenceHelp, InfoTooltip } from "@/components/educational-tooltips"
import { AlertCircle, RefreshCw } from "lucide-react"

export function ThreatIntelligence() {
  const { data: threats, loading, error, refresh } = useThreatIntelligence()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  if (loading) {
    return <ThreatIntelligenceSkeleton />
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🕵️</span>
          <InfoTooltip 
            title="Threat Intelligence" 
            description="Real-time threat data from AlienVault OTX and other sources to identify active cyber threats and malicious activity"
          >
            Threat Intelligence
          </InfoTooltip>
          <div className="ml-auto flex items-center gap-2">
            <ThreatIntelligenceHelp />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              className="text-orange-300 hover:text-orange-200"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          {error ? (
            <span className="flex items-center gap-1 text-yellow-400">
              <AlertCircle className="h-3 w-3" />
              Using demo data (API unavailable)
            </span>
          ) : (
            "Latest threats in the digital realm"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats && threats.length > 0 ? (
            threats.map((threat, index) => (
              <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{threat.emoji}</span>
                    <div>
                      <h4 className="font-medium text-orange-300">{threat.name}</h4>
                      {threat.source && (
                        <p className="text-xs text-orange-200/50">Source: {threat.source}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <p className="text-xs text-orange-200/60">First seen: {threat.firstSeen}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-orange-300/60">
              <span className="text-4xl block mb-2">🎃</span>
              <p>No active threats detected in your realm!</p>
              <p className="text-xs text-orange-200/50 mt-1">The spirits are quiet tonight...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-300 font-medium">API Connection Issue</p>
                <p className="text-yellow-200/80">
                  Unable to fetch live threat data. Showing demo data for educational purposes.
                  Check your API configuration or try refreshing.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}