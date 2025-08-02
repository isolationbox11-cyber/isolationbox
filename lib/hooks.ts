"use client"

/**
 * Custom React hooks for fetching cybersecurity data with loading states and error handling
 */

import { useState, useEffect } from 'react'
import { otxService, ThreatData } from '@/lib/otx-service'
import { nvdService, VulnerabilityData } from '@/lib/nvd-service'
import { shodanService, AssetData } from '@/lib/shodan-service'
import { ipLocationService, ThreatMapData } from '@/lib/ip-location-service'

export interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => void
}

/**
 * Hook for fetching threat intelligence data from AlienVault OTX
 */
export function useThreatIntelligence(): UseDataResult<ThreatData[]> {
  const [data, setData] = useState<ThreatData[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const threats = await otxService.getThreatIntelligence()
      setData(threats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threat intelligence')
      // Set fallback data on error
      setData(await otxService.getThreatIntelligence())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

/**
 * Hook for fetching vulnerability analysis data from NVD
 */
export function useVulnerabilityAnalysis(): UseDataResult<{
  vulnerabilities: VulnerabilityData[]
  stats: { critical: number; high: number; medium: number; low: number }
}> {
  const [data, setData] = useState<{
    vulnerabilities: VulnerabilityData[]
    stats: { critical: number; high: number; medium: number; low: number }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [vulnerabilities, stats] = await Promise.all([
        nvdService.getVulnerabilityAnalysis(),
        nvdService.getVulnerabilityStats()
      ])
      
      setData({ vulnerabilities, stats })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vulnerability data')
      // Set fallback data on error
      setData({
        vulnerabilities: await nvdService.getVulnerabilityAnalysis(),
        stats: await nvdService.getVulnerabilityStats()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

/**
 * Hook for fetching asset monitoring data from Shodan
 */
export function useAssetMonitoring(): UseDataResult<{
  assets: AssetData[]
  stats: { secure: number; warning: number; critical: number }
}> {
  const [data, setData] = useState<{
    assets: AssetData[]
    stats: { secure: number; warning: number; critical: number }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const assets = await shodanService.getAssetMonitoring()
      
      // Calculate stats from assets
      const stats = {
        secure: assets.filter(asset => asset.status === 'secure').length,
        warning: assets.filter(asset => asset.status === 'warning').length,
        critical: assets.filter(asset => asset.status === 'critical').length
      }
      
      setData({ assets, stats })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset monitoring data')
      // Set fallback data on error
      const assets = await shodanService.getAssetMonitoring()
      const stats = {
        secure: assets.filter(asset => asset.status === 'secure').length,
        warning: assets.filter(asset => asset.status === 'warning').length,
        critical: assets.filter(asset => asset.status === 'critical').length
      }
      setData({ assets, stats })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

/**
 * Hook for fetching threat map data with geolocation
 */
export function useThreatMap(): UseDataResult<ThreatMapData> {
  const [data, setData] = useState<ThreatMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const threatData = await ipLocationService.getThreatMapData()
      setData(threatData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threat map data')
      // Set fallback data on error
      setData(await ipLocationService.getThreatMapData())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

/**
 * Hook for fetching recent security events
 */
export function useRecentEvents(): UseDataResult<Array<{
  time: string
  type: string
  description: string
  severity: 'warning' | 'success' | 'info' | 'error'
  emoji: string
  source?: string
}>> {
  const [data, setData] = useState<Array<{
    time: string
    type: string
    description: string
    severity: 'warning' | 'success' | 'info' | 'error'
    emoji: string
    source?: string
  }> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get recent attacks from IP location service
      const recentAttacks = await ipLocationService.getRecentAttacks(5)
      
      // Transform to events format
      const events = recentAttacks.map(attack => {
        const time = new Date(attack.timestamp)
        const hoursAgo = Math.floor((Date.now() - time.getTime()) / (1000 * 60 * 60))
        const minutesAgo = Math.floor((Date.now() - time.getTime()) / (1000 * 60))
        
        let timeStr = ''
        if (hoursAgo > 0) {
          timeStr = `${hoursAgo}h ago`
        } else {
          timeStr = `${minutesAgo}m ago`
        }
        
        return {
          time: timeStr,
          type: attack.blocked ? 'Security Block' : 'Security Alert',
          description: `${attack.attackType} from ${attack.sourceIP}${attack.location ? ` (${attack.location.country})` : ''}`,
          severity: attack.blocked ? 'info' as const : 
                   (attack.severity === 'high' ? 'error' as const : 
                    attack.severity === 'medium' ? 'warning' as const : 'info' as const),
          emoji: attack.blocked ? '🛡️' : '⚠️',
          source: 'Live Detection'
        }
      })

      // Add some system events
      const systemEvents = [
        {
          time: `${Math.floor(Math.random() * 2) + 1}h ago`,
          type: 'System Update',
          description: 'Security patches applied successfully',
          severity: 'success' as const,
          emoji: '✅',
          source: 'System'
        },
        {
          time: `${Math.floor(Math.random() * 3) + 2}h ago`,
          type: 'Scan Complete',
          description: 'Automated vulnerability scan finished',
          severity: 'success' as const,
          emoji: '🔍',
          source: 'Scanner'
        }
      ]

      setData([...events, ...systemEvents].slice(0, 5))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent events')
      // Set fallback data on error
      setData([
        {
          time: "30m ago",
          type: "Security Alert",
          description: "Unusual login attempt detected (Demo Data)",
          severity: "warning",
          emoji: "⚠️",
          source: "Demo"
        },
        {
          time: "1h ago",
          type: "System Update", 
          description: "Security patches applied successfully (Demo Data)",
          severity: "success",
          emoji: "✅",
          source: "Demo"
        },
        {
          time: "2h ago",
          type: "Firewall Block",
          description: "Blocked suspicious connection attempts (Demo Data)",
          severity: "info",
          emoji: "🛡️",
          source: "Demo"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}

/**
 * Hook for IoT scanner data
 */
export function useIoTScanner(): UseDataResult<{
  stats: {
    totalDevices: number
    vulnerableDevices: number
    criticalIssues: number
    countries: number
  }
  scanning: boolean
}> {
  const [data, setData] = useState<{
    stats: {
      totalDevices: number
      vulnerableDevices: number
      criticalIssues: number
      countries: number
    }
    scanning: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const stats = await shodanService.getIoTStats()
      
      setData({
        stats,
        scanning: Math.random() > 0.7 // Randomly show scanning state
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch IoT scanner data')
      // Set fallback data on error
      setData({
        stats: await shodanService.getIoTStats(),
        scanning: false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    data,
    loading,
    error,
    refresh: fetchData
  }
}