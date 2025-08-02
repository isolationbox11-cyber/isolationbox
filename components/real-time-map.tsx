"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RealTimeMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Threat Map</CardTitle>
        <CardDescription>Live visualization of global cybersecurity threats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Interactive map will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )
}