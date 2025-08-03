"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRecentEvents } from "@/lib/hooks"
import { RecentEventsSkeleton } from "@/components/loading-skeletons"
import { InfoTooltip } from "@/components/educational-tooltips"
import { AlertCircle, RefreshCw, Clock } from "lucide-react"

export function RecentEvents() {
  const { data: events, loading, error, refresh } = useRecentEvents()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-yellow-600"
      case "success": return "bg-green-600"
      case "info": return "bg-blue-600"
      case "error": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  if (loading) {
    return <RecentEventsSkeleton />
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">📊</span>
          <InfoTooltip 
            title="Recent Events" 
            description="Live feed of security events, alerts, and system activities from various monitoring sources"
          >
            Recent Events
          </InfoTooltip>
          <div className="ml-auto flex items-center gap-2">
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
            "Latest system activity and alerts"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-950/20 border border-orange-800/10">
                <div className="flex items-center gap-1 text-xs text-orange-200/60 min-w-[4rem] mt-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </div>
                <span className="text-lg mt-0.5">{event.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-orange-300">{event.type}</h4>
                    <Badge variant="outline" className={`${getSeverityColor(event.severity)} text-white text-xs`}>
                      {event.severity}
                    </Badge>
                    {event.source && (
                      <Badge variant="outline" className="border-orange-600 text-orange-300 text-xs">
                        {event.source}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-orange-100/70">{event.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-orange-300/60">
              <span className="text-4xl block mb-2">📊</span>
              <p>No recent events to display!</p>
              <p className="text-xs text-orange-200/50 mt-1">Your systems are running quietly...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-yellow-950/30 rounded-lg border border-yellow-800/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-300 font-medium">Event Feed Connection Issue</p>
                <p className="text-yellow-200/80">
                  Unable to fetch live event data. Showing demo events for educational purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}