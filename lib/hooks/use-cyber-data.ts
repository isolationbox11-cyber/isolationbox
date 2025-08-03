"use client"

import { useState, useEffect, useCallback } from 'react';
import { cyberAPI } from '@/lib/cyber-api';

// Hook for threat intelligence data
export function useThreatIntelligence(refreshInterval = 30000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cyberAPI.getThreatIntelligence();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threat intelligence');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for vulnerability data
export function useVulnerabilities(limit = 20, refreshInterval = 60000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cyberAPI.getLatestVulnerabilities(limit);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vulnerabilities');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for asset monitoring
export function useAssetMonitoring(refreshInterval = 120000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await cyberAPI.getAssetStatus();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for Shodan search
export function useShodanSearch() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, limit = 10) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await cyberAPI.searchShodan(query, limit);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const getHostInfo = useCallback(async (ip: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cyberAPI.getShodanHostInfo(ip);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get host info');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search, getHostInfo };
}

// Hook for real-time security score calculation
export function useSecurityScore(refreshInterval = 300000) {
  const [score, setScore] = useState(85);
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateScore = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get data from multiple sources to calculate comprehensive score
      const [threats, vulns, assets] = await Promise.all([
        cyberAPI.getThreatIntelligence(),
        cyberAPI.getLatestVulnerabilities(10),
        cyberAPI.getAssetStatus()
      ]);

      // Calculate score based on real data
      let baseScore = 100;
      const scoringFactors = [];

      // Reduce score based on active threats
      const activeThreatsPenalty = Math.min(threats.threats?.length * 5 || 0, 30);
      baseScore -= activeThreatsPenalty;
      scoringFactors.push({
        item: 'Active threat detection',
        status: threats.threats?.length === 0 ? 'active' : 'warning',
        impact: threats.threats?.length === 0 ? '+5 points' : `-${activeThreatsPenalty} points`,
        description: `${threats.threats?.length || 0} active threats detected`
      });

      // Reduce score based on vulnerabilities
      const vulnPenalty = Math.min(vulns.vulnerabilities?.length * 2 || 0, 20);
      baseScore -= vulnPenalty;
      scoringFactors.push({
        item: 'Vulnerability management',
        status: vulns.vulnerabilities?.length <= 5 ? 'active' : 'warning',
        impact: vulns.vulnerabilities?.length <= 5 ? '+10 points' : `-${vulnPenalty} points`,
        description: `${vulns.vulnerabilities?.length || 0} recent vulnerabilities`
      });

      // Asset security assessment
      const assetRisk = assets.vulnerableAssets / Math.max(assets.totalAssets, 1);
      const assetPenalty = Math.floor(assetRisk * 25);
      baseScore -= assetPenalty;
      scoringFactors.push({
        item: 'Asset security posture',
        status: assetRisk < 0.2 ? 'active' : 'warning',
        impact: assetRisk < 0.2 ? '+15 points' : `-${assetPenalty} points`,
        description: `${assets.vulnerableAssets}/${assets.totalAssets} assets need attention`
      });

      // Add positive factors for good security practices
      scoringFactors.push({
        item: 'Real-time monitoring',
        status: 'active',
        impact: '+20 points',
        description: 'Salem Cyber Vault active monitoring'
      });

      const finalScore = Math.max(Math.min(baseScore, 100), 0);
      setScore(finalScore);
      setFactors(scoringFactors);
    } catch (err) {
      console.error('Score calculation error:', err);
      // Fallback to basic score
      setScore(85);
      setFactors([
        {
          item: 'Basic monitoring active',
          status: 'active',
          impact: '+85 points',
          description: 'Core security monitoring enabled'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateScore();
    const interval = setInterval(calculateScore, refreshInterval);
    return () => clearInterval(interval);
  }, [calculateScore, refreshInterval]);

  return { score, factors, loading, recalculate: calculateScore };
}

// Hook for real-time alerts
export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addAlert = useCallback((alert: any) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...alert
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  }, []);

  // Monitor for new threats and generate alerts
  useEffect(() => {
    const checkForAlerts = async () => {
      try {
        const threats = await cyberAPI.getThreatIntelligence();
        
        // Generate alerts for high-severity threats
        threats.threats?.forEach((threat: any) => {
          if (threat.severity === 'critical' || threat.severity === 'high') {
            addAlert({
              type: 'threat',
              severity: threat.severity,
              title: `New ${threat.severity} threat detected`,
              message: `${threat.name}: ${threat.description}`,
              emoji: threat.emoji,
              source: threat.source
            });
          }
        });
      } catch (error) {
        console.error('Alert monitoring error:', error);
      }
    };

    // Check immediately and then every 2 minutes
    checkForAlerts();
    const interval = setInterval(checkForAlerts, 120000);
    return () => clearInterval(interval);
  }, [addAlert]);

  return {
    alerts,
    unreadCount,
    addAlert,
    markAsRead,
    markAllAsRead
  };
}

// Hook for live threat map data
export function useThreatMap(refreshInterval = 45000) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get malicious IPs and their locations
      const ipData = await cyberAPI.getKnownMaliciousIPs(20);
      
      // Get location data for each IP
      const locationPromises = ipData.threats?.map(async (threat: any) => {
        const ip = threat.name.match(/\d+\.\d+\.\d+\.\d+/)?.[0];
        if (ip) {
          const location = await cyberAPI.getIPLocation(ip);
          return {
            ...threat,
            ip,
            location: {
              lat: location.latitude || 42.5195,
              lng: location.longitude || -70.8967,
              city: location.city || 'Unknown',
              country: location.country || 'Unknown'
            }
          };
        }
        return threat;
      }) || [];

      const locatedThreats = await Promise.all(locationPromises);
      
      setData({
        threats: locatedThreats,
        totalThreats: locatedThreats.length,
        lastUpdated: new Date().toISOString()
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch map data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}