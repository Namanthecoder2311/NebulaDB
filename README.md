# NebulaDB - Serverless Postgres BaaS

A fully serverless Backend-as-a-Service platform where users can create databases, execute SQL queries, and manage their data through auto-generated REST APIs.

## Architecture

- **Frontend**: Next.js (JavaScript/Node.js) + TailwindCSS + ShadCN
- **Backend**: Golang microservices
- **Database**: PostgreSQL (metadata) + Serverless Postgres (user data)
- **Storage**: MinIO (S3-compatible)
- **Billing**: Stripe integration
- **Monitoring**: Prometheus + Grafana

## Project Structure

```
NebulaDB/
├── frontend/          # Next.js application
├── backend/           # Golang services
│   ├── metadata-api/  # Main API service
│   ├── compute-engine/ # Serverless compute
│   └── billing/       # Billing service
├── infrastructure/    # Docker, K8s configs
├── docs/             # Documentation
└── scripts/          # Deployment scripts
```

## Quick Start

1. **Frontend**: `cd frontend && npm install && npm run dev`
2. **Backend**: `cd backend/metadata-api && go run main.go`
3. **Database**: `docker-compose up postgres`

## Team

- **Frontend Developer**: Rohit
- **Backend Developer**: Naman (Project Manager)

## ✅ MVP Complete: 6 Weeks

✅ Week 1: Backend foundations
✅ Week 2: Database provisioning  
✅ Week 3: Frontend UI
✅ Week 4: Auto-generated APIs
✅ Week 5: Logging & monitoring
✅ Week 6: Billing & deployment

## 🚀 Production Ready

- Complete authentication system
- Database management with serverless compute
- Auto-generated REST APIs
- Real-time monitoring and analytics
- Stripe billing integration
- Production deployment with Docker
