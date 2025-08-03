"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { AlertTriangle, Eye, Shield, Lock } from "lucide-react"

// Security Eye icon
const SecurityEyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6Z" fill="currentColor" opacity="0.3" />
    <circle cx="12" cy="11.5" r="3.5" fill="currentColor" />
    <circle cx="12" cy="11.5" r="1.5" fill="white" />
  </svg>
)

export default function SecurityScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [foundVulnerabilities, setFoundVulnerabilities] = useState<string[]>([])
  
  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanComplete(false)
    setFoundVulnerabilities([])
    
    const securityIssues = [
      "Weak Authentication Protocol",
      "Unpatched System Vulnerability",
      "Insecure Network Configuration",
      "Exposed Admin Interface",
      "Outdated Encryption Standard",
      "Unauthorized Service Running",
      "Unmonitored System Access",
      "Misconfigured Firewall Rule",
      "Stale Security Certificate"
    ]
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 10;
        
        // Add a security issue at certain progress points
        if (newProgress === 30 || newProgress === 60 || newProgress === 90) {
          const randomIssue = securityIssues[Math.floor(Math.random() * securityIssues.length)]
          setFoundVulnerabilities(prev => [...prev, randomIssue])
        }
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setScanComplete(true)
          return 100
        }
        return newProgress
      })
    }, 600)
  }
  
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">👁️ Security Deep Scan</h1>
      </div>
      
      <Card className="border-blue-500/30 bg-gradient-to-r from-black to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="animate-pulse text-2xl">👁️</div> Advanced Security Scanner
          </CardTitle>
          <CardDescription className="text-blue-300/70">
            Comprehensive vulnerability assessment and security threat detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/70">
            Our advanced security scanner employs state-of-the-art threat detection algorithms
            to identify vulnerabilities, misconfigurations, and potential security risks across
            your digital infrastructure. Continuous monitoring ensures maximum protection.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Button 
              onClick={startScan} 
              disabled={isScanning} 
              className="bg-blue-600 hover:bg-blue-700 animate-glow"
            >
              {isScanning ? "👁️ Analyzing systems..." : "👁️ Start Security Scan"}
            </Button>
            {isScanning && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-blue-300">Scanning for security vulnerabilities...</span>
                  <span className="text-sm text-blue-300">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" 
                  style={{
                    background: "rgba(59, 130, 246, 0.2)",
                    "--tw-progress-bar-color": "rgba(59, 130, 246, 0.8)"
                  } as React.CSSProperties} />
              </div>
            )}
          </div>
          
          {foundVulnerabilities.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-blue-300">🔍 Security Issues Detected</h3>
              <div className="space-y-2">
                {foundVulnerabilities.map((vulnerability, index) => (
                  <div key={index} className="p-3 bg-black/50 rounded-lg border border-blue-900 flex items-start gap-3 animate-pulse">
                    <div className="text-xl">
                      {index % 3 === 0 ? "🔒" : index % 3 === 1 ? "🛡️" : "⚠️"}
                    </div>
                    <div>
                      <div className="font-medium text-blue-300">{vulnerability}</div>
                      <div className="text-xs text-blue-300/70">Detected {Math.floor(Math.random() * 30) + 1} minutes ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scanComplete && (
            <div className="mt-6 p-4 bg-black/50 rounded-lg border border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-blue-300">Scan Complete - Security Analysis</h3>
              </div>
              <p className="text-blue-300/70 mb-4">
                Security scan detected {foundVulnerabilities.length} potential issues that require attention. 
                These vulnerabilities could be exploited by attackers and should be addressed according to 
                your organization's security policies and risk tolerance.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Generate Security Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" /> Surveillance Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Continuous monitoring and analysis of system activities, network traffic, and user behavior 
              to detect anomalies and potential security threats in real-time.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" /> Defense Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Multi-layered security defenses including firewalls, intrusion detection systems, 
              and advanced threat protection to safeguard your digital infrastructure.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" /> Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Robust authentication and authorization mechanisms ensuring only verified users 
              can access sensitive systems and data according to principle of least privilege.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}