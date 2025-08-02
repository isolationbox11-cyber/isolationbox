// Google and Yandex dorking libraries for cybersecurity research
// All dorks are for educational and ethical security research purposes only

export interface DorkQuery {
  name: string
  query: string
  description: string
  risk: 'Low' | 'Medium' | 'High' | 'Critical'
  category: string
  explanation: string
  tips: string[]
}

export interface SearchEngine {
  name: string
  baseUrl: string
  icon: string
}

export const searchEngines: SearchEngine[] = [
  {
    name: 'Google',
    baseUrl: 'https://www.google.com/search?q=',
    icon: '🔍'
  },
  {
    name: 'Yandex',
    baseUrl: 'https://yandex.com/search/?text=',
    icon: '🌐'
  }
]

export const googleDorks: DorkQuery[] = [
  {
    name: 'Exposed Configuration Files',
    query: 'filetype:env "DB_PASSWORD" OR "API_KEY" OR "SECRET"',
    description: 'Find exposed environment configuration files',
    risk: 'Critical',
    category: 'Data Leaks',
    explanation: 'Searches for .env files containing database passwords, API keys, and secrets that should never be public.',
    tips: [
      'These files often contain critical credentials',
      'Report findings to site owners immediately',
      'Never access or download the actual files',
      'Use this to audit your own organization'
    ]
  },
  {
    name: 'Open Directory Listings',
    query: 'intitle:"Index of" inurl:ftp',
    description: 'Find open FTP directory listings',
    risk: 'Medium',
    category: 'Open Directories',
    explanation: 'Locates FTP servers with directory browsing enabled, potentially exposing sensitive files.',
    tips: [
      'Many contain backups and sensitive documents',
      'Look but do not download files',
      'Report open directories to administrators',
      'Check if your organization has exposed directories'
    ]
  },
  {
    name: 'Exposed Admin Panels',
    query: 'inurl:admin intitle:"admin panel" OR intitle:"admin login"',
    description: 'Find administrative login panels',
    risk: 'High',
    category: 'Admin Interfaces',
    explanation: 'Searches for web-based admin panels that might be using default credentials or weak security.',
    tips: [
      'Never attempt to log in to panels you find',
      'Admin panels should not be publicly accessible',
      'Report findings to site administrators',
      'Use strong authentication on your own admin panels'
    ]
  },
  {
    name: 'Vulnerable WordPress Sites',
    query: 'inurl:wp-admin "powered by wordpress" -inurl:https',
    description: 'WordPress sites with exposed admin areas over HTTP',
    risk: 'Medium',
    category: 'Web Applications',
    explanation: 'Finds WordPress sites with admin panels accessible over unencrypted HTTP connections.',
    tips: [
      'HTTP admin logins can be intercepted',
      'Always use HTTPS for admin areas',
      'Keep WordPress updated to latest version',
      'Use strong, unique passwords for WP admin'
    ]
  },
  {
    name: 'Database Dumps',
    query: 'filetype:sql "INSERT INTO" password',
    description: 'Find exposed SQL database dumps',
    risk: 'Critical',
    category: 'Data Leaks',
    explanation: 'Searches for SQL dump files that might contain user passwords and sensitive data.',
    tips: [
      'Database dumps often contain all user data',
      'Passwords might be weakly hashed or plaintext',
      'Never download or access the actual files',
      'Immediately report to site owners'
    ]
  },
  {
    name: 'Email Lists and Logs',
    query: 'filetype:txt "email" "password" site:pastebin.com',
    description: 'Find leaked email/password combinations',
    risk: 'High',
    category: 'Data Breaches',
    explanation: 'Searches paste sites for leaked email and password combinations from data breaches.',
    tips: [
      'Check if your emails appear in breaches',
      'Use unique passwords for each account',
      'Enable two-factor authentication',
      'Monitor your accounts for suspicious activity'
    ]
  },
  {
    name: 'IoT Device Web Interfaces',
    query: 'inurl:8080 intitle:"camera" OR intitle:"webcam"',
    description: 'Find IoT cameras with web interfaces',
    risk: 'Medium',
    category: 'IoT Security',
    explanation: 'Locates internet-connected cameras that might be using default credentials.',
    tips: [
      'Many IoT devices use default passwords',
      'Never access cameras in private spaces',
      'Change default passwords on your devices',
      'Regularly update IoT device firmware'
    ]
  },
  {
    name: 'Backup Files',
    query: 'filetype:bak OR filetype:backup OR filetype:old',
    description: 'Find exposed backup files',
    risk: 'Medium',
    category: 'Data Exposure',
    explanation: 'Searches for backup files that might contain sensitive information or old vulnerabilities.',
    tips: [
      'Backup files often contain outdated, vulnerable code',
      'May include configuration with hardcoded credentials',
      'Never access backup files you discover',
      'Ensure your backups are properly secured'
    ]
  }
]

