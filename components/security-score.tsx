"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, ErrorDisplay } from "@/components/ui/loading"
import { useDashboard } from "@/contexts/dashboard-context"
import { RefreshCw } from "lucide-react"

export function SecurityScore() {
  const { state, actions } = useDashboard()
  const { securityScore, loading, errors } = state

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Strong Protection", color: "bg-green-600" }
    if (score >= 60) return { text: "Fair Protection", color: "bg-yellow-600" }
    return { text: "Needs Improvement", color: "bg-red-600" }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-600"
      case "warning": return "bg-yellow-600"
      case "critical": return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return "✓"
      case "warning": return "!"
      case "critical": return "✗"
      default: return "?"
    }
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            Security Score
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.refreshSecurityScore}
            disabled={loading.securityScore}
            className="text-orange-300 hover:text-orange-200"
          >
            <RefreshCw className={`h-4 w-4 ${loading.securityScore ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Real-time digital protection assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading.securityScore && !securityScore ? (
          <LoadingSpinner text="Calculating security score..." className="py-8" />
        ) : errors.securityScore ? (
          <ErrorDisplay 
            error={errors.securityScore} 
            retry={actions.refreshSecurityScore}
            className="my-4"
          />
        ) : securityScore ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(securityScore.overall_score)}`}>
                {securityScore.overall_score}/100
              </div>
              <Badge variant="default" className={getScoreBadge(securityScore.overall_score).color}>
                {getScoreBadge(securityScore.overall_score).text}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-300">Security Factors</h4>
              {securityScore.factors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-orange-100/70">{factor.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="default"
                      className={getStatusColor(factor.status)}
                    >
                      {getStatusIcon(factor.status)}
                    </Badge>
                    <span className="text-xs text-orange-200/60">{factor.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
            
            {securityScore.last_updated && (
              <div className="text-xs text-orange-300/50 text-center">
                Last updated: {new Date(securityScore.last_updated).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-orange-300/70">
            Click refresh to load security score
          </div>
        )}
      </CardContent>
    </Card>
  )
}