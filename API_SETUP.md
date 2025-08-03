# Salem Cyber Vault - API Configuration Guide

Welcome to Salem Cyber Vault! This guide will help you set up real-time API integrations to replace all mock data with live cybersecurity intelligence.

## 🎃 Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API keys to `.env.local`:**
   ```bash
   # Required for basic functionality
   SHODAN_API_KEY=your_shodan_api_key_here
   OTX_API_KEY=your_otx_api_key_here
   
   # Optional but recommended
   VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
   IPGEOLOCATION_API_KEY=your_ipgeolocation_api_key_here
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

## 🔑 API Key Setup

### Shodan API (Required for Cyber Search)
- **What it provides:** Device discovery, network scanning, IoT device enumeration
- **How to get:**
  1. Go to [shodan.io](https://www.shodan.io/)
  2. Create a free account
  3. Visit your [Account page](https://account.shodan.io/)
  4. Copy your API key
- **Free tier:** 100 queries per month
- **Used for:** Cyber Search interface, device discovery, spooky scan results

### AlienVault OTX API (Required for Threat Intelligence)
- **What it provides:** Real-time threat intelligence, malware indicators, attack patterns
- **How to get:**
  1. Go to [otx.alienvault.com](https://otx.alienvault.com/)
  2. Create a free account
  3. Go to Settings → API Integration
  4. Copy your API key
- **Free tier:** Unlimited with registration
- **Used for:** Threat Intelligence dashboard, Halloween-themed threat detection

### VirusTotal API (Optional)
- **What it provides:** File and URL analysis, malware detection
- **How to get:**
  1. Go to [virustotal.com](https://www.virustotal.com/)
  2. Create a free account
  3. Go to your user profile → API Key
  4. Copy your API key
- **Free tier:** 1000 requests per day
- **Used for:** Enhanced threat analysis, file scanning

### IP Geolocation API (Optional)
- **What it provides:** IP-to-location mapping for attack visualization
- **How to get:**
  1. Go to [ipgeolocation.io](https://ipgeolocation.io/)
  2. Sign up for free account
  3. Copy API key from dashboard
- **Free tier:** 30,000 requests per month
- **Fallback:** Uses free ip-api.com service if not configured
- **Used for:** Real-time attack map, geographic threat visualization

## 🛡️ Feature Mapping

| Dashboard Feature | Primary API | Fallback Behavior |
|-------------------|-------------|-------------------|
| Threat Intelligence | AlienVault OTX | Halloween-themed mock data |
| Vulnerability Analysis | NVD (no key needed) | Static CVE examples |
| Asset Monitoring | Network Scanner | Simulated network assets |
| Real-time Attack Map | IP Geolocation | Country-based threat simulation |
| Cyber Search | Shodan API | Links to shodan.io with suggestions |
| Spooky Scan | Local simulation | Halloween-themed process detection |

## 🎭 Halloween Theme Integration

All APIs are wrapped with Halloween-themed transformations:

- **Threat names** get spooky prefixes (Phantom, Spectral, Cursed, etc.)
- **Vulnerability titles** are enhanced with Halloween flair
- **Attack sources** include seasonal threat patterns
- **Device discovery** includes "haunted" device classifications
- **Risk assessments** use pumpkin-powered scoring

## 🔧 Configuration Options

### Rate Limiting
```bash
# Requests per minute (default: 60)
API_RATE_LIMIT_REQUESTS_PER_MINUTE=60

# Cache duration in seconds (default: 300 = 5 minutes)
API_CACHE_TTL_SECONDS=300
```

### Development Mode
```bash
# Enable mock data fallbacks
NEXT_PUBLIC_ENABLE_MOCK_DATA=true

# Custom API endpoints
CUSTOM_THREAT_FEED_URL=https://your-custom-feed.com/api
CUSTOM_CVE_API_URL=https://your-cve-source.com/api
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add each API key from your `.env.local`
4. Deploy!

### Other Platforms
Ensure these environment variables are set:
- `SHODAN_API_KEY`
- `OTX_API_KEY`
- `VIRUSTOTAL_API_KEY` (optional)
- `IPGEOLOCATION_API_KEY` (optional)

## 🔍 Troubleshooting

### Common Issues

**"API key missing or rate limit exceeded"**
- Check your `.env.local` file exists and has correct keys
- Verify API keys are valid and not expired
- Check rate limits haven't been exceeded

**"Failed to load threat intelligence"**
- OTX API key might be invalid
- Network connectivity issues
- Check browser console for detailed errors

**"Search failed. Please check your API configuration."**
- Shodan API key is missing or invalid
- Rate limit exceeded (free tier: 100 queries/month)
- Query might be malformed

**Components show loading indefinitely**
- API endpoints might be down
- CORS issues (shouldn't happen with supported APIs)
- Check browser network tab for failed requests

### Debug Mode
Enable debug logging:
```bash
NODE_ENV=development
```

### API Status Check
Test your APIs manually:

**Shodan:**
```bash
curl "https://api.shodan.io/api-info?key=YOUR_SHODAN_KEY"
```

**OTX:**
```bash
curl -H "X-OTX-API-KEY: YOUR_OTX_KEY" "https://otx.alienvault.com/api/v1/user/me"
```

## 🎃 Additional Features

### Auto-refresh Intervals
- **Threat Intelligence:** 5 minutes
- **Vulnerability Analysis:** 10 minutes
- **Asset Monitoring:** 15 minutes
- **Real-time Map:** 30 seconds

### Caching Strategy
- API responses are cached to reduce API calls
- Cache duration configurable via `API_CACHE_TTL_SECONDS`
- Rate limiting prevents API quota exhaustion

### Security Features
- API keys are never exposed to the client
- All API calls happen server-side
- Request validation and sanitization
- Error handling with graceful fallbacks

## 📖 API Documentation Links

- [Shodan API Docs](https://developer.shodan.io/)
- [AlienVault OTX API](https://otx.alienvault.com/api)
- [VirusTotal API](https://developers.virustotal.com/reference)
- [NVD API](https://nvd.nist.gov/developers)
- [IP Geolocation API](https://ipgeolocation.io/documentation.html)

## 🎪 Support

Having issues? Check:
1. This configuration guide
2. Browser console for errors
3. API provider status pages
4. Rate limit quotas

Remember: Even without API keys, Salem Cyber Vault will work with Halloween-themed mock data to maintain the spooky experience! 🦇