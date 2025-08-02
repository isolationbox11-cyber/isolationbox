#!/bin/bash

# Salem Cyber Vault Deployment Script
# This script helps automate the deployment process

set -e

echo "🛡️  Salem Cyber Vault Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) is installed"
}

# Setup environment file
setup_env() {
    if [ ! -f .env.local ]; then
        print_step "Creating environment file..."
        cp .env.example .env.local
        print_warning "Please edit .env.local with your configuration"
    else
        print_success "Environment file already exists"
    fi
}

# Install dependencies
install_deps() {
    print_step "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Build application
build_app() {
    print_step "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Docker deployment
deploy_docker() {
    print_step "Building Docker image..."
    docker build -t salem-cyber-vault .
    print_success "Docker image built"
    
    print_step "Starting application with Docker Compose..."
    docker-compose up -d
    print_success "Application started"
    
    echo ""
    print_success "🎉 Deployment complete!"
    echo ""
    echo "Application is running at:"
    echo "  - HTTP:  http://localhost:3000"
    echo "  - HTTPS: https://localhost (if SSL configured)"
    echo ""
    echo "Health check: http://localhost:3000/api/health"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Local development deployment
deploy_local() {
    print_step "Starting application in development mode..."
    npm run dev &
    SERVER_PID=$!
    
    print_success "Development server started (PID: $SERVER_PID)"
    echo ""
    echo "Application is running at: http://localhost:3000"
    echo "Health check: http://localhost:3000/api/health"
    echo ""
    echo "Press Ctrl+C to stop the server"
    
    # Wait for interrupt
    trap "echo 'Stopping server...'; kill $SERVER_PID; exit 0" INT
    wait $SERVER_PID
}

# Production deployment
deploy_production() {
    print_step "Starting application in production mode..."
    npm start &
    SERVER_PID=$!
    
    print_success "Production server started (PID: $SERVER_PID)"
    echo ""
    echo "Application is running at: http://localhost:3000"
    echo "Health check: http://localhost:3000/api/health"
    echo ""
    echo "To run in background, use PM2 or systemd"
    echo "Press Ctrl+C to stop the server"
    
    # Wait for interrupt
    trap "echo 'Stopping server...'; kill $SERVER_PID; exit 0" INT
    wait $SERVER_PID
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  docker      Deploy using Docker Compose (recommended)"
    echo "  dev         Start development server"
    echo "  production  Start production server"
    echo "  build       Build application only"
    echo "  setup       Setup environment and dependencies only"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 docker      # Full Docker deployment"
    echo "  $0 dev         # Development server"
    echo "  $0 setup       # Setup only"
}

# Main script
main() {
    case "${1:-}" in
        "docker")
            check_docker
            check_node
            setup_env
            install_deps
            build_app
            deploy_docker
            ;;
        "dev")
            check_node
            setup_env
            install_deps
            deploy_local
            ;;
        "production")
            check_node
            setup_env
            install_deps
            build_app
            deploy_production
            ;;
        "build")
            check_node
            setup_env
            install_deps
            build_app
            ;;
        "setup")
            check_node
            setup_env
            install_deps
            print_success "Setup complete!"
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Invalid option: ${1:-}"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"