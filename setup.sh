#!/bin/bash

# Salem Cyber Vault - Quick Setup Script
# Run this script to quickly set up the development environment

set -e

echo "🎃 Salem Cyber Vault - Quick Setup 🎃"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check Node.js version
print_header "🔍 Checking Node.js..."
node_version=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$node_version" -lt 18 ]; then
    echo -e "${YELLOW}[WARNING]${NC} Node.js 18+ recommended. You have $(node --version)"
else
    print_status "Node.js $(node --version) ✓"
fi

# Install dependencies
print_header "📦 Installing dependencies..."
npm install
print_status "Dependencies installed ✓"

# Copy environment template
if [ ! -f ".env.local" ]; then
    print_header "⚙️ Setting up environment..."
    cp .env.example .env.local
    print_status "Environment template copied to .env.local ✓"
    echo -e "${YELLOW}[NOTE]${NC} Please edit .env.local with your configuration"
else
    print_status "Environment file already exists ✓"
fi

# Build the application
print_header "🏗️ Building application..."
npm run build
print_status "Application built successfully ✓"

echo ""
print_header "🎉 Setup Complete!"
echo "You can now:"
echo "  • Run development server: npm run dev"
echo "  • Deploy the application: ./deploy.sh"
echo "  • View the app at: http://localhost:3000"
echo ""
echo "Happy hacking! 👻🔒"