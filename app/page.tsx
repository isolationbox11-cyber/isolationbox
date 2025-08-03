import { CyberSearchInterface } from "@/components/cyber-search-interface"
import { HalloweenAlertsButton } from "@/components/halloween-alerts-button"
import { FloatingEyes } from "@/components/floating-eyes"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-sky-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-sky-400">SalemCyberVault</h1>
          <div className="flex items-center gap-4">
            <HalloweenAlertsButton />
          </div>
        </header>
        
        <FloatingEyes />
        
        <CyberSearchInterface />
      </div>
    </main>
  )
}