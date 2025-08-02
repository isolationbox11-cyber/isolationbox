"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, AlertTriangle } from "lucide-react"

export function SecurityScore() {
  const score = 87
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 75) return "text-yellow-400"
    if (score >= 60) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  return (
    <Card className="border-green-500/30 bg-gradient-to-r from-black to-green-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Shield className="h-5 w-5" />
          🛡️ Security Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-gray-400">out of 100</div>
            <Badge 
              className={`mt-2 ${score >= 75 ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}
            >
              Grade: {getScoreGrade(score)}
            </Badge>
          </div>
          
          <Progress value={score} className="h-3" />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Firewall Status</span>
              <span className="text-green-400">✓ Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Antivirus</span>
              <span className="text-green-400">✓ Updated</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">2FA Enabled</span>
              <span className="text-orange-400">⚠ Partial</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Password Strength</span>
              <span className="text-green-400">✓ Strong</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="h-3 w-3" />
              +5 points from last week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}