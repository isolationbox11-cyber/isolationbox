"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Shield, Zap } from "lucide-react"

export function RecentEvents() {
  const events = [
    {
      time: "2 min ago",
      type: "Alert",
      message: "Suspicious login attempt blocked from unknown location",
      severity: "High",
      icon: "🚨"
    },
    {
      time: "8 min ago", 
      type: "Scan",
      message: "Vulnerability scan completed - 2 medium issues found",
      severity: "Medium",
      icon: "🔍"
    },
    {
      time: "15 min ago",
      type: "Update",
      message: "Firewall rules updated successfully",
      severity: "Info",
      icon: "✅"
    },
    {
      time: "22 min ago",
      type: "Threat",
      message: "Malware signature database updated",
      severity: "Info", 
      icon: "🛡️"
    },
    {
      time: "45 min ago",
      type: "Alert",
      message: "Port scan detected from external IP",
      severity: "Medium",
      icon: "⚠️"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Info": return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Clock className="h-5 w-5" />
          📰 Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-blue-500/20">
              <div className="text-lg">{event.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{event.time}</span>
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                </div>
                <p className="text-sm text-white leading-tight">{event.message}</p>
                <div className="text-xs text-gray-500 mt-1">{event.type}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all events →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}