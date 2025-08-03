import { EverydayExplanations } from "@/components/everyday-explanations"
import { ReconnaissanceExplained } from "@/components/reconnaissance-explained"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LearnModePage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">📚 Learn Mode</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-900 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">👁️ Security Eye's Vision</CardTitle>
          <CardDescription className="text-blue-300/70">
            Advanced surveillance wisdom for modern digital protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Just as the all-seeing eye monitors all activity within its field of vision, today's security experts
            understand that knowledge is your strongest shield against digital threats. Explore our Learn Mode
            to arm yourself with the surveillance wisdom needed to detect and prevent cyber attacks.
          </p>
        </CardContent>
      </Card>

      <EverydayExplanations />
      <ReconnaissanceExplained />
    </div>
  )
}