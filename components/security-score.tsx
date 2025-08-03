import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SecurityScore() {
  // For now, return the original static version to avoid SSR issues
  // This will be enhanced with client-side data fetching
  const score = 85
  const improvements = [
    { item: "Multi-factor authentication", status: "active", impact: "+15 points" },
    { item: "Regular security updates", status: "active", impact: "+10 points" },
    { item: "Password policy compliance", status: "warning", impact: "+5 points needed" },
    { item: "Backup encryption", status: "active", impact: "+8 points" }
  ]

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-300">
          <span className="text-2xl">🛡️</span>
          Security Score
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Your digital protection strength
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">{score}/100</div>
            <Badge variant={score > 80 ? "default" : "destructive"} className="bg-orange-600">
              {score > 80 ? "Strong Protection" : "Needs Improvement"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-orange-300">Security Factors</h4>
            {improvements.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-orange-100/70">{item.item}</span>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={item.status === "active" ? "default" : "destructive"}
                    className={item.status === "active" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {item.status === "active" ? "✓" : "!"}
                  </Badge>
                  <span className="text-xs text-orange-200/60">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}