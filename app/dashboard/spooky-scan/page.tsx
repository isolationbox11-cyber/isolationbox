"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { AlertTriangle, Shield, Search } from "lucide-react"

// Custom Security icon
const SecurityScanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function SecurityScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanComplete, setScanComplete] = useState(false)
  const [foundIssues, setFoundIssues] = useState<string[]>([])
  
  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanComplete(false)
    setFoundIssues([])
    
    const securityIssues = [
      "Outdated Software Component",
      "Inactive User Account",
      "Orphaned Process",
      "Misconfigured Service",
      "Unused Network Port",
      "Stale Registry Entry",
      "Legacy Browser Cache",
      "Temporary File Accumulation",
      "Deprecated Protocol Usage"
    ]
    
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 10;
        
        // Add a security issue at certain progress points
        if (newProgress === 30 || newProgress === 60 || newProgress === 90) {
          const randomIssue = securityIssues[Math.floor(Math.random() * securityIssues.length)]
          setFoundIssues(prev => [...prev, randomIssue])
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
        <h1 className="text-3xl font-bold tracking-tight">🔍 Security Scan</h1>
      </div>
      
      <Card className="border-blue-500/30 bg-gradient-to-r from-slate-950 to-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <div className="animate-pulse text-2xl">🛡️</div> Advanced Security Scanner
          </CardTitle>
          <CardDescription className="text-blue-300/70">
            Comprehensive system analysis for security vulnerabilities and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/70">
            Our advanced security scanner performs deep system analysis to identify potential vulnerabilities,
            orphaned processes, and configuration issues that could impact your system's security posture.
            Run regular scans to maintain optimal security and performance.
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <Button 
              onClick={startScan} 
              disabled={isScanning} 
              className="bg-blue-600 hover:bg-blue-700 animate-glow"
            >
              {isScanning ? "🔍 Analyzing system..." : "🔍 Start Security Scan"}
            </Button>
            {isScanning && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-blue-300">Scanning for security issues...</span>
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
          
          {foundIssues.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-blue-300">🔍 Security Issues Detected</h3>
              <div className="space-y-2">
                {foundIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-slate-900/50 rounded-lg border border-blue-900 flex items-start gap-3 animate-pulse">
                    <div className="text-xl">
                      {index % 3 === 0 ? "⚠️" : index % 3 === 1 ? "🔧" : "🔒"}
                    </div>
                    <div>
                      <div className="font-medium text-blue-300">{issue}</div>
                      <div className="text-xs text-blue-300/70">Detected {Math.floor(Math.random() * 30) + 1} days ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {scanComplete && (
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-blue-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium text-blue-300">Scan Complete - Security Analysis</h3>
              </div>
              <p className="text-blue-300/70 mb-4">
                Security scan completed. Found {foundIssues.length} potential issues that could impact 
                system security or performance. These items should be reviewed and addressed according to 
                your organization's security policies.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Generate Remediation Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" /> System Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comprehensive examination of system files, processes, and configurations to identify 
              potential security vulnerabilities and optimization opportunities.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" /> Security Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Evaluation of security controls, access permissions, and system hardening measures 
              to ensure compliance with security best practices and organizational policies.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="text-blue-500 text-xl">🔧</div> Remediation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automated and guided remediation options for identified issues, including patch 
              management, configuration updates, and security policy enforcement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}