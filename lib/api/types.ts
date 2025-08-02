// Types for API responses
export interface ShodanDevice {
  ip_str: string;
  port: number;
  org: string;
  hostnames: string[];
  location: {
    country_name: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  product?: string;
  version?: string;
  timestamp: string;
}

export interface ShodanSearchResult {
  matches: ShodanDevice[];
  total: number;
}

export interface VirusTotalReport {
  id: string;
  attributes: {
    stats: {
      malicious: number;
      suspicious: number;
      undetected: number;
      harmless: number;
    };
    last_analysis_date: number;
    last_modification_date: number;
  };
}

export interface ThreatAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
  indicators?: string[];
}

export interface WhoisRecord {
  domain: string;
  registrar: string;
  creation_date: string;
  expiration_date: string;
  nameservers: string[];
  status: string[];
}

export interface SecurityScore {
  overall_score: number;
  factors: {
    name: string;
    score: number;
    status: 'good' | 'warning' | 'critical';
    description: string;
  }[];
  last_updated: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}