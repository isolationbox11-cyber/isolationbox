"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, HardDrive, Wifi, Smartphone, Monitor, Database } from "lucide-react"

export function AssetMonitoring() {
  const assets = [
    {
      name: "🎃 Main Web Server",
      type: "Server",
      status: "Online",
      cpu: 45,
      memory: 67,
      disk: 23,
      lastSeen: "Online",
      icon: <Server className="h-4 w-4" />
    },
    {
      name: "🕷️ Database Server",
      type: "Database", 
      status: "Online",
      cpu: 78,
      memory: 89,
      disk: 56,
      lastSeen: "Online",
      icon: <Database className="h-4 w-4" />
    },
    {
      name: "👻 Backup Server",
      type: "Storage",
      status: "Warning",
      cpu: 12,
      memory: 34,
      disk: 91,
      lastSeen: "2 min ago",
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      name: "🦇 Load Balancer",
      type: "Network",
      status: "Online", 
      cpu: 23,
      memory: 45,
      disk: 15,
      lastSeen: "Online",
      icon: <Wifi className="h-4 w-4" />
    },
    {
      name: "🕸️ Monitoring Station",
      type: "Workstation",
      status: "Offline",
      cpu: 0,
      memory: 0,
      disk: 67,
      lastSeen: "15 min ago",
      icon: <Monitor className="h-4 w-4" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Warning": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Offline": return "bg-red-500/20 text-red-300 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage > 80) return "bg-red-500"
    if (usage > 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  const onlineAssets = assets.filter(asset => asset.status === "Online").length
  const totalAssets = assets.length

  return (
    <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Server className="h-5 w-5" />
          📊 Asset Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-black/30 rounded-lg border border-blue-500/20">
              <div className="text-lg font-bold text-blue-300">{totalAssets}</div>
              <div className="text-xs text-blue-400">Total Assets</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-lg border border-green-500/20">
              <div className="text-lg font-bold text-green-300">{onlineAssets}</div>
              <div className="text-xs text-green-400">Online</div>
            </div>
            <div className="text-center p-3 bg-black/30 rounded-lg border border-red-500/20">
              <div className="text-lg font-bold text-red-300">{totalAssets - onlineAssets}</div>
              <div className="text-xs text-red-400">Issues</div>
            </div>
          </div>

          {/* Asset List */}
          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div key={index} className="p-4 bg-black/30 rounded-lg border border-blue-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {asset.icon}
                    <div>
                      <h4 className="font-medium text-white">{asset.name}</h4>
                      <p className="text-xs text-gray-400">{asset.type} • {asset.lastSeen}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>

                {asset.status !== "Offline" && (
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-white">{asset.cpu}%</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(asset.cpu)}`}
                          style={{ width: `${asset.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">Memory</span>
                        <span className="text-white">{asset.memory}%</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(asset.memory)}`}
                          style={{ width: `${asset.memory}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">Disk</span>
                        <span className="text-white">{asset.disk}%</span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(asset.disk)}`}
                          style={{ width: `${asset.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}