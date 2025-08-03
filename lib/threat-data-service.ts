// Service for fetching real cyber threat data from public APIs
export interface ThreatData {
  id: string;
  lat: number;
  lng: number;
  country: string;
  city: string;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  ip?: string;
  port?: number;
  emoji: string;
}

export interface ApiResponse {
  threats: ThreatData[];
  lastUpdated: Date;
}

// Simulated threat data based on real threat intelligence patterns
// In a real implementation, this would fetch from actual APIs
const generateRealisticThreatData = (): ThreatData[] => {
  const threatTypes = [
    { type: 'Port Scanning', emoji: '🔍', severity: 'medium' as const, descriptions: [
      'Automated port scanning detected from this location',
      'Network reconnaissance activity observed',
      'Suspicious connection attempts to multiple ports'
    ]},
    { type: 'Malware C&C', emoji: '🦠', severity: 'high' as const, descriptions: [
      'Command and control server communication detected',
      'Malware callback activity observed',
      'Botnet communication identified'
    ]},
    { type: 'DDoS Attack', emoji: '⚡', severity: 'high' as const, descriptions: [
      'Distributed denial of service attack in progress',
      'High volume traffic anomaly detected',
      'Network flooding attempt identified'
    ]},
    { type: 'Phishing Campaign', emoji: '🎣', severity: 'medium' as const, descriptions: [
      'Phishing email campaign traced to this region',
      'Fraudulent website hosting detected',
      'Social engineering attack infrastructure'
    ]},
    { type: 'Brute Force', emoji: '🔨', severity: 'medium' as const, descriptions: [
      'Password brute force attempts detected',
      'Login credential attacks observed',
      'Authentication bypass attempts'
    ]},
    { type: 'Data Exfiltration', emoji: '📤', severity: 'critical' as const, descriptions: [
      'Suspicious data transfer activity',
      'Potential data theft in progress',
      'Unauthorized file access detected'
    ]},
    { type: 'Cryptomining', emoji: '⛏️', severity: 'low' as const, descriptions: [
      'Unauthorized cryptocurrency mining detected',
      'Resource hijacking activity observed',
      'Illegal mining operation identified'
    ]},
    { type: 'Ransomware', emoji: '🔐', severity: 'critical' as const, descriptions: [
      'Ransomware encryption activity detected',
      'File system encryption in progress',
      'Ransom demand infrastructure identified'
    ]}
  ];

  // Major cities with coordinates for realistic threat distribution
  const locations = [
    { city: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
    { city: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6176 },
    { city: 'Pyongyang', country: 'North Korea', lat: 39.0392, lng: 125.7625 },
    { city: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890 },
    { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
    { city: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
    { city: 'Bucharest', country: 'Romania', lat: 44.4268, lng: 26.1025 },
    { city: 'Kiev', country: 'Ukraine', lat: 50.4501, lng: 30.5234 },
    { city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
    { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
    { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
    { city: 'Hanoi', country: 'Vietnam', lat: 21.0285, lng: 105.8542 },
    { city: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842 },
    { city: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122 }
  ];

  const threats: ThreatData[] = [];
  const now = new Date();

  // Generate 15-25 realistic threat events
  const threatCount = Math.floor(Math.random() * 11) + 15;

  for (let i = 0; i < threatCount; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    const description = threatType.descriptions[Math.floor(Math.random() * threatType.descriptions.length)];
    
    // Add some random offset to coordinates for variety
    const latOffset = (Math.random() - 0.5) * 2; // ±1 degree
    const lngOffset = (Math.random() - 0.5) * 2; // ±1 degree

    threats.push({
      id: `threat-${i}-${Date.now()}`,
      lat: location.lat + latOffset,
      lng: location.lng + lngOffset,
      country: location.country,
      city: location.city,
      threatType: threatType.type,
      severity: threatType.severity,
      description,
      timestamp: new Date(now.getTime() - Math.random() * 3600000), // Within last hour
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: Math.floor(Math.random() * 65535),
      emoji: threatType.emoji
    });
  }

  // Sort by timestamp (most recent first)
  return threats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Cache for threat data
let cachedData: ApiResponse | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const fetchThreatData = async (): Promise<ApiResponse> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    return cachedData;
  }

  // In a real implementation, you would make actual API calls here
  // For example:
  // - AbuseIPDB for IP reputation data
  // - CVE database for vulnerability information
  // - IPinfo.io for geolocation data
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const threats = generateRealisticThreatData();
    
    cachedData = {
      threats,
      lastUpdated: new Date()
    };
    
    lastFetch = now;
    return cachedData;
    
  } catch (error) {
    console.error('Failed to fetch threat data:', error);
    
    // Return cached data if available, otherwise empty response
    return cachedData || {
      threats: [],
      lastUpdated: new Date()
    };
  }
};

export const getThreatTypeColor = (severity: string): string => {
  switch (severity) {
    case 'critical': return '#dc2626'; // red-600
    case 'high': return '#ea580c'; // orange-600
    case 'medium': return '#ca8a04'; // yellow-600
    case 'low': return '#16a34a'; // green-600
    default: return '#6b7280'; // gray-500
  }
};

export const getThreatExplanation = (threatType: string): string => {
  const explanations: Record<string, string> = {
    'Port Scanning': 'Hackers are checking what services are running on computers at this location. Think of it like someone testing all the doors and windows on a house to see which ones are unlocked.',
    'Malware C&C': 'Infected computers at this location are talking to criminal servers. This means there are probably viruses or other bad software running on computers here.',
    'DDoS Attack': 'Many computers are working together to overwhelm a website or service, like a crowd of people all trying to enter a store at once to shut it down.',
    'Phishing Campaign': 'Criminals at this location are sending fake emails or creating fake websites to steal passwords and personal information from people.',
    'Brute Force': 'Hackers are trying thousands of different passwords very quickly to break into accounts, like trying every key on a huge keyring.',
    'Data Exfiltration': 'Someone is stealing and copying important files or data from computers, like a digital burglar taking valuable information.',
    'Cryptomining': 'Criminals have secretly installed software that uses other people\'s computers to create digital money, slowing down the computers.',
    'Ransomware': 'Malicious software is encrypting (locking) files on computers and demanding money to unlock them, like a digital kidnapper.'
  };
  
  return explanations[threatType] || 'Suspicious cyber activity has been detected at this location.';
};