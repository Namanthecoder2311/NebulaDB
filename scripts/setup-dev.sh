#!/bin/bash

# NebulaDB Development Environment Setup Script

set -e

echo "🚀 Setting up NebulaDB development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
cat > backend/metadata-api/.env << EOF
PORT=8080
DATABASE_URL=postgres://nebuladb:nebuladb123@localhost:5432/nebuladb?sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-in-production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
ENVIRONMENT=development
EOF

# Frontend environment
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
EOF

echo "✅ Environment files created"

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
docker-compose up -d postgres redis minio

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U nebuladb; do
    sleep 2
done

echo "✅ PostgreSQL is ready"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend/metadata-api
go mod tidy
cd ../..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🎉 Development environment setup complete!"
echo ""
echo "🚀 To start the development servers:"
echo "   Backend:  cd backend/metadata-api && go run main.go"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access points:"
echo "   Frontend:     http://localhost:3000"
echo "   Backend API:  http://localhost:8080"
echo "   MinIO Console: http://localhost:9001 (nebuladb/nebuladb123)"
echo "   PostgreSQL:   localhost:5432 (nebuladb/nebuladb123)"
echo ""
echo "📚 Documentation: ./docs/"