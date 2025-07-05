#!/bin/bash

# DizziGo Website Docker Build and Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="dizzigo-website"
TAG="latest"
CONTAINER_NAME="dizzigo-website"
HOST_PORT="3000"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Build function
build() {
    log_info "Building Docker image: $IMAGE_NAME:$TAG"
    docker build -t $IMAGE_NAME:$TAG .
    log_success "Docker image built successfully!"
}

# Run function
run() {
    log_info "Starting container: $CONTAINER_NAME"
    
    # Stop existing container if running
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_warning "Stopping existing container..."
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
    
    # Run new container
    docker run -d \
        --name $CONTAINER_NAME \
        -p $HOST_PORT:8080 \
        -v $(pwd)/logs:/var/log/nginx \
        --restart unless-stopped \
        $IMAGE_NAME:$TAG
    
    log_success "Container started successfully!"
    log_info "Website available at: http://localhost:$HOST_PORT"
}

# Development function using docker-compose
dev() {
    log_info "Starting development environment with docker-compose"
    docker-compose up --build -d
    log_success "Development environment started!"
    log_info "Website available at: http://localhost:3000"
    log_info "Logs: docker-compose logs -f"
}

# Production function
prod() {
    log_info "Starting production environment"
    docker-compose --profile production up --build -d
    log_success "Production environment started!"
    log_info "Website available at: http://localhost:80"
}

# Stop function
stop() {
    log_info "Stopping services..."
    
    # Stop docker-compose services
    if docker-compose ps -q | grep -q .; then
        docker-compose down
    fi
    
    # Stop standalone container
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
    fi
    
    log_success "All services stopped!"
}

# Logs function
logs() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker logs -f $CONTAINER_NAME
    else
        docker-compose logs -f
    fi
}

# Health check function
health() {
    log_info "Checking health status..."
    
    # Check if container is running
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_success "Container is running"
        
        # Check health endpoint
        if curl -f http://localhost:$HOST_PORT/health > /dev/null 2>&1; then
            log_success "Health check passed"
        else
            log_error "Health check failed"
            exit 1
        fi
    else
        log_error "Container is not running"
        exit 1
    fi
}

# Clean function
clean() {
    log_info "Cleaning up Docker resources..."
    
    # Stop and remove containers
    stop
    
    # Remove image
    if docker images -q $IMAGE_NAME:$TAG | grep -q .; then
        docker rmi $IMAGE_NAME:$TAG
        log_success "Image removed"
    fi
    
    # Clean up unused resources
    docker system prune -f
    log_success "Cleanup completed!"
}

# Shell function
shell() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        log_info "Opening shell in container..."
        docker exec -it $CONTAINER_NAME /bin/sh
    else
        log_error "Container is not running. Start it first with: $0 run"
        exit 1
    fi
}

# Help function
help() {
    echo "DizziGo Website Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build    Build the Docker image"
    echo "  run      Run the container (standalone)"
    echo "  dev      Start development environment (docker-compose)"
    echo "  prod     Start production environment (with reverse proxy)"
    echo "  stop     Stop all services"
    echo "  logs     Show container logs"
    echo "  health   Check health status"
    echo "  clean    Clean up Docker resources"
    echo "  shell    Open shell in running container"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development environment"
    echo "  $0 build   # Build Docker image"
    echo "  $0 run     # Run standalone container"
    echo "  $0 logs    # View logs"
    echo "  $0 stop    # Stop all services"
}

# Main script logic
case "$1" in
    build)
        build
        ;;
    run)
        build
        run
        ;;
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop)
        stop
        ;;
    logs)
        logs
        ;;
    health)
        health
        ;;
    clean)
        clean
        ;;
    shell)
        shell
        ;;
    help|--help|-h)
        help
        ;;
    *)
        log_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac
