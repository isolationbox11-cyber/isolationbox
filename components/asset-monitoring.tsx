"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Globe, Shield } from "lucide-react"

export function AssetMonitoring() {
  const assets = [
    {
      name: "Web Server (nginx)",
      ip: "10.0.1.15",
      type: "Server",
      status: "online",
      health: 95,
      lastSeen: "1 min ago",
      icon: Server
    },
    {
      name: "Database Server (PostgreSQL)",
      ip: "10.0.1.20",
      type: "Database", 
      status: "online",
      health: 88,
      lastSeen: "2 min ago",
      icon: Database
    },
    {
      name: "Load Balancer",
      ip: "10.0.1.5",
      type: "Network",
      status: "warning",
      health: 72,
      lastSeen: "5 min ago",
      icon: Globe
    },
    {
      name: "Firewall",
      ip: "10.0.1.1",
      type: "Security",
      status: "online", 
      health: 100,
      lastSeen: "30 sec ago",
      icon: Shield
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'default'
      case 'warning': return 'secondary'
      case 'offline': return 'destructive'
      default: return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Asset Monitoring
        </CardTitle>
        <CardDescription>
          Real-time monitoring of critical infrastructure assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-500">{assets.filter(a => a.status === 'online').length}</div>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-500">{assets.filter(a => a.status === 'warning').length}</div>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
            <div>
              <div className="text-lg font-bold text-red-500">{assets.filter(a => a.status === 'offline').length}</div>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
            <div>
              <div className="text-lg font-bold">{assets.length}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          <div className="space-y-3">
            {assets.map((asset, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <asset.icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.ip} • {asset.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{asset.lastSeen}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Health Score</span>
                    <span>{asset.health}%</span>
                  </div>
                  <Progress value={asset.health} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}