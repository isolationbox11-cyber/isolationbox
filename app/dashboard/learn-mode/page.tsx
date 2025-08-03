import { EverydayExplanations } from "@/components/everyday-explanations"
import { ReconnaissanceExplained } from "@/components/reconnaissance-explained"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function LearnModePage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">📚 Learn Mode</h1>
      </div>

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">👨‍💼 Professional Security Education</CardTitle>
          <CardDescription className="text-blue-300/70">
            Expert knowledge for comprehensive digital protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Security professionals understand that continuous education is the foundation of effective cybersecurity. 
            Our Learn Mode provides comprehensive training materials and expert insights to help you build robust 
            defenses against evolving digital threats. Enhance your security knowledge and strengthen your organization's protection.
          </p>
        </CardContent>
      </Card>

      <EverydayExplanations />
      <ReconnaissanceExplained />
    </div>
  )
}