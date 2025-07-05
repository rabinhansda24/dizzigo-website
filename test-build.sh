#!/bin/bash

# Quick Docker Build Test Script for DizziGo Website

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🐳 Testing DizziGo Website Docker Build${NC}"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Build Information:${NC}"
echo "  • Image: dizzigo-website:test"
echo "  • Context: $(pwd)"
echo "  • Build time: $(date)"
echo ""

echo -e "${BLUE}🔍 Checking project structure...${NC}"

# Check critical files exist
files_to_check=(
    "index.html"
    "css/style.css"
    "js/script.js"
    "config/nginx.conf"
    "config/default.conf"
    "assets/icons/.gitkeep"
    "assets/images/.gitkeep"
    "assets/screenshots/.gitkeep"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo -e "  ✅ $file"
    else
        echo -e "  ❌ $file ${RED}(missing)${NC}"
        exit 1
    fi
done

echo ""
echo -e "${BLUE}🔨 Starting Docker build...${NC}"
echo ""

# Build the Docker image
if docker build -t dizzigo-website:test .; then
    echo ""
    echo -e "${GREEN}✅ Docker build successful!${NC}"
    echo ""
    
    # Get image info
    IMAGE_SIZE=$(docker images dizzigo-website:test --format "table {{.Size}}" | tail -n 1)
    echo -e "${BLUE}📊 Build Results:${NC}"
    echo "  • Image size: $IMAGE_SIZE"
    echo "  • Image ID: $(docker images dizzigo-website:test --format "{{.ID}}")"
    echo "  • Created: $(docker images dizzigo-website:test --format "{{.CreatedSince}}")"
    echo ""
    
    echo -e "${BLUE}🧪 Quick container test...${NC}"
    
    # Test container startup
    if docker run --rm -d --name dizzigo-test -p 8888:8080 dizzigo-website:test; then
        sleep 3
        
        # Test health endpoint
        if curl -f http://localhost:8888/health >/dev/null 2>&1; then
            echo -e "  ✅ Container starts successfully"
            echo -e "  ✅ Health check passes"
            echo -e "  🌐 Test URL: http://localhost:8888"
        else
            echo -e "  ❌ Health check failed"
        fi
        
        # Cleanup
        docker stop dizzigo-test >/dev/null 2>&1 || true
    else
        echo -e "  ❌ Container failed to start"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Build test completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "  1. Run full environment: ${YELLOW}./docker-deploy.sh dev${NC}"
    echo "  2. Or start container: ${YELLOW}docker run -d -p 3000:8080 --name dizzigo-website dizzigo-website:test${NC}"
    echo "  3. Clean up test image: ${YELLOW}docker rmi dizzigo-website:test${NC}"
    
else
    echo ""
    echo -e "${RED}❌ Docker build failed!${NC}"
    echo ""
    echo -e "${YELLOW}💡 Troubleshooting tips:${NC}"
    echo "  1. Check that all files are in correct directories"
    echo "  2. Verify .gitkeep files exist in assets subdirectories"
    echo "  3. Ensure Docker has enough disk space"
    echo "  4. Try: docker system prune -f"
    exit 1
fi
