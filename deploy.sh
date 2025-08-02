#!/bin/bash

# Salem Cyber Vault - Deployment Script
# This script helps deploy Salem Cyber Vault to various platforms

set -e

echo "🎃 Salem Cyber Vault Deployment Script 🎃"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if node and npm are installed
check_prerequisites() {
    print_header "🔍 Checking Prerequisites..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or later."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_status "Node.js $(node --version) and npm $(npm --version) are installed."
}

# Install dependencies
install_dependencies() {
    print_header "📦 Installing Dependencies..."
    npm install
    print_status "Dependencies installed successfully."
}

# Build the application
build_application() {
    print_header "🏗️  Building Application..."
    npm run build
    print_status "Application built successfully."
}

# Deploy to Vercel
deploy_vercel() {
    print_header "🚀 Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_status "Deploying to Vercel..."
    vercel --prod
    print_status "Deployed to Vercel successfully!"
}

# Docker deployment
deploy_docker() {
    print_header "🐳 Building Docker Image..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    print_status "Building Docker image..."
    docker build -t salem-cyber-vault .
    
    print_status "Running Docker container..."
    docker run -d -p 3000:3000 --name salem-cyber-vault salem-cyber-vault
    
    print_status "Salem Cyber Vault is running at http://localhost:3000"
}

# Docker Compose deployment
deploy_docker_compose() {
    print_header "🐳 Deploying with Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Starting services with Docker Compose..."
    docker-compose up -d
    
    print_status "Salem Cyber Vault is running at http://localhost:3000"
}

# Show deployment options
show_menu() {
    print_header "🎯 Choose Deployment Method:"
    echo "1) Vercel (Recommended)"
    echo "2) Docker"
    echo "3) Docker Compose"
    echo "4) Local Development"
    echo "5) Just Build"
    echo "6) Exit"
}

# Main deployment logic
main() {
    check_prerequisites
    
    while true; do
        echo ""
        show_menu
        read -p "Enter your choice (1-6): " choice
        
        case $choice in
            1)
                install_dependencies
                build_application
                deploy_vercel
                break
                ;;
            2)
                install_dependencies
                build_application
                deploy_docker
                break
                ;;
            3)
                install_dependencies
                build_application
                deploy_docker_compose
                break
                ;;
            4)
                install_dependencies
                print_status "Starting development server..."
                npm run dev
                break
                ;;
            5)
                install_dependencies
                build_application
                print_status "Build completed. You can now deploy manually."
                break
                ;;
            6)
                print_status "Goodbye! 🎃"
                exit 0
                ;;
            *)
                print_warning "Invalid option. Please choose 1-6."
                ;;
        esac
    done
}

# Run the main function
main "$@"