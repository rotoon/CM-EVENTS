# Environment Variables

This document lists all required and optional environment variables for HYPE CNX.

---

## Table of Contents

- [Backend Variables](#backend-variables)
- [Frontend Variables](#frontend-variables)
- [Setup Instructions](#setup-instructions)
- [Security Best Practices](#security-best-practices)

---

## Backend Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/hype_cnx` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `8000` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `secure_password_here` |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `GEMINI_API_KEY` | Google Generative AI key for trip planning | `AIza...` | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `hype-cnx` | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` | - |
| `SCRAPER_SOURCE_URL` | Source URL for scraper | `https://cmhy.city` | `https://cmhy.city` |
| `CRON_SCHEDULE` | Scraper cron schedule | `0 2 * * *` | `0 2 * * *` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` or `https://hype-cnx-backend.railway.app` |

---

## Setup Instructions

### Backend (.env)

Create `.env` file in `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/hype_cnx

# Server
PORT=8000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# AI Services (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Image Hosting (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Scraping
SCRAPER_SOURCE_URL=https://cmhy.city
CRON_SCHEDULE=0 2 * * *
```

### Frontend (.env.local)

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never store secrets here.

---

## Environment-Specific Values

### Development

**Backend (.env)**

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/hype_cnx
NODE_ENV=development
PORT=8000
JWT_SECRET=dev-secret-key-not-secure
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production

**Backend (.env)**

```env
# Use Railway's DATABASE_URL variable
DATABASE_URL=${{RAILWAY_POSTGRESQL_URL}}

NODE_ENV=production
PORT=8000
JWT_SECRET=<generate-strong-random-key>
ADMIN_USERNAME=<your-username>
ADMIN_PASSWORD=<strong-unique-password>

GEMINI_API_KEY=<your-production-gemini-key>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=https://your-backend-production-url.com
```

---

## Generating Secrets

### JWT Secret

Use a strong random string for `JWT_SECRET`:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Output example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Admin Password

Generate a strong password:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Output example: abc123XYZ!@#
```

### Railway Secrets

Set secrets in Railway dashboard:

1. Go to project
2. Select service
3. Click **Variables** tab
4. Add variable with **Ref** checked (encrypts value)

---

## API Key Setup

### Gemini API Key (Trip Planning AI)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy key and add to `GEMINI_API_KEY`

**Note**: Free tier has rate limits. Monitor usage.

### Cloudinary (Image Hosting)

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from Dashboard:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Security Best Practices

### 1. Never Commit .env Files

Add to `.gitignore`:

```
.env
.env.local
.env.production
.env.*.local
```

### 2. Use Different Values per Environment

| Environment | JWT Secret | Admin Password |
|-------------|------------|----------------|
| Development | `dev-secret` | `admin` |
| Staging | `staging-secret-xyz` | Strong password |
| Production | **Strong random string** | **Very strong unique password** |

### 3. Rotate Secrets Regularly

- JWT secret: Every 90 days
- Admin password: Every 60 days
- API keys: When compromised or annually

### 4. Use Secret Management Services

For production, use:

- **Railway**: Built-in secret management
- **AWS**: Parameter Store / Secrets Manager
- **HashiCorp Vault**: Enterprise secret management

### 5. Limit Exposure

- Backend secrets: Server-side only
- Frontend secrets: Only `NEXT_PUBLIC_*` variables
- Never log secrets
- Never include in error messages

---

## Railway-Specific Setup

### Backend Service Variables

Set these in Railway backend service:

| Variable | Reference |
|----------|-----------|
| `DATABASE_URL` | Link from PostgreSQL service (Ref) |
| `JWT_SECRET` | Set manually (Ref) |
| `ADMIN_USERNAME` | Set manually (Ref) |
| `ADMIN_PASSWORD` | Set manually (Ref) |
| `GEMINI_API_KEY` | Set manually (Ref) |
| `CLOUDINARY_CLOUD_NAME` | Set manually (Ref) |
| `CLOUDINARY_API_KEY` | Set manually (Ref) |
| `CLOUDINARY_API_SECRET` | Set manually (Ref) |

**To Link PostgreSQL:**

1. Click PostgreSQL service
2. Click **Variables**
3. Find `RAILWAY_POSTGRESQL_URL`
4. Go to backend service
5. Add `DATABASE_URL` variable
6. Click **Connect** and select PostgreSQL service
7. Choose `RAILWAY_POSTGRESQL_URL`

### Frontend Service Variables

Set these in Railway frontend service:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend service URL (e.g., `https://hype-cnx-backend-production.railway.app`) |

---

## Verification

### Test Backend Configuration

```bash
cd backend

# Check environment variables are loaded
pnpm start
# Should see: Server running on port 8000

# Test API
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### Test Frontend Configuration

```bash
cd frontend

# Check API URL is accessible
echo $NEXT_PUBLIC_API_URL
# Should output: http://localhost:8000

# Test API connection
pnpm dev
# Visit http://localhost:3000
# Should load events from backend
```

### Test Database Connection

```bash
cd backend

# Test with Prisma
npx prisma db pull
# Should sync successfully

# Open Prisma Studio
npx prisma studio
# Should open GUI with database
```

---

## Troubleshooting

### Problem: Database Connection Failed

**Cause**: Invalid `DATABASE_URL`

**Solution**:

```bash
# Test connection string locally
psql $DATABASE_URL

# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify credentials
echo $DATABASE_URL
```

### Problem: JWT Authentication Fails

**Cause**: `JWT_SECRET` mismatch between frontend/backend

**Solution**:

1. Ensure `JWT_SECRET` is same on all backend instances
2. Regenerate if corrupted
3. Clear browser cookies

### Problem: API Calls from Frontend Fail

**Cause**: CORS or wrong `NEXT_PUBLIC_API_URL`

**Solution**:

1. Check `NEXT_PUBLIC_API_URL` is correct
2. Verify backend CORS allows frontend domain
3. Check backend is accessible:

```bash
curl https://your-backend.com/events
```

### Problem: Environment Variables Not Loaded

**Cause**: `.env` file not in correct location

**Solution**:

```bash
# Verify files exist
ls -la backend/.env
ls -la frontend/.env.local

# Restart services
cd backend && pnpm dev
cd frontend && pnpm dev
```

---

## Additional Resources

- [Railway Environment Variables](https://docs.railway.app/reference/variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [OWASP Environment Variable Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Environment_Variable_Security_Cheat_Sheet.html)

---

## Checklist

Before deploying to production:

- [ ] All required variables set
- [ ] Strong passwords generated
- [ ] API keys obtained
- [ ] `.env` files in `.gitignore`
- [ ] Test database connection
- [ ] Test API endpoints
- [ ] Test authentication
- [ ] Test frontend-backend connection
- [ ] Secrets encrypted (Railway Ref)
- [ ] Different values for dev/staging/prod
