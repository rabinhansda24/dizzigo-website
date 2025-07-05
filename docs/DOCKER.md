# 🐳 DizziGo Website Docker Setup

This directory contains the complete Docker configuration for serving the DizziGo website using nginx in a containerized environment.

## 📁 Docker Files Overview

```
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Development & production setup
├── nginx.conf              # Main nginx configuration
├── default.conf             # Website-specific nginx config
├── nginx-proxy.conf         # Reverse proxy configuration
├── .dockerignore           # Files to exclude from build
├── docker-deploy.sh        # Linux/macOS deployment script
├── docker-deploy.bat       # Windows deployment script
└── logs/                   # Nginx logs directory
```

## 🚀 Quick Start

### Development Environment

```bash
# Linux/macOS
./docker-deploy.sh dev

# Windows
docker-deploy.bat dev

# Or using docker-compose directly
docker-compose up --build -d
```

**Access**: http://localhost:3000

### Production Environment

```bash
# With reverse proxy
./docker-deploy.sh prod

# Or
docker-compose --profile production up --build -d
```

**Access**: http://localhost:80

## 🛠️ Available Commands

### Linux/macOS (docker-deploy.sh)

```bash
./docker-deploy.sh build    # Build Docker image
./docker-deploy.sh run      # Run standalone container
./docker-deploy.sh dev      # Start development environment
./docker-deploy.sh prod     # Start production environment
./docker-deploy.sh stop     # Stop all services
./docker-deploy.sh logs     # View logs
./docker-deploy.sh health   # Check health status
./docker-deploy.sh clean    # Clean up resources
./docker-deploy.sh shell    # Open container shell
./docker-deploy.sh help     # Show help
```

### Windows (docker-deploy.bat)

```cmd
docker-deploy.bat build     # Build Docker image
docker-deploy.bat run       # Run standalone container
docker-deploy.bat dev       # Start development environment
docker-deploy.bat prod      # Start production environment
docker-deploy.bat stop      # Stop all services
docker-deploy.bat logs      # View logs
docker-deploy.bat health    # Check health status
docker-deploy.bat clean     # Clean up resources
docker-deploy.bat shell     # Open container shell
docker-deploy.bat help      # Show help
```

## 🏗️ Architecture

### Multi-Stage Docker Build

1. **Builder Stage**: Node.js environment for potential build processes
2. **Production Stage**: Lightweight nginx:alpine with optimized configuration

### Key Features

- **Security**: Non-root user execution
- **Performance**: Gzip compression, caching headers, static file optimization
- **Monitoring**: Health checks and comprehensive logging
- **Scalability**: Ready for production deployment

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NGINX_HOST` | localhost | Server hostname |
| `NGINX_PORT` | 8080 | Internal nginx port |

### Port Mapping

| Environment | Host Port | Container Port | Access URL |
|-------------|-----------|----------------|------------|
| Development | 3000 | 8080 | http://localhost:3000 |
| Production | 80 | 8080 | http://localhost:80 |

## 🔧 Nginx Configuration

### Performance Optimizations

- **Gzip Compression**: Enabled for all text-based files
- **Static Asset Caching**: 1-year cache for CSS/JS/images
- **HTTP/2 Support**: Ready for HTTPS deployment
- **Rate Limiting**: API endpoint protection

### Security Headers

- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` (HTTPS only)
- `Content-Security-Policy`

### Cache Strategy

| File Type | Cache Duration | Description |
|-----------|----------------|-------------|
| HTML | 1 hour | Frequent updates expected |
| CSS/JS | 1 year | Immutable with versioning |
| Images | 1 year | Rarely change |
| JSON/XML | 1 day | Configuration files |
| Service Worker | No cache | Always fresh |

## 📊 Monitoring & Logs

### Health Check

The container includes a health check endpoint:

```bash
curl http://localhost:3000/health
# Returns: "healthy"
```

### Log Files

Logs are mounted to `./logs/` directory:

- `access.log` - HTTP access logs
- `error.log` - Nginx error logs

### Viewing Logs

```bash
# Real-time logs
./docker-deploy.sh logs

# Or with docker-compose
docker-compose logs -f

# Specific service
docker-compose logs -f dizzigo-website
```

## 🚦 Deployment Options

### 1. Development Setup

```bash
./docker-deploy.sh dev
```

- Single container
- Development-friendly configuration
- Auto-restart on file changes (if volumes mounted)

### 2. Production Setup

```bash
./docker-deploy.sh prod
```

- Reverse proxy included
- SSL-ready configuration
- Production security headers
- Rate limiting enabled

### 3. Standalone Container

```bash
./docker-deploy.sh run
```

- Simple single container
- Perfect for testing
- Manual port configuration

## 🔒 Security Features

### Container Security

- **Non-root execution**: Container runs as nginx user
- **Minimal base image**: Alpine Linux for smaller attack surface
- **Read-only file system**: Static files only
- **Health monitoring**: Automatic restart on failure

### Web Security

- **Input validation**: Rate limiting and request size limits
- **Header security**: Comprehensive security headers
- **File access control**: Hidden and backup files blocked
- **CORS configuration**: Ready for cross-origin requests

## 📈 Performance Optimizations

### Docker Optimizations

- **Multi-stage build**: Smaller final image
- **Layer caching**: Efficient rebuilds
- **File exclusion**: .dockerignore reduces context size

### Nginx Optimizations

- **Worker processes**: Auto-scaled to CPU cores
- **Connection pooling**: Keep-alive connections
- **Static file serving**: Optimized sendfile()
- **Compression**: Multiple algorithm support

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :3000

# Stop existing container
./docker-deploy.sh stop
```

#### Build Failures
```bash
# Clean up and rebuild
./docker-deploy.sh clean
./docker-deploy.sh build
```

#### Permission Issues
```bash
# Fix log directory permissions (Linux/macOS)
sudo chown -R $USER:$USER logs/
```

#### Health Check Failures
```bash
# Check container status
docker ps
docker logs dizzigo-website

# Test health endpoint manually
curl -v http://localhost:3000/health
```

### Debug Mode

Enable debug logging in nginx:

```bash
# Edit nginx.conf
error_log /var/log/nginx/error.log debug;

# Rebuild and check logs
./docker-deploy.sh dev
./docker-deploy.sh logs
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Website
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          chmod +x docker-deploy.sh
          ./docker-deploy.sh build
          ./docker-deploy.sh health
```

### Docker Hub Integration

```bash
# Tag for registry
docker tag dizzigo-website:latest your-registry/dizzigo-website:latest

# Push to registry
docker push your-registry/dizzigo-website:latest
```

## 📋 Prerequisites

- **Docker**: Version 20.10+ recommended
- **Docker Compose**: Version 2.0+ recommended
- **System Resources**: 
  - RAM: 512MB minimum
  - Disk: 1GB for images and logs
  - CPU: 1 core minimum

## 🎯 Production Checklist

- [ ] SSL certificates configured
- [ ] Domain name pointed to server
- [ ] Firewall rules configured
- [ ] Log rotation setup
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented
- [ ] CDN configured (optional)
- [ ] Load balancer setup (if needed)

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Nginx Performance Tuning](https://nginx.org/en/docs/http/ngx_http_core_module.html)

## 🆘 Support

If you encounter issues with the Docker setup:

1. Check the logs: `./docker-deploy.sh logs`
2. Verify health: `./docker-deploy.sh health`
3. Clean and rebuild: `./docker-deploy.sh clean && ./docker-deploy.sh dev`
4. Open an issue with full error logs

---

**Happy Containerizing! 🐳**
