import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import { useSecurityScore } from "@/lib/hooks"

export function SecurityScore() {
  const { score, factors, loading, recalculate } = useSecurityScore()

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 85) return "Excellent Security"
    if (score >= 70) return "Good Protection"
    if (score >= 50) return "Needs Improvement"
    return "Critical Issues"
  }

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <span className="text-2xl">🛡️</span>
              Security Score
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription className="text-orange-200/70">
              Real-time security posture assessment
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={recalculate}
            disabled={loading}
            className="text-orange-400 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}/100
            </div>
            <Badge 
              variant={score > 80 ? "default" : "destructive"} 
              className={score > 80 ? "bg-green-600" : score > 60 ? "bg-yellow-600" : "bg-red-600"}
            >
              {getScoreStatus(score)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-orange-300">Security Assessment Factors</h4>
            {factors.map((factor: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-orange-950/20">
                <div className="flex-1">
                  <span className="text-orange-100/70">{factor.item}</span>
                  {factor.description && (
                    <p className="text-xs text-orange-200/50 mt-1">{factor.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={factor.status === "active" ? "default" : "destructive"}
                    className={factor.status === "active" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {factor.status === "active" ? "✓" : "!"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {factor.impact.includes('+') ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-xs text-orange-200/60 min-w-[80px] text-right">
                      {factor.impact}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-orange-950/20 rounded-lg border border-orange-800/20">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-orange-400">📊</span>
              <span className="text-orange-300">Live Analysis:</span>
            </div>
            <p className="text-xs text-orange-200/60 mt-1">
              Score calculated from real-time threat intelligence, vulnerability assessments, and asset monitoring data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}