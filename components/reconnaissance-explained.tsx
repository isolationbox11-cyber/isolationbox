"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ReconnaissanceExplained() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Understanding Reconnaissance</CardTitle>
        <CardDescription>Learning about information gathering in cybersecurity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">What is Reconnaissance?</h4>
            <p className="text-sm text-muted-foreground">
              Reconnaissance is like detective work - gathering information about a target before taking action. 
              In cybersecurity, this means learning about systems, networks, and potential vulnerabilities.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Information Gathering</Badge>
            <Badge variant="secondary">OSINT</Badge>
            <Badge variant="secondary">Network Scanning</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}