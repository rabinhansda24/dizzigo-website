# 🚀 DizziGo Website

**Your AI-Powered Terminal Companion** - Official Website

A modern, responsive website built with vanilla HTML, CSS, and JavaScript, containerized with Docker and nginx for production deployment.

## 📁 Project Structure

```
dizzigo-website/
├── 📄 index.html              # Main HTML file
├── 📱 manifest.json           # PWA manifest
├── 🤖 robots.txt              # SEO robots file
├── 🗺️  sitemap.xml            # SEO sitemap
├── 🎨 favicon.svg             # Favicon
├── 📦 package.json            # Node.js package info
│
├── 🎨 css/                    # Stylesheets
│   ├── style.css              # Main stylesheet
│   └── style-backup.css       # Backup styles
│
├── ⚡ js/                     # JavaScript files
│   ├── script.js              # Main JavaScript
│   └── sw.js                  # Service Worker (PWA)
│
├── 🖼️  assets/                # Static assets
│   ├── icons/                 # App icons (PWA)
│   ├── images/                # Website images
│   └── screenshots/           # App screenshots
│
├── 📚 docs/                   # Documentation
│   ├── DOCKER.md              # Docker documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── CONTRIBUTING.md        # Contribution guidelines
│
├── ⚙️  config/                # Configuration files
│   ├── nginx.conf             # Main nginx config
│   ├── default.conf           # Website nginx config
│   └── nginx-proxy.conf       # Reverse proxy config
│
├── 📊 logs/                   # Nginx logs (created at runtime)
│
├── 🐳 Docker Files
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── docker-compose.yml     # Development & production setup
│   ├── .dockerignore          # Docker build exclusions
│   └── .env.example           # Environment variables template
│
├── 🔧 Scripts
│   ├── docker-deploy.sh       # Linux/macOS deployment script
│   ├── docker-deploy.bat      # Windows deployment script
│   ├── quickstart.sh          # Interactive quick start
│   └── test-build.sh          # Docker build testing script
│
└── 📋 Meta Files
    ├── .gitignore             # Git exclusions
    ├── LICENSE                # MIT License
    └── README.md              # This file
```

## 🚀 Quick Start

### **Method 1: Interactive Quick Start (Recommended)**
```bash
# Make executable and run
chmod +x quickstart.sh
./quickstart.sh
```

### **Method 2: Direct Docker Commands**
```bash
# Development environment
./docker-deploy.sh dev
# or
docker-compose up --build -d

# Production environment
./docker-deploy.sh prod
```

### **Method 3: Simple Local Development**
```bash
# Just open index.html in your browser
open index.html
# or
python3 -m http.server 8000
```

## 🌐 Access URLs

| Environment | URL | Description |
|-------------|-----|-------------|
| **Development** | http://localhost:3000 | Full Docker setup |
| **Production** | http://localhost:80 | With reverse proxy |
| **Health Check** | http://localhost:3000/health | Container health |
| **Local Dev** | http://localhost:8000 | Simple Python server |

## 🛠️ Tech Stack

### **Frontend**
- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive functionality
- **Three.js** - 3D background effects
- **GSAP** - Smooth animations

### **Backend/Infrastructure**
- **nginx** - High-performance web server
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### **Development Tools**
- **Bash/Batch Scripts** - Cross-platform deployment
- **Progressive Web App (PWA)** - Modern web capabilities
- **SEO Optimized** - Meta tags, sitemap, robots.txt

## 📦 Docker Architecture

### **Simplified Single-Stage Build**
1. **Production Stage**: nginx:alpine with optimized configuration and website files

### **Key Features**
- ✅ **Security**: Non-root user execution
- ✅ **Performance**: Gzip compression, optimized caching
- ✅ **Monitoring**: Health checks and comprehensive logging
- ✅ **Scalability**: Production-ready configuration

## ⚙️ Configuration

### **Environment Variables**
```bash
# Copy example environment file
cp .env.example .env

# Edit as needed
NGINX_HOST=localhost
NGINX_PORT=8080
```

### **Nginx Caching Strategy**
| File Type | Cache Duration | Notes |
|-----------|----------------|-------|
| **HTML** | 1 hour | Frequent updates |
| **CSS/JS** | 1 year | Immutable with versioning |
| **Images** | 1 year | Rarely change |
| **Service Worker** | No cache | Always fresh |

## 🔧 Available Commands

### **Linux/macOS (docker-deploy.sh)**
```bash
./docker-deploy.sh build    # Build Docker image
./docker-deploy.sh run      # Run standalone container
./docker-deploy.sh dev      # Development environment
./docker-deploy.sh prod     # Production environment
./docker-deploy.sh stop     # Stop all services
./docker-deploy.sh logs     # View logs
./docker-deploy.sh health   # Check health
./docker-deploy.sh clean    # Clean up resources
./docker-deploy.sh shell    # Container shell access
./test-build.sh             # Test Docker build only
```

