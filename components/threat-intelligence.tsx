"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Activity } from "lucide-react"

export function ThreatIntelligence() {
  const threats = [
    {
      id: 1,
      type: "Malware",
      severity: "High",
      source: "Email",
      timestamp: "2 min ago"
    },
    {
      id: 2,
      type: "Phishing",
      severity: "Medium", 
      source: "Web",
      timestamp: "15 min ago"
    },
    {
      id: 3,
      type: "Suspicious Login",
      severity: "Low",
      source: "Network",
      timestamp: "1 hour ago"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Threat Intelligence
        </CardTitle>
        <CardDescription>Recent security alerts and threats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-4 w-4 ${
                  threat.severity === 'High' ? 'text-red-500' : 
                  threat.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`} />
                <div>
                  <p className="font-medium text-sm">{threat.type}</p>
                  <p className="text-xs text-muted-foreground">{threat.source} • {threat.timestamp}</p>
                </div>
              </div>
              <Badge variant={
                threat.severity === 'High' ? 'destructive' : 
                threat.severity === 'Medium' ? 'secondary' : 'default'
              }>
                {threat.severity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}