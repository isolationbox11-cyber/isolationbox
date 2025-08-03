"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skull, Ghost, ExternalLink, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [yandexSDKStatus, setYandexSDKStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  useEffect(() => {
    // Initialize Yandex ID when component mounts
    const initYandexId = () => {
      if (typeof window !== 'undefined' && window.YaAuthSuggest) {
        window.YaAuthSuggest.init(
          {
            client_id: "your-yandex-client-id", // Replace with actual client ID
            response_type: "token",
            redirect_uri: `${window.location.origin}/dashboard`
          },
          "https://login.yandex.ru/info",
          {
            view: "button",
            parentId: "yandex-auth-button",
            buttonView: "main",
            buttonTheme: "dark",
            buttonSize: "m",
            buttonBorderRadius: "0"
          }
        )
        .then((result: any) => {
          console.log("Yandex ID initialized:", result)
          setYandexSDKStatus('loaded')
        })
        .catch((error: any) => {
          console.error("Yandex ID initialization failed:", error)
          setYandexSDKStatus('failed')
        })
      }
    }

    // Check if Yandex SDK is already loaded
    if (window.YaAuthSuggest) {
      initYandexId()
    } else {
      // Wait for SDK to load
      let attempts = 0
      const maxAttempts = 100 // 10 seconds
      const checkForYandex = setInterval(() => {
        attempts++
        if (window.YaAuthSuggest) {
          clearInterval(checkForYandex)
          initYandexId()
        } else if (attempts >= maxAttempts) {
          clearInterval(checkForYandex)
          setYandexSDKStatus('failed')
        }
      }, 100)
    }
  }, [])

  const handleYandexFallback = () => {
    // Fallback: redirect to Yandex OAuth manually
    const clientId = "your-yandex-client-id" // Replace with actual client ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/dashboard`)
    const yandexAuthUrl = `https://oauth.yandex.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=login:info`
    
    window.location.href = yandexAuthUrl
  }

  const handleTraditionalLogin = () => {
    // For demo purposes, redirect to dashboard
    // In a real app, this would handle username/password authentication
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-black text-orange-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center text-4xl animate-bounce">
            🎃
          </div>
          <h1 className="text-3xl font-bold text-orange-400">Salem Cyber Vault</h1>
          <p className="text-orange-300/70">Enter the digital realm</p>
        </div>

        {/* Login Card */}
        <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <Ghost className="h-5 w-5" />
              Spectral Authentication
            </CardTitle>
            <CardDescription className="text-orange-300/70">
              Choose your method to enter the haunted cyber vault
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Yandex ID OAuth Button */}
            <div className="space-y-2">
              <p className="text-sm text-orange-300 font-medium">🔮 Quick Conjuring with Yandex ID</p>
              <div 
                id="yandex-auth-button" 
                className="w-full min-h-[40px] flex items-center justify-center border border-orange-500/30 rounded-lg bg-black/50 hover:bg-orange-950/30 transition-colors"
              >
                {/* Yandex button will be rendered here by the SDK */}
                {yandexSDKStatus === 'loading' && (
                  <div className="text-orange-400 text-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Yandex ID...
                  </div>
                )}
                {yandexSDKStatus === 'failed' && (
                  <Button 
                    onClick={handleYandexFallback}
                    variant="outline"
                    className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-950/30"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Continue with Yandex ID
                  </Button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-orange-900/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-orange-500">or use ancient magic</span>
              </div>
            </div>

            {/* Traditional Login (Demo) */}
            <div className="space-y-3">
              <Button 
                onClick={handleTraditionalLogin}
                className="w-full bg-orange-600 hover:bg-orange-700 animate-pulse shadow-[0_0_10px_rgba(255,102,0,0.5)]"
              >
                <Skull className="h-4 w-4 mr-2" />
                Enter as Salem Witch (Demo)
              </Button>
            </div>

            {/* Warning Alert */}
            <Alert className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950/30">
              <ExternalLink className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-200/90">
                <span className="text-orange-400 font-bold">Security Notice:</span> Yandex ID integration provides secure OAuth authentication. 
                Your credentials are handled by Yandex&apos;s secure servers.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-orange-300/50">
          <p>🕸️ Protected by digital spells and OAuth enchantments 🕸️</p>
        </div>
      </div>
    </div>
  )
}

// Add TypeScript declaration for Yandex SDK
declare global {
  interface Window {
    YaAuthSuggest: any;
  }
}