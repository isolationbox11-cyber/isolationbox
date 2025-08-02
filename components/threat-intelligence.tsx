"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Shield } from "lucide-react"

export function ThreatIntelligence() {
  const threats = [
    {
      name: "👻 Ghost RAT",
      severity: "Critical",
      affected: "15 systems",
      description: "Remote access trojan targeting Halloween-themed websites"
    },
    {
      name: "🎃 Pumpkin Phisher",
      severity: "High", 
      affected: "8 systems",
      description: "Email campaign impersonating seasonal retailers"
    },
    {
      name: "🦇 Bat Botnet",
      severity: "Medium",
      affected: "3 systems", 
      description: "IoT devices compromised for cryptocurrency mining"
    }
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
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          🧠 Threat Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat, index) => (
            <div key={index} className="p-4 bg-black/30 rounded-lg border border-red-500/20">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{threat.name}</h4>
                <Badge className={getSeverityColor(threat.severity)}>
                  {threat.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-2">{threat.description}</p>
              <div className="text-xs text-red-300">
                🎯 {threat.affected} affected
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="h-3 w-3" />
              Intelligence updated 5 minutes ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}