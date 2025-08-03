import { CyberSearchInterface } from "@/components/cyber-search-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CyberSearchPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">🔍 Cyber Search</h1>
      </div>

      <CyberSearchInterface />

      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400">🔒 Professional Security Tip</CardTitle>
          <CardDescription className="text-blue-300/70">
            Stay vigilant against phishing emails disguised as seasonal promotions!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">
            Cybercriminals frequently exploit seasonal events and holidays to craft convincing phishing campaigns. 
            Always verify the authenticity of promotional emails, contest announcements, or special offers before clicking links 
            or downloading attachments - they may contain malware disguised as legitimate communications!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}