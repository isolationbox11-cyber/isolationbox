"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function RealTimeMap() {
  const [threatCount, setThreatCount] = useState(42)

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount(prev => prev + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
      <CardHeader>
        <CardTitle className="text-orange-400">🗺️ Real-Time Threat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-black/50 rounded-lg border border-orange-500/20 p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-orange-300 font-mono">Active Threats</span>
              <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                {threatCount} detected
              </Badge>
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="text-orange-400">📍 Boston, MA - Port scan detected</div>
              <div className="text-red-400">📍 Salem, MA - Brute force attempt</div>
              <div className="text-yellow-400">📍 Cambridge, MA - Suspicious traffic</div>
              <div className="text-orange-400">📍 Worcester, MA - DDoS mitigation active</div>
            </div>
          </div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
          <div className="absolute top-12 left-16 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )
}