"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Cpu, HardDrive, Wifi } from "lucide-react"

export function SystemStatus() {
  const statusItems = [
    {
      name: "CPU Usage",
      value: 45,
      icon: Cpu,
      status: "normal"
    },
    {
      name: "Memory",
      value: 72,
      icon: Server,
      status: "warning"
    },
    {
      name: "Disk Space",
      value: 88,
      icon: HardDrive,
      status: "critical"
    },
    {
      name: "Network",
      value: 32,
      icon: Wifi,
      status: "normal"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current system performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                  <Badge variant={
                    item.status === 'critical' ? 'destructive' :
                    item.status === 'warning' ? 'secondary' : 'default'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}