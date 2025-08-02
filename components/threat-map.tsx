"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ThreatMap() {
  const threats = [
    { location: "Salem, MA", type: "Malware", severity: "High", time: "2 min ago" },
    { location: "Boston, MA", type: "Phishing", severity: "Medium", time: "5 min ago" },
    { location: "Cambridge, MA", type: "DDoS", severity: "Critical", time: "8 min ago" },
    { location: "Lowell, MA", type: "Ransomware", severity: "High", time: "12 min ago" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "High": return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <Card className="border-red-500/30 bg-gradient-to-r from-black to-red-950">
      <CardHeader>
        <CardTitle className="text-red-400">⚠️ Active Threat Intelligence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {threats.map((threat, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-red-500/20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{threat.location}</span>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400">{threat.type} • {threat.time}</div>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 font-mono">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}