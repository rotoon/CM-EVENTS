# Deployment Guide

This guide covers deploying HYPE CNX to production using Railway (recommended) and alternative platforms.

---

## Table of Contents

- [Railway Deployment](#railway-deployment)
- [Environment Configuration](#environment-configuration)
- [Custom Domain Setup](#custom-domain-setup)
- [Monitoring & Logs](#monitoring--logs)
- [Scaling & Performance](#scaling--performance)
- [Backup & Recovery](#backup--recovery)
- [Alternative Deployments](#alternative-deployments)

---

## Railway Deployment

Railway is the recommended platform for deploying HYPE CNX. It provides PostgreSQL, automatic SSL, and easy CI/CD.

### Prerequisites

1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **GitHub Repository** - Push code to GitHub
3. **Domain** (optional) - Custom domain for production

### Step 1: Deploy Backend

#### Create Backend Service

1. Go to [Railway Dashboard](https://dashboard.railway.app)
2. Click **+ New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Select **Backend** as the service

#### Configure Backend

1. In the **Variables** tab, add environment variables (see [ENV.md](docs/ENV.md))
2. Set `NODE_ENV=production`
3. Add your `DATABASE_URL` (from PostgreSQL service)
4. Add any API keys (Gemini, Cloudinary, etc.)

#### Build Settings

Railway automatically detects the configuration from `package.json`:

```json
{
  "scripts": {
    "start": "tsx api/index.ts"
  }
}
```

If needed, customize in **Settings** > **Build**:

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
```

#### Deploy

1. Click **Deploy**
2. Railway builds and starts the backend
3. Copy the backend URL (e.g., `https://hype-cnx-backend.railway.app`)

---

### Step 2: Deploy PostgreSQL

#### Create Database Service

1. In the same project, click **+ New Service**
2. Select **Database**
3. Choose **PostgreSQL**

#### Configure Database

1. Click on the PostgreSQL service
2. Copy the `DATABASE_URL` from **Variables** tab
3. Add this URL to your backend service variables

#### Seed Database

Run the seed script via Railway console:

1. Go to backend service
2. Click **Console**
3. Run: `pnpm seed`

---

### Step 3: Deploy Frontend

#### Create Frontend Service

1. Click **+ New Service** in the project
2. Select **Deploy from GitHub repo**
3. Railway will detect the Next.js app

#### Configure Frontend

In **Variables** tab:

```env
NEXT_PUBLIC_API_URL=https://hype-cnx-backend.railway.app
```

Replace with your actual backend URL.

#### Build Settings

Add custom build settings in `railway.toml` (if needed):

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/"
startCommand = "pnpm start"
```

#### Deploy

1. Click **Deploy**
2. Railway builds the Next.js app
3. Access at the generated URL (e.g., `https://hype-cnx.railway.app`)

---

## Environment Configuration

### Backend Environment Variables

Create these in Railway backend service:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Server
PORT=8000
NODE_ENV=production

# Authentication
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password

# AI Services
GEMINI_API_KEY=your-gemini-key

# Image Hosting (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-secret

# Scraping
SCRAPER_SOURCE_URL=https://cmhy.city
```

### Frontend Environment Variables

Create these in Railway frontend service:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

**Note**: Frontend variables must start with `NEXT_PUBLIC_` to be exposed to the browser.

---

## Custom Domain Setup

### Step 1: Buy/Transfer Domain

Use any domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)

### Step 2: Add Domain to Railway

1. Go to project **Settings** > **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `hypecnx.com`)

### Step 3: Configure DNS

Railway provides DNS records. Add these to your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | Railway IP address |
| CNAME | www | Railway hostname |

### Step 4: Verify DNS

Wait for DNS propagation (5-30 minutes), then verify in Railway dashboard.

### Step 5: Redirects (Optional)

To redirect `www` to non-www:

```nginx
server {
  listen 80;
  server_name www.hypecnx.com;
  return 301 https://hypecnx.com$request_uri;
}
```

---

## Monitoring & Logs

### Viewing Logs

#### Backend Logs

1. Go to backend service
2. Click **Logs** tab
3. View real-time logs

#### Frontend Logs

1. Go to frontend service
2. Click **Logs** tab
3. View build and runtime logs

### Health Checks

Add health check endpoints:

#### Backend

```typescript
// backend/src/routes/health.routes.ts
import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
```

Add to main routes: `router.use("/", healthRoutes)`

#### Frontend

Next.js automatically serves health at `/`

### Monitoring Services

Consider integrating:

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Vercel Analytics** - If using Vercel

---

## Scaling & Performance

### Vertical Scaling

Upgrade Railway plan in **Settings** > **Plan**:

| Plan | RAM | CPU |
|------|-----|-----|
| Eco | 512 MB | 0.25 vCPU |
| Basic | 1 GB | 0.5 vCPU |
| Pro | 2 GB | 1 vCPU |

### Horizontal Scaling

For high traffic:

1. Use Railway's **Starter** plan for scaling
2. Enable **Scaling** in service settings
3. Set min/max instances

### Database Optimization

1. **Connection Pooling**

```typescript
// backend/src/config/database.ts
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

2. **Indexes** - Add indexes in Prisma schema

```prisma
model events {
  // ...
  @@index([start_date])
  @@index([category])
}
```

3. **Redis Cache** - Add Redis for frequently accessed data

```bash
# Add Redis service in Railway
# Configure in backend
pnpm add ioredis
```

### Frontend Optimization

1. **Image Optimization**

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/event.jpg"
  alt="Event"
  width={800}
  height={600}
  priority
/>
```

2. **Code Splitting**

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <div>Loading...</div>,
});
```

3. **CDN** - Use CloudFlare CDN for static assets

---

## Backup & Recovery

### Automatic Backups

Railway automatically backs up PostgreSQL daily.

### Manual Backups

#### Export Database

```bash
# Via Railway console
pg_dump $DATABASE_URL > backup.sql

# Or download via Railway UI
# Database > Export
```

#### Import Database

```bash
# Via Railway console
psql $DATABASE_URL < backup.sql

# Or import via Railway UI
# Database > Import
```

### Backup Strategy

1. **Daily Backups** - Automatic (Railway)
2. **Weekly Exports** - Manual download
3. **Code Versioning** - Git with tags for releases

### Disaster Recovery

1. Create new Railway project
2. Deploy fresh PostgreSQL
3. Import latest backup
4. Deploy backend with same env vars
5. Deploy frontend with new backend URL
6. Update DNS to point to new project

---

## Alternative Deployments

### Vercel (Frontend Only)

#### Deploy Frontend

```bash
cd frontend
vercel login
vercel
```

1. Follow prompts
2. Add environment variables
3. Deploy

#### Production Deployment

```bash
vercel --prod
```

#### Limitations

- No backend hosting (use Railway/VPS for backend)
- Limited database options

---

### DigitalOcean (Full Stack)

#### Create Droplet

1. Go to DigitalOcean
2. Create Droplet (Ubuntu 22.04)
3. Choose size (2GB RAM minimum)
4. Access via SSH

#### Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2
```

#### Deploy Backend

```bash
# Clone repo
git clone https://github.com/yourusername/CM-EVENTS.git
cd CM-EVENTS/backend

# Install dependencies
pnpm install

# Setup database
createdb hype_cnx
npx prisma db push
pnpm seed

# Start with PM2
pm2 start api/index.ts --name hype-cnx-backend
pm2 save
pm2 startup
```

#### Deploy Frontend

```bash
cd ../frontend
pnpm install
pnpm build
pm2 start npm --name hype-cnx-frontend -- start
pm2 save
```

#### Configure Nginx

```nginx
server {
  listen 80;
  server_name hypecnx.com;

  location /api {
    proxy_pass http://localhost:8000;
  }

  location / {
    proxy_pass http://localhost:3000;
  }
}
```

#### SSL with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d hypecnx.com
```

---

### AWS (Full Stack)

#### Architecture

- **EC2** - Application servers
- **RDS** - Managed PostgreSQL
- **S3** - Static assets
- **CloudFront** - CDN
- **Route53** - DNS

#### Deploy with AWS CDK

```typescript
// lib/hype-cnx-stack.ts
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";

export class HypeCnxStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, "HypeCnxVPC");

    // RDS PostgreSQL
    new rds.DatabaseInstance(this, "Database", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4,
      }),
      vpc,
      allocatedStorage: 20,
    });

    // S3 Bucket for assets
    new s3.Bucket(this, "AssetsBucket", {
      versioned: true,
    });
  }
}
```

#### Deploy

```bash
npm install -g aws-cdk
cdk bootstrap
cdk deploy
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/cli@v1.0.0
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service-id: ${{ secrets.RAILWAY_BACKEND_SERVICE_ID }}
          command: "up"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/cli@v1.0.0
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service-id: ${{ secrets.RAILWAY_FRONTEND_SERVICE_ID }}
          command: "up"
```

---

## Troubleshooting

### Deployment Failures

**Problem**: Build fails
**Solution**:
1. Check build logs
2. Verify `package.json` scripts
3. Ensure all dependencies are in `dependencies`

**Problem**: Database connection error
**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check PostgreSQL service is running
3. Test connection string locally

**Problem**: CORS errors
**Solution**:
1. Add frontend URL to CORS whitelist
2. Check `NEXT_PUBLIC_API_URL` matches backend

### Performance Issues

**Problem**: Slow load times
**Solution**:
1. Enable image optimization
2. Add CDN (CloudFlare)
3. Upgrade Railway plan
4. Check database queries

**Problem**: High memory usage
**Solution**:
1. Add Redis caching
2. Optimize database queries
3. Increase instance size

---

## Maintenance

### Regular Tasks

#### Daily

- Check error logs
- Monitor uptime

#### Weekly

- Review database backups
- Check disk usage
- Update dependencies

#### Monthly

- Review and update dependencies
- Analyze performance metrics
- Review costs and optimize

### Updating Dependencies

```bash
# Frontend
cd frontend
pnpm update
pnpm test
pnpm build

# Backend
cd backend
pnpm update
pnpm test
```

---

## Security

### Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] Database not publicly accessible
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Authentication required for admin
- [ ] Regular backups enabled
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Dependencies kept up-to-date

---

## Cost Estimation

### Railway (Recommended)

| Service | Plan | Cost |
|---------|------|------|
| Backend | Basic | $5/month |
| Frontend | Basic | $5/month |
| PostgreSQL | Pro | $10/month |
| **Total** | | **~$20/month** |

### DigitalOcean

| Resource | Cost |
|----------|------|
| Droplet (2GB) | $12/month |
| Managed PostgreSQL | $15/month |
| **Total** | **~$27/month** |

### AWS

| Service | Cost |
|----------|------|
| EC2 (t3.medium) | ~$30/month |
| RDS (t3.micro) | ~$15/month |
| S3 + CloudFront | ~$5/month |
| **Total** | **~$50/month** |

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Community**: GitHub Issues, Discord
