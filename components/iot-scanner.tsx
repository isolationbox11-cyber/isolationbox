"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi, Smartphone, Laptop, Router } from "lucide-react"

export function IoTScanner() {
  const devices = [
    {
      name: "Smart TV",
      ip: "192.168.1.105",
      type: "Entertainment",
      security: 75,
      status: "secure",
      icon: Laptop
    },
    {
      name: "WiFi Router",
      ip: "192.168.1.1", 
      type: "Network",
      security: 45,
      status: "vulnerable",
      icon: Router
    },
    {
      name: "Smart Phone",
      ip: "192.168.1.102",
      type: "Mobile",
      security: 90,
      status: "secure",
      icon: Smartphone
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          IoT Device Scanner
        </CardTitle>
        <CardDescription>Scan and monitor connected devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full">Scan Network</Button>
          
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <device.icon className="h-4 w-4" />
                    <div>
                      <p className="font-medium text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.ip}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === 'secure' ? 'default' : 'destructive'}>
                    {device.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Security Score</span>
                    <span>{device.security}%</span>
                  </div>
                  <Progress value={device.security} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}