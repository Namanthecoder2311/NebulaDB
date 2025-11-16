# Getting Started with NebulaDB Development

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** (for infrastructure services)
- **Go 1.21+** (for backend development)
- **Node.js 18+** (for frontend development)
- **Git** (for version control)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd NebulaDB

# Run setup script (Linux/Mac)
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Or for Windows
scripts\start-dev.bat
```

### 2. Start Development Environment
```bash
# Start infrastructure services
docker-compose up -d postgres redis minio

# Start backend (Terminal 1)
cd backend/metadata-api
go run main.go

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/docs
- **MinIO Console**: http://localhost:9001 (nebuladb/nebuladb123)

---

## 🏗️ Project Structure

```
NebulaDB/
├── frontend/                 # Next.js React application
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── backend/                 # Go microservices
│   ├── metadata-api/        # Main API service
│   ├── compute-engine/      # Serverless compute service
│   ├── billing/             # Billing and usage service
│   └── shared/              # Shared utilities and types
├── infrastructure/          # Docker and K8s configs
├── docs/                    # Documentation
└── scripts/                 # Development and deployment scripts
```

---

## 🔧 Development Workflow

### Backend Development (Go)

#### Adding a New API Endpoint
1. **Define the model** in `internal/models/models.go`
2. **Add database queries** in appropriate service file
3. **Create handler function** in `internal/handlers/`
4. **Add route** in `main.go`
5. **Write tests** in `*_test.go` files

Example:
```go
// 1. Model
type Database struct {
    ID        uuid.UUID `json:"id" db:"id"`
    Name      string    `json:"name" db:"name"`
    ProjectID uuid.UUID `json:"project_id" db:"project_id"`
}

// 2. Handler
func (h *Handler) CreateDatabase(c *gin.Context) {
    var req CreateDatabaseRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    // Implementation...
}

// 3. Route
protected.POST("/databases", h.CreateDatabase)
```

#### Running Tests
```bash
cd backend/metadata-api
go test ./...
go test -v ./internal/handlers/  # Verbose output
go test -cover ./...             # With coverage
```

### Frontend Development (Next.js)

#### Creating a New Page
1. **Create page file** in `app/` directory
2. **Add components** in `components/` directory
3. **Define types** in `types/` directory
4. **Add API calls** using custom hooks

Example:
```typescript
// app/databases/page.tsx
export default function DatabasesPage() {
  const { databases, loading } = useDatabases()
  
  return (
    <div>
      <h1>Databases</h1>
      {loading ? <Spinner /> : <DatabaseList databases={databases} />}
    </div>
  )
}

// hooks/useDatabases.ts
export function useDatabases() {
  const [databases, setDatabases] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchDatabases().then(setDatabases).finally(() => setLoading(false))
  }, [])
  
  return { databases, loading }
}
```

#### Component Development
- Use **ShadCN components** as base
- Follow **atomic design** principles
- Implement **responsive design** with Tailwind
- Add **TypeScript types** for all props

---

## 🧪 Testing Strategy

### Backend Testing
```bash
# Unit tests
go test ./internal/handlers/
go test ./internal/services/

# Integration tests
go test ./tests/integration/

# Load testing
go test -bench=. ./tests/performance/
```

### Frontend Testing
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Component testing
npm run test:components
```

---

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
export LOG_LEVEL=debug
go run main.go

# Use delve debugger
dlv debug main.go
```

### Frontend Debugging
- Use **React Developer Tools**
- Enable **Next.js debug mode**
- Check **Network tab** for API calls
- Use **console.log** strategically

### Database Debugging
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U nebuladb -d nebuladb

# View logs
docker-compose logs postgres

# Monitor queries
docker-compose exec postgres tail -f /var/log/postgresql/postgresql.log
```

---

## 📊 Monitoring & Logging

### Local Development
```bash
# View application logs
docker-compose logs -f metadata-api

# Monitor resource usage
docker stats

# Check service health
curl http://localhost:8080/api/v1/health
```

### Production Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and alerting
- **ELK Stack**: Centralized logging
- **Jaeger**: Distributed tracing

---

## 🔐 Security Best Practices

### Authentication
- Use **JWT tokens** with short expiration
- Implement **refresh token** rotation
- Add **rate limiting** on auth endpoints
- Use **bcrypt** for password hashing

### API Security
- Validate **all input data**
- Use **parameterized queries** (prevent SQL injection)
- Implement **CORS** properly
- Add **request size limits**

### Database Security
- Use **connection pooling**
- Implement **row-level security**
- Regular **security updates**
- **Encrypt sensitive data**

---

## 🚀 Deployment

### Staging Deployment
```bash
# Build and deploy to staging
docker-compose -f docker-compose.staging.yml up -d

# Run migrations
docker-compose exec metadata-api ./migrate up

# Verify deployment
curl https://staging-api.nebuladb.com/health
```

### Production Deployment
```bash
# Build production images
docker build -t nebuladb/metadata-api:latest backend/metadata-api/
docker build -t nebuladb/frontend:latest frontend/

# Deploy with Kubernetes
kubectl apply -f infrastructure/k8s/

# Monitor deployment
kubectl get pods -n nebuladb
kubectl logs -f deployment/metadata-api -n nebuladb
```

---

## 📚 Additional Resources

### Documentation
- [API Documentation](./api-endpoints.md)
- [Architecture Overview](./architecture.md)
- [Database Schema](./database-schema.sql)
- [Development Roadmap](./roadmap.md)

### External Resources
- [Go Documentation](https://golang.org/doc/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Community
- **Slack Channel**: #nebuladb-dev
- **GitHub Issues**: For bug reports and feature requests
- **Weekly Standups**: Mondays at 9 AM
- **Code Reviews**: Required for all PRs

---

## ❓ Troubleshooting

### Common Issues

#### "Database connection failed"
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

#### "Frontend build failed"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### "Go module not found"
```bash
# Download dependencies
go mod download

# Clean module cache
go clean -modcache
go mod download
```

### Getting Help
1. Check this documentation first
2. Search existing GitHub issues
3. Ask in Slack #nebuladb-dev channel
4. Create a GitHub issue with detailed description

---

## 🎯 Next Steps

1. **Complete the setup** following this guide
2. **Run the test suite** to ensure everything works
3. **Review the roadmap** to understand priorities
4. **Pick your first task** from the current week's goals
5. **Join the daily standup** to sync with the team

Happy coding! 🚀