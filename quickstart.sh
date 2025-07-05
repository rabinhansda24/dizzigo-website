#!/bin/bash

# DizziGo Website - Quick Start Script
# This script helps you get the website running quickly with Docker

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "██████╗ ██╗███████╗███████╗██╗ ██████╗  ██████╗ "
echo "██╔══██╗██║╚══███╔╝╚══███╔╝██║██╔════╝ ██╔═══██╗"
echo "██║  ██║██║  ███╔╝   ███╔╝ ██║██║  ███╗██║   ██║"
echo "██║  ██║██║ ███╔╝   ███╔╝  ██║██║   ██║██║   ██║"
echo "██████╔╝██║███████╗███████╗██║╚██████╔╝╚██████╔╝"
echo "╚═════╝ ╚═╝╚══════╝╚══════╝╚═╝ ╚═════╝  ╚═════╝ "
echo -e "${NC}"
echo -e "${GREEN}🚀 Welcome to DizziGo Website Docker Setup!${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first:${NC}"
    echo "   - Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed and running${NC}"

# Check if docker-compose is available
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose is available${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose not found, using standalone Docker${NC}"
fi

echo ""
echo -e "${BLUE}🎯 What would you like to do?${NC}"
echo ""
echo "1) 🚀 Quick Start (Development)"
echo "2) 🏭 Production Setup"
echo "3) 🔧 Build Only"
echo "4) 📊 View Status"
echo "5) 🛑 Stop Services"
echo "6) 🧹 Clean Up"
echo "7) 📚 Show Help"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Starting Development Environment...${NC}"
        echo ""
        
        # Make deploy script executable
        chmod +x docker-deploy.sh 2>/dev/null || true
        
        # Check if script exists
        if [ -f "docker-deploy.sh" ]; then
            ./docker-deploy.sh dev
        else
            echo "Using docker-compose directly..."
            docker-compose up --build -d
        fi
        
        echo ""
        echo -e "${GREEN}🎉 Development environment is ready!${NC}"
        echo -e "${BLUE}🌐 Open your browser and visit: http://localhost:3000${NC}"
        echo ""
        echo "Useful commands:"
        echo "  📊 View logs: docker-compose logs -f"
        echo "  🛑 Stop: docker-compose down"
        echo "  🔄 Restart: docker-compose restart"
        ;;
        
    2)
        echo -e "${BLUE}🏭 Starting Production Environment...${NC}"
        echo ""
        
        chmod +x docker-deploy.sh 2>/dev/null || true
        
        if [ -f "docker-deploy.sh" ]; then
            ./docker-deploy.sh prod
        else
            docker-compose --profile production up --build -d
        fi
        
        echo ""
        echo -e "${GREEN}🎉 Production environment is ready!${NC}"
        echo -e "${BLUE}🌐 Open your browser and visit: http://localhost:80${NC}"
        ;;
        
    3)
        echo -e "${BLUE}🔧 Building Docker Image...${NC}"
        echo ""
        
        docker build -t dizzigo-website:latest .
        
        echo ""
        echo -e "${GREEN}✅ Build completed successfully!${NC}"
        echo "Run with: docker run -d -p 3000:8080 --name dizzigo-website dizzigo-website:latest"
        ;;
        
    4)
        echo -e "${BLUE}📊 Checking Status...${NC}"
        echo ""
        
        echo "=== Running Containers ==="
        docker ps --filter "name=dizzigo" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        echo ""
        echo "=== Docker Images ==="
        docker images | grep -E "(dizzigo|nginx)" | head -5
        
        echo ""
        echo "=== Health Check ==="
        if curl -f http://localhost:3000/health &>/dev/null; then
            echo -e "${GREEN}✅ Service is healthy${NC}"
        elif curl -f http://localhost:80/health &>/dev/null; then
            echo -e "${GREEN}✅ Service is healthy (port 80)${NC}"
        else
            echo -e "${YELLOW}⚠️  Service health check failed or not running${NC}"
        fi
        ;;
        
    5)
        echo -e "${BLUE}🛑 Stopping Services...${NC}"
        echo ""
        
        # Stop docker-compose services
        docker-compose down 2>/dev/null || true
        
        # Stop standalone containers
        docker stop dizzigo-website 2>/dev/null || true
        docker rm dizzigo-website 2>/dev/null || true
        
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;
        
    6)
        echo -e "${BLUE}🧹 Cleaning Up...${NC}"
        echo ""
        
        read -p "This will remove containers, images, and unused resources. Continue? (y/N): " confirm
        
        if [[ $confirm =~ ^[Yy]$ ]]; then
            # Stop services first
            docker-compose down 2>/dev/null || true
            docker stop dizzigo-website 2>/dev/null || true
            docker rm dizzigo-website 2>/dev/null || true
            
            # Remove images
            docker rmi dizzigo-website:latest 2>/dev/null || true
            
            # Clean up system
            docker system prune -f
            
            echo -e "${GREEN}✅ Cleanup completed${NC}"
        else
            echo "Cleanup cancelled"
        fi
        ;;
        
    7)
        echo -e "${BLUE}📚 DizziGo Docker Help${NC}"
        echo ""
        echo "Available files and their purpose:"
        echo ""
        echo "🐳 Docker Files:"
        echo "  - Dockerfile: Multi-stage build configuration"
        echo "  - docker-compose.yml: Development and production setup"
        echo "  - nginx.conf: Main nginx configuration"
        echo "  - default.conf: Website-specific nginx settings"
        echo ""
        echo "🔧 Scripts:"
        echo "  - docker-deploy.sh: Full deployment script (Linux/macOS)"
        echo "  - docker-deploy.bat: Full deployment script (Windows)"
        echo "  - quickstart.sh: This quick start script"
        echo ""
        echo "📖 Documentation:"
        echo "  - DOCKER.md: Comprehensive Docker documentation"
        echo "  - .env.example: Environment variables template"
        echo ""
        echo "🚀 Quick Commands:"
        echo "  - Development: ./docker-deploy.sh dev"
        echo "  - Production: ./docker-deploy.sh prod"
        echo "  - Logs: ./docker-deploy.sh logs"
        echo "  - Health: ./docker-deploy.sh health"
        echo ""
        echo "For detailed information, read DOCKER.md"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎯 Need help? Check out:${NC}"
echo "  📖 DOCKER.md - Complete documentation"
echo "  🐛 docker-compose logs -f - View logs"
echo "  💡 ./docker-deploy.sh help - More commands"
echo ""
echo -e "${BLUE}Happy coding with DizziGo! 🤖✨${NC}"
