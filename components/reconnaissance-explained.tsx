"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Eye, Shield } from "lucide-react"

export function ReconnaissanceExplained() {
  return (
    <div className="space-y-6">
      <Card className="border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-400">
            <Search className="h-5 w-5" />
            🔍 What is Reconnaissance?
          </CardTitle>
          <CardDescription className="text-orange-300/70">
            Understanding the first phase of cyber attacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 mb-4">
            Reconnaissance is like a burglar scoping out a house before breaking in. 
            Hackers gather information about their target to find the best way to attack.
          </p>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <Card className="bg-orange-950/30 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-orange-300">👀 Passive Reconnaissance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70">
                    Like looking through public records. Hackers gather info without directly interacting with the target.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-950/30 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-red-300">🎯 Active Reconnaissance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70">
                    Like knocking on doors to see who's home. Direct interaction that can be detected.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <Shield className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-300">
          <strong>Fun Halloween Fact:</strong> Just like how trick-or-treaters scout neighborhoods for the best candy houses, 
          cyber attackers scout networks for the weakest security!
        </AlertDescription>
      </Alert>
    </div>
  )
}