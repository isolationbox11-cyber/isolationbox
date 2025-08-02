# 🛡️ Salem Cyber Vault

A comprehensive cybersecurity dashboard built with Next.js, featuring real-time threat monitoring, vulnerability analysis, and security tools with a Halloween theme.

![Next.js](https://img.shields.io/badge/Next.js-14.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black)

## 🚀 Quick Start

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

### Local Development

```bash
# Clone the repository
git clone https://github.com/isolationbox11-cyber/isolationbox.git
cd isolationbox

# Quick setup using deployment script
./deploy.sh dev

# Or manual setup
npm install
npm run dev
```

### Docker Deployment

```bash
# Quick Docker deployment
./deploy.sh docker

# Or manual Docker setup
cp .env.example .env.local
docker-compose up -d
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Features

### 🎯 Core Features
- **Security Dashboard** - Real-time security metrics and alerts
- **Threat Intelligence** - Live threat monitoring and analysis
- **Vulnerability Scanner** - Automated vulnerability detection
- **IoT Device Scanner** - Network device discovery and security assessment
- **Cyber Search** - Advanced threat research tools
- **Learn Mode** - Interactive cybersecurity education

### 🛡️ Security Features
- **Real-time Monitoring** - Live threat detection and alerts
- **Asset Management** - Infrastructure monitoring and health checks
- **Spooky Scan** - Comprehensive security scanning tools
- **Reconnaissance Analysis** - OSINT and information gathering
- **Security Scoring** - Automated security posture assessment

### 🎨 User Experience
- **Halloween Theme** - Engaging dark theme with seasonal elements
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Live data and interactive components
- **Dark/Light Mode** - User preference theme switching

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Development
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Deployment
- **Vercel** - Serverless deployment platform
- **Docker** - Containerized deployment
- **GitHub Actions** - CI/CD automation
- **Nginx** - Reverse proxy and load balancing

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # Base UI components
│   └── [features]/      # Feature-specific components
├── lib/                 # Utility functions
├── .github/            # GitHub Actions workflows
├── docker-compose.yml  # Docker deployment
├── Dockerfile         # Container configuration
├── vercel.json       # Vercel deployment config
└── deploy.sh         # Deployment automation script
```

## 🚀 Deployment Options

### 1. Vercel (Recommended)
- Zero-config deployment
- Automatic HTTPS and CDN
- Serverless functions
- Real-time collaboration

### 2. Docker
- Containerized deployment
- Easy scaling and management
- Production-ready configuration
- Reverse proxy with Nginx

### 3. Traditional Hosting
- VPS or dedicated server
- PM2 process management
- Manual configuration
- Full control over environment

### 4. Static Export
- GitHub Pages
- Netlify
- AWS S3 + CloudFront
- Any static hosting provider

## 📖 Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Comprehensive deployment instructions
- **[API Documentation](#)** - API endpoints and usage
- **[Component Library](#)** - Reusable component documentation
- **[Security Guide](#)** - Security best practices

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript checks
```

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
- Application settings
- API keys
- Database connections
- Security configurations

## 🔐 Security

### Security Features
- Content Security Policy (CSP)
- Security headers
- Input validation
- Rate limiting
- HTTPS enforcement

### Best Practices
- Regular security updates
- Vulnerability scanning
- Secure deployment practices
- Environment variable management
- Access control and authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📊 Performance

### Optimization Features
- Static generation where possible
- Image optimization
- Code splitting and lazy loading
- Bundle analysis
- Caching strategies

### Monitoring
- Health check endpoint: `/api/health`
- Performance monitoring
- Error tracking
- Uptime monitoring

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎃 Halloween Theme

Salem Cyber Vault features a unique Halloween-themed cybersecurity dashboard that makes security monitoring engaging and visually appealing while maintaining professional functionality.

### Theme Features
- Dark, spooky color scheme
- Halloween-inspired UI elements
- Seasonal animations and effects
- Thematic component styling
- Engaging user experience

---

## 🚨 Support

For support, please open an issue on GitHub or contact the development team.

**Happy Halloween! Stay secure! 🎃🛡️**