"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Info, Zap } from "lucide-react"

export function AlertsOverview() {
  const alertCounts = {
    critical: 2,
    high: 5,
    medium: 12,
    low: 8
  }

  const recentAlerts = [
    {
      title: "🎭 Suspicious Halloween-themed malware detected",
      severity: "Critical",
      time: "5 min ago",
      description: "Trojan disguised as Halloween screensaver"
    },
    {
      title: "🕷️ Web application vulnerability found",
      severity: "High", 
      time: "12 min ago",
      description: "SQL injection attempt on contact form"
    },
    {
      title: "👻 Unusual network traffic pattern",
      severity: "Medium",
      time: "28 min ago", 
      description: "Elevated traffic from unknown subnet"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "High": return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Low": return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          🚨 Alerts Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Alert counts */}
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-red-500/20 rounded border border-red-500/30">
              <div className="text-lg font-bold text-red-300">{alertCounts.critical}</div>
              <div className="text-xs text-red-400">Critical</div>
            </div>
            <div className="text-center p-2 bg-orange-500/20 rounded border border-orange-500/30">
              <div className="text-lg font-bold text-orange-300">{alertCounts.high}</div>
              <div className="text-xs text-orange-400">High</div>
            </div>
            <div className="text-center p-2 bg-yellow-500/20 rounded border border-yellow-500/30">
              <div className="text-lg font-bold text-yellow-300">{alertCounts.medium}</div>
              <div className="text-xs text-yellow-400">Medium</div>
            </div>
            <div className="text-center p-2 bg-blue-500/20 rounded border border-blue-500/30">
              <div className="text-lg font-bold text-blue-300">{alertCounts.low}</div>
              <div className="text-xs text-blue-400">Low</div>
            </div>
          </div>

          {/* Recent alerts */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-orange-300">Recent Alerts</h4>
            {recentAlerts.map((alert, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-lg border border-orange-500/20">
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-sm font-medium text-white leading-tight">{alert.title}</h5>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-1">{alert.description}</p>
                <div className="text-xs text-gray-500">{alert.time}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
              View all alerts →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}