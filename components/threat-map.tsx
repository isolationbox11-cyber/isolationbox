"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ThreatMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Threat Intelligence</CardTitle>
        <CardDescription>Current threat landscape overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Threat map visualization</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="destructive">High Risk</Badge>
            <Badge variant="secondary">Medium Risk</Badge>
            <Badge variant="default">Low Risk</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}