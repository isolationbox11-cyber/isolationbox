import { VulnerabilityAnalysis } from "@/components/vulnerability-analysis"
import { AssetMonitoring } from "@/components/asset-monitoring"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ThreatsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">⚠️ Threats & Vulnerabilities</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🛡️ Advanced Threat Detection</CardTitle>
          <CardDescription className="text-blue-300/70">
            Comprehensive monitoring for emerging cyber threats and vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Our advanced threat intelligence systems continuously monitor for emerging vulnerabilities and active threats.
            Real-time analysis of global threat patterns shows a 24% increase in targeted attacks on critical infrastructure.
            Enhanced security measures and proactive monitoring are essential for maintaining robust defense postures.
          </p>
        </CardContent>
      </Card>

      <VulnerabilityAnalysis />
      <AssetMonitoring />
    </div>
  )
}