// Dashboard metrics API route
import { NextRequest, NextResponse } from 'next/server';
import { DashboardMetrics, ApiResponse } from '@/types/api';

// Generate mock dashboard data
function generateDashboardMetrics(): DashboardMetrics {
  return {
    securityScore: {
      overall: Math.floor(Math.random() * 30) + 70, // 70-100
      categories: {
        infrastructure: Math.floor(Math.random() * 30) + 70,
        applications: Math.floor(Math.random() * 30) + 70,
        network: Math.floor(Math.random() * 30) + 70,
        compliance: Math.floor(Math.random() * 30) + 70,
      },
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      lastUpdated: new Date().toISOString(),
    },
    alerts: [
      {
        id: 'alert_1',
        title: 'Suspicious login activity detected',
        severity: 'high',
        status: 'active',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Multiple failed login attempts from unusual location',
        affectedSystems: ['Web Server 1', 'Database Server'],
        actionRequired: true,
      },
      {
        id: 'alert_2',
        title: 'Vulnerability scan completed',
        severity: 'medium',
        status: 'investigating',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Weekly vulnerability scan found 3 medium-risk issues',
        affectedSystems: ['Application Server'],
        actionRequired: false,
      },
    ],
    threats: [
      {
        id: 'threat_1',
        title: 'New IoT Botnet Campaign',
        severity: 'high',
        category: 'Malware',
        description: 'Large-scale botnet targeting IoT devices with weak credentials',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        source: 'ThreatShare Intelligence',
        indicators: ['192.168.1.100/24', 'malware.example.com'],
        affected_systems: ['IoT Devices'],
        mitigation: 'Update device credentials and firmware',
      },
    ],
    recentEvents: [
      {
        id: 'event_1',
        type: 'login',
        title: 'Admin login',
        description: 'Administrator logged in from authorized IP',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: 'Authentication System',
        user: 'admin@salemcyber.vault',
      },
      {
        id: 'event_2',
        type: 'scan',
        title: 'Network scan completed',
        description: 'Scheduled network security scan finished successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'low',
        source: 'Security Scanner',
      },
    ],
    systemStatus: [
      {
        component: 'Web Server',
        status: 'operational',
        uptime: 99.9,
        responseTime: 145,
        lastChecked: new Date().toISOString(),
      },
      {
        component: 'Database',
        status: 'operational',
        uptime: 99.8,
        responseTime: 23,
        lastChecked: new Date().toISOString(),
      },
      {
        component: 'API Gateway',
        status: 'degraded',
        uptime: 98.2,
        responseTime: 890,
        lastChecked: new Date().toISOString(),
      },
    ],
    vulnerabilities: [
      {
        id: 'vuln_1',
        cve: 'CVE-2023-44487',
        title: 'HTTP/2 Rapid Reset Attack',
        severity: 'critical',
        cvss: 9.8,
        description: 'DDoS vulnerability affecting HTTP/2 implementations',
        affected: 'Web servers, Load balancers',
        status: 'patch-available',
        publishedDate: '2023-10-10T00:00:00Z',
        lastModified: new Date().toISOString(),
      },
    ],
    iotDevices: [
      {
        id: 'iot_1',
        name: 'Security Camera #1',
        type: 'IP Camera',
        ip: '192.168.1.150',
        mac: '00:11:22:33:44:55',
        vendor: 'Hikvision',
        model: 'DS-2CD2085FWD-I',
        firmware: '5.6.0',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        riskLevel: 'medium',
        vulnerabilities: 2,
        isSecure: false,
      },
    ],
  };
}

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const metrics = generateDashboardMetrics();
    
    const response: ApiResponse<DashboardMetrics> = {
      success: true,
      data: metrics,
      message: 'Dashboard metrics retrieved successfully',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
      },
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'DASHBOARD_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}