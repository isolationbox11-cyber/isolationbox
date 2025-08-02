"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell } from "lucide-react"

export function AlertsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Security Alerts
        </CardTitle>
        <CardDescription>Current alerts requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              3 high-priority security alerts detected. Click to review.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">3</div>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">7</div>
              <p className="text-xs text-muted-foreground">Warning</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">12</div>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}