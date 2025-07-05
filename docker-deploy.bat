@echo off
REM DizziGo Website Docker Build and Deployment Script for Windows

setlocal EnableDelayedExpansion

REM Configuration
set IMAGE_NAME=dizzigo-website
set TAG=latest
set CONTAINER_NAME=dizzigo-website
set HOST_PORT=3000

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    exit /b 1
)

if "%1"=="" (
    goto :help
)

if "%1"=="build" goto :build
if "%1"=="run" goto :run
if "%1"=="dev" goto :dev
if "%1"=="prod" goto :prod
if "%1"=="stop" goto :stop
if "%1"=="logs" goto :logs
if "%1"=="health" goto :health
if "%1"=="clean" goto :clean
if "%1"=="shell" goto :shell
if "%1"=="help" goto :help
if "%1"=="-h" goto :help
if "%1"=="--help" goto :help

echo [ERROR] Unknown command: %1
echo.
goto :help

:build
echo [INFO] Building Docker image: %IMAGE_NAME%:%TAG%
docker build -t %IMAGE_NAME%:%TAG% .
if errorlevel 1 (
    echo [ERROR] Docker build failed
    exit /b 1
)
echo [SUCCESS] Docker image built successfully!
goto :eof

:run
call :build
if errorlevel 1 exit /b 1

echo [INFO] Starting container: %CONTAINER_NAME%

REM Stop existing container if running
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Stopping existing container...
    docker stop %CONTAINER_NAME% >nul 2>&1
    docker rm %CONTAINER_NAME% >nul 2>&1
)

REM Run new container
docker run -d --name %CONTAINER_NAME% -p %HOST_PORT%:8080 -v "%cd%\logs:/var/log/nginx" --restart unless-stopped %IMAGE_NAME%:%TAG%
if errorlevel 1 (
    echo [ERROR] Failed to start container
    exit /b 1
)

echo [SUCCESS] Container started successfully!
echo [INFO] Website available at: http://localhost:%HOST_PORT%
goto :eof

:dev
echo [INFO] Starting development environment with docker-compose
docker-compose up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start development environment
    exit /b 1
)
echo [SUCCESS] Development environment started!
echo [INFO] Website available at: http://localhost:3000
echo [INFO] Logs: docker-compose logs -f
goto :eof

:prod
echo [INFO] Starting production environment
docker-compose --profile production up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start production environment
    exit /b 1
)
echo [SUCCESS] Production environment started!
echo [INFO] Website available at: http://localhost:80
goto :eof

:stop
echo [INFO] Stopping services...

REM Stop docker-compose services
docker-compose ps -q >nul 2>&1
if not errorlevel 1 (
    docker-compose down >nul 2>&1
)

REM Stop standalone container
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if not errorlevel 1 (
    docker stop %CONTAINER_NAME% >nul 2>&1
    docker rm %CONTAINER_NAME% >nul 2>&1
)

echo [SUCCESS] All services stopped!
goto :eof

:logs
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if not errorlevel 1 (
    docker logs -f %CONTAINER_NAME%
) else (
    docker-compose logs -f
)
goto :eof

:health
echo [INFO] Checking health status...

docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Container is not running
    exit /b 1
)

echo [SUCCESS] Container is running

REM Check health endpoint (requires curl)
curl -f http://localhost:%HOST_PORT%/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Health check failed
    exit /b 1
)

echo [SUCCESS] Health check passed
goto :eof

:clean
echo [INFO] Cleaning up Docker resources...

call :stop

REM Remove image
docker images -q %IMAGE_NAME%:%TAG% >nul 2>&1
if not errorlevel 1 (
    docker rmi %IMAGE_NAME%:%TAG% >nul 2>&1
    echo [SUCCESS] Image removed
)

REM Clean up unused resources
docker system prune -f >nul 2>&1
echo [SUCCESS] Cleanup completed!
goto :eof

:shell
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Container is not running. Start it first with: %0 run
    exit /b 1
)

echo [INFO] Opening shell in container...
docker exec -it %CONTAINER_NAME% /bin/sh
goto :eof

:help
echo DizziGo Website Docker Management Script
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   build    Build the Docker image
echo   run      Run the container (standalone)
echo   dev      Start development environment (docker-compose)
echo   prod     Start production environment (with reverse proxy)
echo   stop     Stop all services
echo   logs     Show container logs
echo   health   Check health status
echo   clean    Clean up Docker resources
echo   shell    Open shell in running container
echo   help     Show this help message
echo.
echo Examples:
echo   %0 dev     # Start development environment
echo   %0 build   # Build Docker image
echo   %0 run     # Run standalone container
echo   %0 logs    # View logs
echo   %0 stop    # Stop all services
goto :eof
