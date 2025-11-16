#!/bin/bash

# NebulaDB Production Deployment Script

set -e

echo "🚀 Starting NebulaDB production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found. Please create it from .env.production template."
    exit 1
fi

# Copy production environment
cp .env.production .env

echo "📦 Building production images..."

# Build backend
docker build -t nebuladb/metadata-api:latest ./backend/metadata-api/

# Build frontend
docker build -t nebuladb/frontend:latest ./frontend/

echo "🐳 Starting production services..."

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🔍 Running health checks..."
curl -f http://localhost/api/v1/health || {
    echo "❌ Health check failed"
    exit 1
}

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost"
echo "   API: http://localhost/api/v1"
echo ""
echo "📊 Monitor with:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"