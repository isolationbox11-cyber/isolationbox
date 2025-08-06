"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  Shield, 
  Info,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react"
import { API_CONFIG, getAPIStatusSummary, type APIConfig } from "@/lib/api-config"

interface APIStatusDisplayProps {
  compact?: boolean;
  showSetupGuide?: boolean;
}

export function APIStatusDisplay({ compact = false, showSetupGuide = true }: APIStatusDisplayProps) {
  const [statusSummary, setStatusSummary] = useState(getAPIStatusSummary())
  const [showDetails, setShowDetails] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const refreshStatus = async () => {
    setRefreshing(true)
    // Simulate a brief refresh delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setStatusSummary(getAPIStatusSummary())
    setRefreshing(false)
  }

  const getStatusIcon = (isConfigured: boolean) => {
    return isConfigured ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    )
  }

  const getStatusBadge = (isConfigured: boolean) => {
    return isConfigured ? (
      <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
        Connected
      </Badge>
    ) : (
      <Badge variant="outline" className="text-red-400 border-red-400 bg-red-400/10">
        Not Configured
      </Badge>
    )
  }

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <Badge 
                  variant="outline" 
                  className={`${
                    statusSummary.hasMinimumRequired 
                      ? 'text-green-400 border-green-400 bg-green-400/10' 
                      : 'text-yellow-400 border-yellow-400 bg-yellow-400/10'
                  }`}
                >
                  {statusSummary.configured}/{statusSummary.total} APIs
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">API Status</div>
                <div>{statusSummary.configured} configured, {statusSummary.unconfigured} pending</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {statusSummary.hasMinimumRequired ? 'Ready to use' : 'Setup required'}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            API Integration Status
            <Badge 
              variant="outline" 
              className={`${
                statusSummary.hasMinimumRequired 
                  ? 'text-green-400 border-green-400 bg-green-400/10' 
                  : 'text-yellow-400 border-yellow-400 bg-yellow-400/10'
              }`}
            >
              {statusSummary.percentage}% Configured
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-slate-400 hover:text-white"
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStatus}
              disabled={refreshing}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{statusSummary.configured}</div>
            <div className="text-sm text-slate-400">Configured</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{statusSummary.unconfigured}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{statusSummary.total}</div>
            <div className="text-sm text-slate-400">Total APIs</div>
          </div>
        </div>

        {/* Warning if minimum APIs not configured */}
        {!statusSummary.hasMinimumRequired && (
          <Alert className="border-yellow-400/50 bg-yellow-400/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              <strong>Setup Required:</strong> Please configure at least Shodan and VirusTotal API keys to get started.
              Some features may not work without proper API configuration.
            </AlertDescription>
          </Alert>
        )}

        {/* Detailed API Status */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Detailed API Status
            </h4>
            <div className="grid gap-2">
              {Object.values(API_CONFIG).map((api) => (
                <div key={api.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(api.isConfigured)}
                    <div>
                      <div className="font-medium text-white">{api.name}</div>
                      <div className="text-sm text-slate-400">{api.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(api.isConfigured)}
                    {!api.isConfigured && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(api.signupUrl, '_blank')}
                              className="text-slate-400 hover:text-white"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">Get API key from {api.name}</div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Setup Guide */}
        {showSetupGuide && statusSummary.unconfigured > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Quick Setup Guide</h4>
            <div className="text-sm text-slate-400 space-y-2">
              <p>1. Copy <code className="bg-slate-800 px-1 rounded">.env.example</code> to <code className="bg-slate-800 px-1 rounded">.env.local</code></p>
              <p>2. Sign up for API keys from the unconfigured services above</p>
              <p>3. Add your API keys to <code className="bg-slate-800 px-1 rounded">.env.local</code></p>
              <p>4. Restart the development server</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}