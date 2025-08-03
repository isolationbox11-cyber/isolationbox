import { CyberSearchInterface } from "@/components/cyber-search-interface"
import { SecurityAlertsButton } from "@/components/security-alerts-button"
import { FloatingEyes } from "@/components/floating-eyes"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-400">👁️ Cyber Security Vault</h1>
          <div className="flex items-center gap-4">
            <SecurityAlertsButton />
          </div>
        </header>
        
        <FloatingEyes />
        
        <CyberSearchInterface />
      </div>
    </main>
  )
}