import { VulnerabilityAnalysis } from "@/components/vulnerability-analysis"
import { AssetMonitoring } from "@/components/asset-monitoring"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ThreatsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">⚠️ Threats & Vulnerabilities</h1>
      </div>

      <Card className="border-sky-500/30 bg-gradient-to-r from-slate-950 to-blue-950 glass-morphism">
        <CardHeader>
          <CardTitle className="text-sky-400">🔍 Advanced Threat Detection</CardTitle>
          <CardDescription className="text-sky-300/70">
            AI-powered analysis of emerging cybersecurity threats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sky-50/70">
            Our advanced machine learning algorithms continuously monitor for emerging threats and vulnerabilities.
            The SalemCyberVault platform has detected a 24% increase in sophisticated attack patterns targeting
            enterprise networks. Our real-time protection systems have been enhanced to defend against these evolving threats.
          </p>
        </CardContent>
      </Card>

      <VulnerabilityAnalysis />
      <AssetMonitoring />
    </div>
  )
}