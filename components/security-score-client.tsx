"use client"

// Client-side security score component with SWR
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner, ErrorAlert, CardLoading } from "@/components/ui/loading"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"
import useSWR from 'swr'
import { swrFetcher, handleApiError } from '@/lib/api'
import { DashboardMetrics, ApiResponse } from '@/types/api'

export function SecurityScoreClient() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<DashboardMetrics>>(
    '/api/dashboard',
    swrFetcher,
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
    }
  )

  const securityScore = data?.data?.securityScore

  if (isLoading) {
    return <CardLoading />
  }

  if (error) {
    return (
      <Card className="border-red-500/30 bg-gradient-to-r from-black to-red-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <span className="text-2xl">🛡️</span>
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorAlert error={handleApiError(error)} onRetry={() => mutate()} />
        </CardContent>
      </Card>
    )
  }

  if (!securityScore) {
    return <CardLoading />
  }

  const getTrendIcon = () => {
    switch (securityScore.trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />
      default: return <Minus className="h-4 w-4 text-orange-400" />
    }
  }

  const getTrendColor = () => {
    switch (securityScore.trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-orange-400'
    }
  }

  const scoreColor = securityScore.overall >= 80 ? 'text-green-400' : 
                    securityScore.overall >= 60 ? 'text-orange-400' : 'text-red-400'
  
  const scoreStatus = securityScore.overall >= 80 ? 'Strong Protection' : 
                     securityScore.overall >= 60 ? 'Moderate Protection' : 'Needs Improvement'

  return (
    <Card className="border-orange-800/30 bg-black/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            Security Score
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => mutate()}
            className="text-orange-400 hover:bg-orange-950/30"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription className="text-orange-200/70">
          Your digital protection strength • Live updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${scoreColor}`}>
              {securityScore.overall}/100
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge 
                variant={securityScore.overall >= 80 ? "default" : "destructive"} 
                className={securityScore.overall >= 80 ? "bg-green-600" : 
                          securityScore.overall >= 60 ? "bg-orange-600" : "bg-red-600"}
              >
                {scoreStatus}
              </Badge>
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm ${getTrendColor()}`}>
                  {securityScore.trend === 'up' ? 'Improving' : 
                   securityScore.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            <p className="text-xs text-orange-300/70">
              Last updated: {new Date(securityScore.lastUpdated).toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-orange-300">Security Categories</h4>
            {Object.entries(securityScore.categories).map(([category, score]) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-100/70 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`font-medium ${
                    score >= 80 ? 'text-green-400' : 
                    score >= 60 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full bg-orange-950/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-500' : 
                      score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-orange-900/30">
            <Button 
              variant="outline" 
              className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-950/30"
              onClick={() => console.log('View detailed report')}
            >
              View Detailed Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}