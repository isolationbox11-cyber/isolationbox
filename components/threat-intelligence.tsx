"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading"
import { useDashboard } from "@/contexts/dashboard-context"
import { RefreshCw } from "lucide-react"

export function ThreatIntelligence() {
  const { state, actions } = useDashboard()
  const { threats, loading, errors } = state

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600"
      case "high": return "bg-orange-600"
      case "medium": return "bg-yellow-600"
      case "low": return "bg-green-600"
      default: return "bg-gray-600"
    }
  }

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case "critical": return "🚨"
      case "high": return "⚠️"
      case "medium": return "📊"
      case "low": return "ℹ️"
      default: return "❓"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Less than 1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕵️</span>
            Threat Intelligence
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.refreshThreats}
            disabled={loading.threats}
            className="text-orange-300 hover:text-orange-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading.threats ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Live threat detection and intelligence feeds
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading.threats && threats.length === 0 ? (
          <LoadingSpinner text="Loading threat intelligence..." className="py-8" />
        ) : errors.threats ? (
          <ErrorDisplay 
            error={errors.threats} 
            retry={actions.refreshThreats}
            className="my-4"
          />
        ) : threats.length > 0 ? (
          <div className="space-y-4">
            {threats.slice(0, 5).map((threat, index) => (
              <div key={threat.id || index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSeverityEmoji(threat.severity)}</span>
                    <h4 className="font-medium text-orange-300">{threat.title}</h4>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-orange-100/70 mb-2">{threat.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-orange-200/60">
                    First seen: {formatTimestamp(threat.timestamp)}
                  </span>
                  <span className="text-orange-300/60">
                    Source: {threat.source}
                  </span>
                </div>
                {threat.indicators && threat.indicators.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-orange-300/70">Indicators: </span>
                    {threat.indicators.slice(0, 3).map((indicator, i) => (
                      <Badge 
                        key={i} 
                        variant="outline" 
                        className="text-xs mr-1 border-orange-500/30 text-orange-400"
                      >
                        {indicator}
                      </Badge>
                    ))}
                    {threat.indicators.length > 3 && (
                      <span className="text-xs text-orange-300/50">
                        +{threat.indicators.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {threats.length > 5 && (
              <div className="text-center">
                <Button variant="outline" className="border-orange-500/50 text-orange-400">
                  View All {threats.length} Threats
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎃</div>
            <p className="text-orange-300/70">No active threats detected</p>
            <p className="text-xs text-orange-200/50 mt-1">Your digital realm appears peaceful</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}