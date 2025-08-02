# Salem Cyber Vault - Deployment Guide

A Next.js cybersecurity dashboard application with multiple deployment options.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications.

#### Prerequisites
- Vercel account
- GitHub repository connected to Vercel

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/isolationbox11-cyber/isolationbox)

#### Manual Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Environment Variables
Set these in Vercel dashboard:
- `NODE_ENV=production`
- Add other variables from `.env.example` as needed

### 2. Docker Deployment

#### Build and Run
```bash
# Build the image
docker build -t salem-cyber-vault .

# Run the container
docker run -p 3000:3000 --env-file .env.local salem-cyber-vault
```

#### Using Docker Compose
```bash
# Copy environment file
cp .env.example .env.local

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

### 3. Traditional Hosting

For VPS or dedicated servers:

```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Start the application
npm start
```

#### PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "salem-cyber-vault" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 4. Static Export (GitHub Pages, etc.)

For static hosting platforms:

```bash
# Add export configuration to next.config.js
# output: 'export'

# Build and export
npm run build

# Deploy the 'out' directory to your static host
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- **Required**: `NODE_ENV`, `PORT`
- **Optional**: Database URLs, API keys, monitoring tools

### Security Headers

The application includes security headers by default:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Performance Optimization

- Image optimization enabled
- Bundle analysis available: `npm run analyze`
- Automatic static optimization
- Code splitting and lazy loading

## 🛡️ Security Considerations

### Production Checklist
- [ ] Update all environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database security (if applicable)
- [ ] API rate limiting
- [ ] Input validation and sanitization

### Monitoring Setup
- Application monitoring (Sentry, LogRocket)
- Performance monitoring (Vercel Analytics, Google Analytics)
- Error tracking and alerting
- Uptime monitoring

## 🔄 CI/CD Pipeline

GitHub Actions workflow included:
- Automated testing and building
- Vercel deployment
- Docker image building
- Security scanning with Snyk
- Code quality checks

### Setup Required Secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SNYK_TOKEN` (optional)

## 📊 Monitoring & Maintenance

### Health Checks
- Application health endpoint: `/api/health`
- Docker health checks included
- Uptime monitoring recommended

### Updates
- Regular dependency updates
- Security patch monitoring
- Feature updates and bug fixes

### Backup Strategy
- Database backups (if applicable)
- Configuration backups
- Regular testing of restore procedures

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Runtime Errors**
   - Check environment variables
   - Verify all required services are running
   - Check application logs

3. **Performance Issues**
   - Enable caching
   - Optimize images and assets
   - Review database queries (if applicable)

### Support
- GitHub Issues
- Documentation updates
- Community discussions

---

## 📝 Quick Start Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Docker
docker-compose up -d

# Vercel
vercel --prod
```

Choose the deployment method that best fits your infrastructure and requirements. The application is designed to work seamlessly across all platforms.