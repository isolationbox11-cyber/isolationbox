# Salem Cyber Vault

A Halloween-themed cybersecurity monitoring dashboard built with Next.js, React, and Tailwind CSS. Features real-time IoT device scanning and threat intelligence powered by Shodan API.

## Features

- 🎃 **Halloween-themed UI** - Spooky cybersecurity dashboard with orange and black color scheme
- 🛡️ **Security Score Monitoring** - Track your digital protection strength
- 👻 **Threat Intelligence** - Real-time monitoring of cyber threats
- 🗺️ **Live Threat Map** - Global and local threat visualization  
- 📊 **Asset Monitoring** - Security status of network assets
- 🔍 **Vulnerability Analysis** - Latest security vulnerabilities and assessments
- 📚 **Learn Mode** - Educational content explaining cybersecurity concepts
- 🔮 **Spooky Scan** - Halloween-themed security scanner
- 🏠 **IoT Device Scanner** - Real-time IoT device discovery via Shodan API
- 🔍 **Cyber Search** - Live device and service search powered by Shodan

## Prerequisites

- Node.js 18+ and npm
- Shodan API key (get one free at [shodan.io](https://shodan.io/))

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/isolationbox11-cyber/isolationbox.git
cd isolationbox
npm install
```

### 2. Configure Shodan API Key

1. **Get a Shodan API Key:**
   - Visit [https://shodan.io/](https://shodan.io/)
   - Create a free account or log in
   - Go to [Account > API Key](https://account.shodan.io/) to get your API key

2. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```

3. **Add Your API Key:**
   Open `.env` and replace `your_shodan_api_key_here` with your actual Shodan API key:
   ```env
   SHODAN_API_KEY=your_actual_api_key_here
   ```

   **⚠️ Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 3. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

### Vercel Deployment (Recommended)

1. **Quick Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

2. **Manual Deployment:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   
   # Add environment variable in Vercel dashboard
   # Go to Project Settings > Environment Variables
   # Add: SHODAN_API_KEY = your_api_key_here
   ```

### Other Cloud Platforms

**Environment Variable Setup:**
- **Heroku:** `heroku config:set SHODAN_API_KEY=your_api_key_here`
- **Netlify:** Add in Site settings > Build & deploy > Environment variables
- **Railway:** Add in Project > Variables tab
- **DigitalOcean App Platform:** Add in App settings > Components > Environment Variables

### Docker Deployment

```bash
# Build the container
docker build -t salem-cyber-vault .

# Run with environment variable
docker run -p 3000:3000 -e SHODAN_API_KEY=your_api_key_here salem-cyber-vault
```

## API Integration Details

### Shodan Integration

The application integrates with Shodan's REST API to provide:

- **IoT Device Scanning:** Real-time discovery of IoT devices, security cameras, routers, and smart home devices
- **Cyber Search:** Advanced search capabilities for finding specific devices and services on the internet
- **Security Assessment:** Automatic vulnerability detection and risk assessment for discovered devices

### API Endpoints

- `GET /api/shodan/iot-scan` - Scan for IoT devices
- `GET /api/shodan/search?q={query}` - Search devices and services

### Fallback Mode

If no Shodan API key is configured, the application will:
- Display demo data for IoT scanning
- Show sample search results
- Continue to function with educational content
- Display clear indicators that live data is not available

## Security Considerations

- ✅ **API Key Security:** Environment variables prevent API key exposure
- ✅ **Input Validation:** All search queries are validated and sanitized
- ✅ **Rate Limiting:** Built-in protection against API rate limits
- ✅ **Error Handling:** Graceful fallback when API is unavailable
- ✅ **No Client Exposure:** API key never sent to browser

## Usage

### IoT Device Scanner

1. Navigate to the main dashboard
2. Find the "IoT Device Scanner" card
3. Click "Scan Devices" to discover real IoT devices
4. View device details, security status, and vulnerabilities

### Cyber Search

1. Go to Dashboard > Cyber Search
2. Enter search queries like:
   - `webcam` - Find security cameras
   - `port:22` - Find SSH servers
   - `apache country:US` - Find Apache servers in the US
   - `mongodb` - Find MongoDB databases
3. Use advanced filters for country and device type
4. View detailed device information and security data

## Troubleshooting

### API Key Issues

**Error: "Shodan API key not configured"**
- Verify your `.env` file exists and contains `SHODAN_API_KEY=your_key`
- Restart the development server after adding the key
- Check that your API key is correct at [shodan.io/account](https://account.shodan.io/)

**Error: "Invalid Shodan API key"**
- Double-check your API key for typos
- Ensure you're using the API key, not your password
- Verify your Shodan account is active

**Error: "Shodan API rate limit exceeded"**
- Free Shodan accounts have limited API calls
- Wait a few minutes before trying again
- Consider upgrading your Shodan account for higher limits

### Development Issues

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Loading:**
```bash
# Ensure you're in the correct directory
cd /path/to/isolationbox

# Check if .env file exists
ls -la .env

# Restart development server
npm run dev
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript

## Halloween Special Features

- 🧙‍♀️ Witch-themed security explanations
- 👻 Digital ghost and zombie process detection
- 🎃 Pumpkin-powered threat analysis
- 🕷️ Spooky scanning capabilities
- 🦇 Dark theme with Halloween aesthetics

Perfect for cybersecurity professionals who want to add some seasonal fun to their monitoring dashboards!