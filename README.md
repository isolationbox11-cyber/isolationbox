# Salem Cyber Vault

A beginner-friendly, Halloween-themed cybersecurity intelligence platform built with Next.js, React, and Tailwind CSS. This platform integrates with multiple cybersecurity APIs to provide real-time threat intelligence, device discovery, and vulnerability analysis.

## ✨ Features

- 🎃 **Beginner-Friendly Dashboard** - Easy-to-use interface with helpful tooltips and onboarding
- 🔍 **Digital Intelligence Scanner** - Real-time device discovery using Shodan API
- 👻 **Common Haunted Searches** - Preset security searches with explanations
- 🧪 **Latest Detection Potions** - Live vulnerability feeds from CVE databases
- 🛡️ **Real API Integrations** - Connect to Shodan, VirusTotal, AbuseIPDB, GreyNoise, and more
- 📚 **Interactive Spellbook** - Educational content for cybersecurity beginners
- 🔮 **API Status Monitoring** - Clear warnings when API keys are missing
- 🌐 **Vercel-Ready** - Optimized for easy deployment

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

## 🔧 API Setup Instructions

### Required API Keys

The platform requires several API keys to function fully. You can start with just Shodan and VirusTotal for basic functionality.

#### 1. Shodan API (Required)
- **Purpose**: Internet-connected device discovery and analysis
- **Sign up**: https://account.shodan.io/
- **Free tier**: Yes (100 search results, 1 scan credit)
- **Environment variable**: `NEXT_PUBLIC_SHODAN_API_KEY`

#### 2. VirusTotal API (Required)
- **Purpose**: Malware analysis and file/URL scanning
- **Sign up**: https://www.virustotal.com/gui/my-apikey
- **Free tier**: Yes (500 requests/day, 4 requests/minute)
- **Environment variable**: `NEXT_PUBLIC_VIRUSTOTAL_API_KEY`

#### 3. AbuseIPDB API (Recommended)
- **Purpose**: IP address reputation checking
- **Sign up**: https://www.abuseipdb.com/api
- **Free tier**: Yes (1,000 requests/day)
- **Environment variable**: `NEXT_PUBLIC_ABUSEIPDB_API_KEY`

#### 4. GreyNoise API (Recommended)
- **Purpose**: Internet background noise analysis
- **Sign up**: https://viz.greynoise.io/account/api-key
- **Free tier**: Yes (100 requests/day)
- **Environment variable**: `NEXT_PUBLIC_GREYNOISE_API_KEY`

#### 5. Google Custom Search (Optional)
- **Purpose**: Threat intelligence and OSINT searches
- **API Key**: https://developers.google.com/custom-search/v1/introduction
- **CSE Setup**: https://cse.google.com/cse/
- **Free tier**: Yes (100 searches/day)
- **Environment variables**: 
  - `NEXT_PUBLIC_GOOGLE_API_KEY`
  - `NEXT_PUBLIC_GOOGLE_CSE_ID`

#### 6. Additional Optional APIs
- **Have I Been Pwned**: `NEXT_PUBLIC_HIBP_API_KEY` (https://haveibeenpwned.com/API/Key)
- **AlienVault OTX**: `NEXT_PUBLIC_ALIENVAULT_OTX_API_KEY` (https://otx.alienvault.com/api)
- **Censys**: `NEXT_PUBLIC_CENSYS_API_KEY` (https://censys.io/api)
- **SecurityTrails**: `NEXT_PUBLIC_SECURITYTRAILS_API_KEY` (https://securitytrails.com/corp/api)

### Setting Up Environment Variables

#### For Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_SHODAN_API_KEY=your_actual_shodan_api_key_here
   NEXT_PUBLIC_VIRUSTOTAL_API_KEY=your_actual_virustotal_api_key_here
   # ... add other keys as needed
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

#### For Vercel Deployment

1. **Via Vercel Dashboard:**
   - Go to your project's Settings → Environment Variables
   - Add each API key as a new environment variable
   - Make sure to use the exact variable names from `.env.example`
   - Deploy or redeploy your project

2. **Via Vercel CLI:**
   ```bash
   vercel env add NEXT_PUBLIC_SHODAN_API_KEY
   vercel env add NEXT_PUBLIC_VIRUSTOTAL_API_KEY
   # ... add other keys as needed
   ```

3. **Via Vercel Project Settings (Recommended):**
   - Fork this repository to your GitHub account
   - Connect it to Vercel
   - In Vercel dashboard, go to Project → Settings → Environment Variables
   - Add all your API keys
   - Redeploy the project

### API Key Security Notes

⚠️ **Important Security Information:**

- All API keys use the `NEXT_PUBLIC_` prefix because they're used in client-side code
- These keys will be visible in your built application
- Use API keys with appropriate rate limits and restrictions
- Most cybersecurity APIs provide free tiers suitable for educational/personal use
- Consider using separate API keys for development and production

### Vercel Deployment Steps

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/your-username/salem-cyber-vault
   cd salem-cyber-vault
   npm install
   ```

2. **Test Locally:**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   npm run dev
   ```

3. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all API keys from your `.env.local` file
   - Redeploy the project

### Custom Domain Setup

If you want to use a custom domain:

1. **Add Domain in Vercel:**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)

2. **Configure DNS:**
   - Add CNAME record pointing to your Vercel deployment
   - Or add A record pointing to Vercel's IP

3. **SSL Certificate:**
   - Vercel automatically provides SSL certificates
   - Wait for DNS propagation (can take up to 24 hours)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel

## 🎃 Halloween-Themed Features

- 🧙‍♀️ Witch-themed security explanations
- 👻 "Digital Intelligence Scanner" for device discovery
- 🎃 "Common Haunted Searches" for preset queries
- 🧪 "Latest Detection Potions" for vulnerability alerts
- 📚 "Spellbook" for learning cybersecurity concepts
- 🕷️ Dark theme with Halloween aesthetics

## 🔍 What You Can Discover

- **Internet-connected devices** (cameras, routers, IoT devices)
- **Vulnerable services** with known CVEs
- **Malicious IP addresses** and their reputation
- **SSL certificate information**
- **Open ports and running services**
- **Recent security vulnerabilities**
- **Threat intelligence indicators**

## 🎓 Educational Purpose

This platform is designed for:
- Cybersecurity students and beginners
- IT professionals learning threat intelligence
- Security researchers doing OSINT investigations
- Anyone interested in internet security

## ⚖️ Legal and Ethical Use

- This tool is for educational and defensive security purposes only
- Always obtain proper authorization before scanning networks
- Respect API terms of service and rate limits
- Follow responsible disclosure practices
- Use only for legitimate cybersecurity research

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Perfect for cybersecurity professionals who want to combine effective threat intelligence with some seasonal fun!** 🎃👻