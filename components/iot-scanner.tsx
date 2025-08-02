"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, Router, Camera, Smartphone, Laptop, Tv } from "lucide-react"

export function IoTScanner() {
  const devices = [
    {
      name: "🎃 Smart Doorbell",
      type: "Security Camera",
      ip: "192.168.1.15",
      status: "Vulnerable",
      risk: "High",
      issue: "Default password detected",
      icon: <Camera className="h-4 w-4" />
    },
    {
      name: "🕷️ WiFi Router",
      type: "Network Device", 
      ip: "192.168.1.1",
      status: "Secure",
      risk: "Low",
      issue: "Firmware up to date",
      icon: <Router className="h-4 w-4" />
    },
    {
      name: "👻 Smart TV",
      type: "Entertainment",
      ip: "192.168.1.23",
      status: "Warning",
      risk: "Medium", 
      issue: "Outdated firmware",
      icon: <Tv className="h-4 w-4" />
    },
    {
      name: "🦇 Smart Speaker", 
      type: "Voice Assistant",
      ip: "192.168.1.18",
      status: "Secure",
      risk: "Low",
      issue: "No issues found",
      icon: <Wifi className="h-4 w-4" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vulnerable": return "bg-red-500/20 text-red-300 border-red-500/30"
      case "Warning": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Secure": return "bg-green-500/20 text-green-300 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-400"
      case "Medium": return "text-yellow-400"
      case "Low": return "text-green-400"
      default: return "text-gray-400"
    }
  }

  return (
    <Card className="border-purple-500/30 bg-gradient-to-r from-black to-purple-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <Wifi className="h-5 w-5" />
          🌐 IoT Device Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Devices Found: {devices.length}</span>
            <Button size="sm" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
              Scan Network
            </Button>
          </div>

          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="p-4 bg-black/30 rounded-lg border border-purple-500/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {device.icon}
                    <div>
                      <h4 className="font-medium text-white">{device.name}</h4>
                      <p className="text-xs text-gray-400">{device.type} • {device.ip}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {device.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{device.issue}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Risk:</span>
                    <span className={`text-xs font-medium ${getRiskColor(device.risk)}`}>
                      {device.risk}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              💡 Tip: IoT devices are often the weakest link in network security. Regular scans help identify vulnerabilities.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}