### **Windows (docker-deploy.bat)**
```cmd
docker-deploy.bat dev       # Development environment
docker-deploy.bat prod      # Production environment
docker-deploy.bat stop      # Stop all services
docker-deploy.bat logs      # View logs
docker-deploy.bat clean     # Clean up resources
```

## 📊 Performance Features

### **Optimization**
- **Gzip Compression** - All text-based files
- **Static Asset Caching** - Long-term browser caching
- **HTTP/2 Ready** - Modern protocol support
- **Minified Assets** - Optimized file sizes

### **Security**
- **Security Headers** - XSS, CSRF, clickjacking protection
- **Rate Limiting** - API endpoint protection
- **Content Security Policy** - Script injection prevention
- **HTTPS Ready** - SSL/TLS configuration prepared

## 🔍 Monitoring & Logs

### **Health Monitoring**
```bash
# Check container health
curl http://localhost:3000/health

# View real-time logs
./docker-deploy.sh logs

# Check container status
docker ps | grep dizzigo
```

### **Log Files**
- `logs/access.log` - HTTP access logs
- `logs/error.log` - nginx error logs

## 🚀 Deployment

### **Development**
```bash
# Quick development setup
./quickstart.sh
# Choose option 1
```

### **Production**
```bash
# Production with SSL (configure SSL first)
./docker-deploy.sh prod

# Or manual production setup
docker-compose --profile production up -d
```

### **CI/CD Integration**
```yaml
# Example GitHub Actions
name: Deploy Website
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: |
          chmod +x docker-deploy.sh
          ./docker-deploy.sh prod
```

## 🛠️ Development

### **Local Development**
```bash
# Method 1: Docker development
./docker-deploy.sh dev

# Method 2: Simple local server
python3 -m http.server 8000
```

### **File Structure Guidelines**
- **CSS files** → `css/` directory
- **JavaScript files** → `js/` directory
- **Images & icons** → `assets/` directory
- **Documentation** → `docs/` directory
- **Configuration** → `config/` directory

### **Adding New Features**
1. **Static assets** → Place in appropriate directory (css/, js/, assets/)
2. **Update paths** → Ensure index.html references correct paths
3. **Test locally** → Use quickstart.sh for quick testing
4. **Update Docker** → Modify Dockerfile if new file types added

## 🔧 Troubleshooting

### **Common Issues**

#### **Docker Build Fails - Permission/User Issues**
```bash
# Error: addgroup/adduser permission issues
# Solution: Use simplified Dockerfile

# Test with simple build:
chmod +x test-build.sh
./test-build.sh --simple

# Or test regular build:
./test-build.sh
```

#### **Docker Build Fails - Assets Directory Error**
```bash
# Error: "/app/assets": not found
# Solution: Ensure .gitkeep files exist in asset subdirectories

# Quick fix:
touch assets/icons/.gitkeep
touch assets/images/.gitkeep
touch assets/screenshots/.gitkeep

# Test build:
chmod +x test-build.sh
./test-build.sh
```

#### **Port Already in Use**
```bash
# Check what's using the port
netstat -tulpn | grep :3000
# Stop existing containers
./docker-deploy.sh stop
```

#### **Build Failures**
```bash
# Clean rebuild
./docker-deploy.sh clean
./docker-deploy.sh build
```

#### **CSS/JS Not Loading**
```bash
# Check file paths in index.html
# Ensure files are in correct directories:
# - css/style.css
# - js/script.js
```

#### **Permission Issues (Linux/macOS)**
```bash
# Fix script permissions
chmod +x *.sh
# Fix log directory permissions
sudo chown -R $USER:$USER logs/
```

## 📋 Prerequisites

- **Docker** 20.10+ recommended
- **Docker Compose** 2.0+ recommended  
- **System Resources**: 512MB RAM, 1GB disk space

## 📚 Documentation

- **[Docker Setup](docs/DOCKER.md)** - Comprehensive Docker guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/dizzigo/dizzigo-website/issues)
- **Documentation**: [docs/](docs/)
- **Quick Help**: Run `./quickstart.sh` and choose option 7

---

## 🎯 About DizziGo

**DizziGo** is your AI-powered terminal companion that acts like a senior software engineer with complete context of your local project. Visit the [main DizziGo repository](https://github.com/dizzigo/dizzigo) to learn more about the CLI tool.

**Built with ❤️ for developers who live in the terminal.**

---

<div align=\"center\">

**[🌐 Visit Website](https://dizzigo.dev)** • **[⭐ Star on GitHub](https://github.com/dizzigo/dizzigo)** • **[📚 Documentation](docs/)**

</div>
