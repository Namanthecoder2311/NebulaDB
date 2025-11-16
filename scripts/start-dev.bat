@echo off
REM NebulaDB Development Startup Script for Windows

echo 🚀 Starting NebulaDB development environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Start infrastructure services
echo 🐳 Starting infrastructure services...
docker-compose up -d postgres redis minio

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if PostgreSQL is ready
:check_postgres
docker-compose exec -T postgres pg_isready -U nebuladb >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto check_postgres
)

echo ✅ PostgreSQL is ready

REM Start backend in new window
echo 🔧 Starting backend API...
start "NebulaDB Backend" cmd /k "cd backend\metadata-api && go run main.go"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo 🎨 Starting frontend...
start "NebulaDB Frontend" cmd /k "cd frontend && npm run dev"

echo 🎉 Development environment started!
echo.
echo 🌐 Access points:
echo    Frontend:      http://localhost:3000
echo    Backend API:   http://localhost:8080
echo    MinIO Console: http://localhost:9001 (nebuladb/nebuladb123)
echo.
echo Press any key to stop all services...
pause >nul

REM Stop all services
echo 🛑 Stopping services...
docker-compose down
taskkill /f /im "go.exe" >nul 2>&1
taskkill /f /im "node.exe" >nul 2>&1

echo ✅ All services stopped