export const yandexDorks: DorkQuery[] = [
  {
    name: 'Government Document Leaks',
    query: 'site:*.gov filetype:pdf "confidential" OR "classified"',
    description: 'Find potentially classified government documents',
    risk: 'Critical',
    category: 'Document Leaks',
    explanation: 'Searches government sites for PDF documents marked as confidential or classified.',
    tips: [
      'Government documents should be properly classified',
      'Report misclassified documents to authorities',
      'Never download classified materials',
      'Respect national security protocols'
    ]
  },
  {
    name: 'Medical Record Exposures',
    query: 'filetype:xls "patient" "diagnosis" "medical record"',
    description: 'Find exposed medical records in spreadsheets',
    risk: 'Critical',
    category: 'Healthcare Data',
    explanation: 'Searches for Excel files containing patient information that should be protected under HIPAA.',
    tips: [
      'Medical records are protected by strict privacy laws',
      'Immediately report exposures to healthcare providers',
      'Patient privacy is paramount',
      'Healthcare orgs must secure all patient data'
    ]
  },
  {
    name: 'Financial Data Leaks',
    query: 'filetype:csv "credit card" OR "social security" OR "account number"',
    description: 'Find exposed financial information',
    risk: 'Critical',
    category: 'Financial Data',
    explanation: 'Searches for CSV files containing credit card numbers, SSNs, or bank account information.',
    tips: [
      'Financial data requires the highest protection',
      'Report breaches to financial institutions immediately',
      'Never access or record financial information',
      'Use PCI DSS compliance for handling card data'
    ]
  },
  {
    name: 'Russian Government Sites',
    query: 'site:*.ru inurl:admin "вход" OR "пароль"',
    description: 'Find admin panels on Russian domains',
    risk: 'Medium',
    category: 'Admin Interfaces',
    explanation: 'Searches Russian domains for admin login pages that might be poorly secured.',
    tips: [
      'Focus on educational research only',
      'Respect international cyber laws',
      'Never attempt unauthorized access',
      'Report vulnerabilities through proper channels'
    ]
  },
  {
    name: 'Academic Database Exposures',
    query: 'site:*.edu filetype:db OR filetype:mdb "students"',
    description: 'Find exposed academic databases',
    risk: 'High',
    category: 'Educational Data',
    explanation: 'Searches educational institutions for exposed database files containing student information.',
    tips: [
      'Student records are protected under FERPA',
      'Contact educational institutions directly',
      'Protect student privacy at all costs',
      'Educational data requires special handling'
    ]
  },
  {
    name: 'Email Server Configurations',
    query: 'inurl:webmail "postfix" OR "sendmail" config',
    description: 'Find exposed email server configurations',
    risk: 'High',
    category: 'Email Security',
    explanation: 'Searches for email server configuration files that might reveal security settings.',
    tips: [
      'Email configs can reveal server architecture',
      'May contain SMTP credentials and settings',
      'Report exposures to system administrators',
      'Secure email configs behind authentication'
    ]
  },
  {
    name: 'Corporate Document Leaks',
    query: 'site:*.corp filetype:doc "internal use only" OR "proprietary"',
    description: 'Find internal corporate documents',
    risk: 'Medium',
    category: 'Corporate Data',
    explanation: 'Searches corporate domains for internal documents that should not be public.',
    tips: [
      'Corporate documents may contain trade secrets',
      'Respect intellectual property rights',
      'Contact companies through official channels',
      'Implement proper document classification'
    ]
  },
  {
    name: 'Network Configuration Files',
    query: 'filetype:conf "router" OR "switch" "password" -example',
    description: 'Find network device configuration files',
    risk: 'High',
    category: 'Network Security',
    explanation: 'Searches for router and switch configuration files that might contain network credentials.',
    tips: [
      'Network configs reveal infrastructure details',
      'May contain administrative passwords',
      'Report to network administrators immediately',
      'Use secure backup practices for network configs'
    ]
  }
]

export const halloweenThemedDorks: DorkQuery[] = [
  {
    name: 'Phantom FTP Servers',
    query: 'intitle:"Index of" halloween OR ghost OR phantom filetype:exe',
    description: 'Find spooky files lurking in open directories',
    risk: 'Low',
    category: 'Halloween Special',
    explanation: 'A Halloween-themed search for interesting files in open directories with spooky names.',
    tips: [
      'Perfect for the Halloween season!',
      'Look for interesting but harmless content',
      'Respect file owner intentions',
      'Great for learning about directory structures'
    ]
  },
  {
    name: 'Cursed Configuration Files',
    query: 'filetype:cfg "demon" OR "evil" OR "dark" OR "shadow"',
    description: 'Discover configuration files with dark themed names',
    risk: 'Low',
    category: 'Halloween Special',
    explanation: 'Searches for configuration files that developers have given spooky or dark names.',
    tips: [
      'Developers love Halloween-themed naming',
      'Usually harmless but interesting finds',
      'Shows creative developer naming conventions',
      'Educational and entertaining'
    ]
  },
  {
    name: 'Vampire Vulnerability Scanners',
    query: 'inurl:scan "vampire" OR "blood" OR "bite" vulnerability',
    description: 'Find Halloween-themed security tools and scanners',
    risk: 'Low',
    category: 'Halloween Special',
    explanation: 'Searches for security tools and vulnerability scanners with vampire-themed names.',
    tips: [
      'Security tools often have creative names',
      'Great for discovering new security tools',
      'Learn about different scanning approaches',
      'Halloween spirit in cybersecurity'
    ]
  }
]

export function getDorksByCategory(dorks: DorkQuery[], category: string): DorkQuery[] {
  return dorks.filter(dork => dork.category === category)
}

export function getDorksByRisk(dorks: DorkQuery[], risk: string): DorkQuery[] {
  return dorks.filter(dork => dork.risk === risk)
}

export function generateSearchUrl(engine: SearchEngine, query: string): string {
  return `${engine.baseUrl}${encodeURIComponent(query)}`
}

export function getAllCategories(dorks: DorkQuery[]): string[] {
  return Array.from(new Set(dorks.map(dork => dork.category)))
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Critical':
      return 'text-red-400 border-red-500/50'
    case 'High':
      return 'text-orange-400 border-orange-500/50'
    case 'Medium':
      return 'text-yellow-400 border-yellow-500/50'
    case 'Low':
      return 'text-green-400 border-green-500/50'
    default:
      return 'text-gray-400 border-gray-500/50'
  }
}