import { VulnerabilityAnalysis } from "@/components/vulnerability-analysis"
import { AssetMonitoring } from "@/components/asset-monitoring"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ThreatsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">⚠️ Threats & Vulnerabilities</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🤖 Automated Threat Detection</CardTitle>
          <CardDescription className="text-blue-300/70">
            Advanced monitoring for dormant and emerging security threats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our automated threat detection systems continuously monitor for dormant malware that may reactivate during periods of increased network activity.
            Recent intelligence indicates a 24% increase in previously dormant botnets becoming active across monitored networks. 
            Our proactive security measures help identify and neutralize these threats before they can cause damage.
          </p>
        </CardContent>
      </Card>

      <VulnerabilityAnalysis />
      <AssetMonitoring />
    </div>
  )
}