"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Bot, Shield, Eye, Zap } from "lucide-react"
import { getLiveThreatFeed } from "@/lib/unified-api"
import type { LiveFeedItem } from "@/lib/unified-api"

export function LiveThreatFeed() {
  const [threats, setThreats] = useState<LiveFeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadThreats() {
      try {
        const data = await getLiveThreatFeed()
        setThreats(data)
      } catch (error) {
        console.error('Failed to load threat feed:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThreats()
    
    // Refresh every 15 seconds
    const interval = setInterval(loadThreats, 15000)
    return () => clearInterval(interval)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return AlertTriangle
      case 'botnet': return Bot
      case 'vulnerability': return Shield
      case 'scanning': return Eye
      default: return Zap
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'malware': return 'text-red-500'
      case 'botnet': return 'text-orange-500'
      case 'vulnerability': return 'text-yellow-500'
      case 'scanning': return 'text-blue-500'
      default: return 'text-purple-500'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return `${seconds}s ago`
  }

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Live Threat Feed
          <Badge variant="outline" className="ml-auto">
            {threats.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-6">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : threats.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No threats detected
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {threats.map((threat) => {
                const Icon = getTypeIcon(threat.type)
                return (
                  <div key={threat.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className={`flex-shrink-0 p-2 rounded-full bg-muted ${getTypeColor(threat.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {threat.type.charAt(0).toUpperCase() + threat.type.slice(1)} Detection
                        </span>
                        <Badge variant={getSeverityColor(threat.severity) as any} className="text-xs">
                          {threat.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {threat.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          From: {threat.source} → {threat.target}
                        </span>
                        <span>
                          {formatTimeAgo(threat.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <span>{threat.location.city}, {threat.location.country}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
