"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Activity } from "lucide-react"

export function RecentEvents() {
  const events = [
    {
      id: 1,
      title: "Security scan completed",
      description: "Full system scan finished with no threats detected",
      timestamp: "5 min ago",
      type: "success"
    },
    {
      id: 2,
      title: "Failed login attempt",
      description: "Suspicious login attempt from unknown IP address",
      timestamp: "12 min ago", 
      type: "warning"
    },
    {
      id: 3,
      title: "Software update available",
      description: "Critical security updates ready for installation",
      timestamp: "1 hour ago",
      type: "info"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Events
        </CardTitle>
        <CardDescription>Latest security activities and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground">{event.timestamp}</p>
              </div>
              <Badge variant={
                event.type === 'success' ? 'default' :
                event.type === 'warning' ? 'destructive' : 'secondary'
              }>
                {event.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}