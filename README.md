# Salem Cyber Vault

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)
[![GitHub Actions](https://github.com/isolationbox11-cyber/isolationbox/workflows/Deploy%20Salem%20Cyber%20Vault/badge.svg)](https://github.com/isolationbox11-cyber/isolationbox/actions)
[![Docker Build](https://img.shields.io/docker/automated/salem-cyber-vault)](https://hub.docker.com/r/salem-cyber-vault)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Halloween-themed cybersecurity monitoring dashboard built with Next.js, React, and Tailwind CSS.

## Features

- 🎃 **Halloween-themed UI** - Spooky cybersecurity dashboard with orange and black color scheme
- 🛡️ **Security Score Monitoring** - Track your digital protection strength
- 👻 **Threat Intelligence** - Real-time monitoring of cyber threats
- 🗺️ **Live Threat Map** - Global and local threat visualization  
- 📊 **Asset Monitoring** - Security status of network assets
- 🔍 **Vulnerability Analysis** - Latest security vulnerabilities and assessments
- 📚 **Learn Mode** - Educational content explaining cybersecurity concepts
- 🔮 **Spooky Scan** - Halloween-themed security scanner

## Deployment

Salem Cyber Vault supports multiple deployment platforms and methods. Choose the one that best fits your needs.

### 🚀 Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

### 📋 Deployment Options

#### 1. Vercel Deployment

The easiest way to deploy Salem Cyber Vault is using Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

**Environment Variables for Vercel:**
- Set up your environment variables in the Vercel dashboard
- Copy values from `.env.example` and configure as needed

#### 2. Docker Deployment

For containerized deployment:

```bash
# Build and run with Docker
docker build -t salem-cyber-vault .
docker run -p 3000:3000 salem-cyber-vault

# Or use Docker Compose
docker-compose up -d

# For production with nginx
docker-compose --profile production up -d
```

#### 3. Traditional Server Deployment

For deployment on your own server:

```bash
# Clone and setup
git clone https://github.com/isolationbox11-cyber/isolationbox.git
cd isolationbox
npm install

# Build the application
npm run build

# Start production server
npm start
```

#### 4. Netlify Deployment

Deploy to Netlify using their Git integration:

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy!

### 🔧 Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your environment variables:
   - Update `.env.local` with your specific values
   - For production, set environment variables in your deployment platform

### 📊 CI/CD Pipeline

This project includes GitHub Actions for automated testing and deployment:

- **Automated Testing**: Runs on every push and pull request
- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Vercel Integration**: Automatically deploys to Vercel on main branch

**Required GitHub Secrets for Vercel deployment:**
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### 🌐 Platform-Specific Instructions

#### Vercel
- Uses `vercel.json` configuration
- Automatic deployments from GitHub
- Edge functions support
- Built-in CDN and SSL

#### Docker
- Multi-stage build for optimization
- Non-root user for security
- Health checks included
- Nginx reverse proxy option

#### Traditional Hosting
- Requires Node.js 18+ 
- PM2 recommended for process management
- Nginx recommended for reverse proxy

## Development

### Quick Setup

Use the setup script for a quick start:

```bash
# Quick setup (recommended)
./setup.sh

# Manual setup
npm install
npm run build
npm run dev
```

### Manual Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Scripts Available

- `./setup.sh` - Quick setup script for development
- `./deploy.sh` - Interactive deployment script
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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