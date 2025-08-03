// API response types for TypeScript safety and autocompletion

export interface CyberSearchResult {
  id: string;
  ip: string;
  port: number;
  hostname?: string;
  country: string;
  city?: string;
  service: string;
  product?: string;
  version?: string;
  os?: string;
  lastSeen: string;
  organization?: string;
  latitude?: number;
  longitude?: number;
  vulnerabilities?: string[];
  banner?: string;
}

export interface CyberSearchResponse {
  results: CyberSearchResult[];
  total: number;
  query: string;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface ThreatIntelligence {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  timestamp: string;
  source: string;
  indicators: string[];
  affected_systems?: string[];
  mitigation?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved';
  timestamp: string;
  description: string;
  affectedSystems: string[];
  actionRequired: boolean;
}

export interface VulnerabilityData {
  id: string;
  cve: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvss: number;
  description: string;
  affected: string;
  status: 'patched' | 'patch-available' | 'investigating' | 'no-fix';
  publishedDate: string;
  lastModified: string;
}

export interface SecurityScore {
  overall: number;
  categories: {
    infrastructure: number;
    applications: number;
    network: number;
    compliance: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface RecentEvent {
  id: string;
  type: 'login' | 'alert' | 'scan' | 'update' | 'breach';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  user?: string;
}

export interface SystemStatus {
  component: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  ip: string;
  mac: string;
  vendor: string;
  model?: string;
  firmware?: string;
  lastSeen: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: number;
  isSecure: boolean;
}

// API Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Search filters and parameters
export interface CyberSearchFilters {
  query: string;
  country?: string;
  port?: string;
  service?: string;
  organization?: string;
  page?: number;
  perPage?: number;
}

export interface DashboardMetrics {
  securityScore: SecurityScore;
  alerts: SecurityAlert[];
  threats: ThreatIntelligence[];
  recentEvents: RecentEvent[];
  systemStatus: SystemStatus[];
  vulnerabilities: VulnerabilityData[];
  iotDevices: IoTDevice[];
}