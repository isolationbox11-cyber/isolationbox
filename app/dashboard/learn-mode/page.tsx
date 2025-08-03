import { EverydayExplanations } from "@/components/everyday-explanations"
import { ReconnaissanceExplained } from "@/components/reconnaissance-explained"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LearnModePage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">📚 Learn Mode</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">👁️ Security Knowledge Center</CardTitle>
          <CardDescription className="text-blue-300/70">
            Essential cybersecurity education and awareness training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Knowledge is your most powerful defense against cyber threats. Our comprehensive learning center
            provides in-depth education on security concepts, threat detection, and best practices.
            Stay informed and vigilant to protect your digital assets effectively.
          </p>
        </CardContent>
      </Card>

      <EverydayExplanations />
      <ReconnaissanceExplained />
    </div>
  )
}