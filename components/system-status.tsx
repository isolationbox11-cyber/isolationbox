"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckCircle, AlertCircle, XCircle, Server } from "lucide-react"

export function SystemStatus() {
  const systems = [
    {
      name: "🔥 Firewall",
      status: "Online",
      health: "Excellent",
      uptime: "99.9%",
      lastCheck: "1 min ago"
    },
    {
      name: "🛡️ Antivirus",
      status: "Online", 
      health: "Good",
      uptime: "99.7%",
      lastCheck: "2 min ago"
    },
    {
      name: "🔍 IDS/IPS",
      status: "Online",
      health: "Excellent", 
      uptime: "100%",
      lastCheck: "30 sec ago"
    },
    {
      name: "📊 SIEM",
      status: "Warning",
      health: "Degraded",
      uptime: "98.2%", 
      lastCheck: "5 min ago"
    },
    {
      name: "☁️ Backup System",
      status: "Online",
      health: "Good",
      uptime: "99.5%",
      lastCheck: "10 min ago"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online": return <CheckCircle className="h-4 w-4 text-green-400" />
      case "Warning": return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "Offline": return <XCircle className="h-4 w-4 text-red-400" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Warning": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Offline": return "bg-red-500/20 text-red-300 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excellent": return "text-green-400"
      case "Good": return "text-blue-400"
      case "Degraded": return "text-yellow-400"
      case "Poor": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  return (
    <Card className="border-green-500/30 bg-gradient-to-r from-black to-green-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Server className="h-5 w-5" />
          ⚙️ System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                {getStatusIcon(system.status)}
                <div>
                  <div className="font-medium text-white">{system.name}</div>
                  <div className="text-xs text-gray-400">
                    Health: <span className={getHealthColor(system.health)}>{system.health}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(system.status)}>
                  {system.status}
                </Badge>
                <div className="text-xs text-gray-500 mt-1">
                  {system.uptime} • {system.lastCheck}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            Overall system health: <span className="font-semibold">Good</span>
          </div>
          <div className="text-xs text-green-300/70 mt-1">
            4 of 5 systems operating normally
          </div>
        </div>
      </CardContent>
    </Card>
  )
}