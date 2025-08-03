import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentEvents() {
  const events = [
    {
      time: "14:23",
      type: "Security Alert",
      description: "Unusual login attempt from unknown location",
      severity: "warning",
      emoji: "⚠️"
    },
    {
      time: "13:45", 
      type: "System Update",
      description: "Security patches applied successfully",
      severity: "success",
      emoji: "✅"
    },
    {
      time: "12:30",
      type: "Firewall Block",
      description: "Blocked 47 suspicious connection attempts",
      severity: "info",
      emoji: "🛡️"
    },
    {
      time: "11:15",
      type: "Scan Complete",
      description: "Weekly vulnerability scan finished",
      severity: "success", 
      emoji: "🔍"
    },
    {
      time: "10:00",
      type: "Backup Complete",
      description: "Automated backup to secure storage",
      severity: "success",
      emoji: "💾"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "warning": return "bg-yellow-600"
      case "success": return "bg-green-600"
      case "info": return "bg-blue-600"
      case "error": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  return (
    <Card className="border-blue-800/30 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-300">
          <span className="text-2xl">📊</span>
          Recent Events
        </CardTitle>
        <CardDescription className="text-blue-200/70">
          Latest system activity and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-blue-950/20">
              <div className="text-xs text-blue-200/60 min-w-[3rem] mt-1">{event.time}</div>
              <span className="text-lg mt-0.5">{event.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-blue-300">{event.type}</h4>
                  <Badge variant="outline" className={`${getSeverityColor(event.severity)} text-white text-xs`}>
                    {event.severity}
                  </Badge>
                </div>
                <p className="text-sm text-blue-100/70">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}