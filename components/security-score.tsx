"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SecurityScore() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Score</CardTitle>
        <CardDescription>Your overall security posture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">85</div>
            <p className="text-sm text-muted-foreground">Security Score</p>
          </div>
          <Progress value={85} className="w-full" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Firewall Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Antivirus</span>
              <Badge variant="default">Protected</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Updates</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}