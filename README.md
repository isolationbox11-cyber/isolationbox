# Salem Cyber Vault

A Halloween-themed cybersecurity monitoring dashboard built with Next.js, React, and Tailwind CSS.

## Features

- 🎃 **Halloween-themed UI** - Spooky cybersecurity dashboard with orange and black color scheme
- 🛡️ **Security Score Monitoring** - Track your digital protection strength
- 👻 **Threat Intelligence** - Real-time monitoring from AlienVault OTX
- 🔍 **IOC Monitoring** - Live indicators of compromise from OTX feeds
- 🗺️ **Live Threat Map** - Global and local threat visualization  
- 📊 **Asset Monitoring** - Security status of network assets
- 🔍 **Vulnerability Analysis** - Latest security vulnerabilities and assessments
- 📚 **Learn Mode** - Educational content explaining cybersecurity concepts
- 🔮 **Spooky Scan** - Halloween-themed security scanner

## Deployment

This application is configured for deployment on Vercel with AlienVault OTX integration.

### Environment Variables for Production

When deploying, make sure to set these environment variables:

- `OTX_API_KEY`: Your AlienVault OTX API key
- `NEXT_PUBLIC_APP_NAME`: "Salem Cyber Vault" (optional)

### Vercel Deployment

1. Connect your repository to Vercel
2. Add the `OTX_API_KEY` environment variable in Vercel dashboard
3. Deploy

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

**Note**: Remember to add your OTX API key in the Vercel environment variables after deployment.

## Setup

### Prerequisites

- Node.js 18+ and npm
- AlienVault OTX API key (free registration at [https://otx.alienvault.com/](https://otx.alienvault.com/))

### Installation

1. Clone the repository
```bash
git clone https://github.com/isolationbox11-cyber/isolationbox.git
cd isolationbox
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```

4. Add your OTX API key to `.env.local`:
```env
OTX_API_KEY=your_actual_otx_api_key_here
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Getting an OTX API Key

1. Visit [AlienVault OTX](https://otx.alienvault.com/)
2. Create a free account or log in
3. Go to your profile settings
4. Navigate to the "API Integration" section
5. Copy your API key
6. Add it to your `.env.local` file

**Important**: Never commit your API key to version control. The `.env.local` file is ignored by git.

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