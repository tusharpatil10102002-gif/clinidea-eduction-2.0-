# Clinidea Production Deployment Guide 🚀

This document outlines the steps required to deploy the fully tested Clinidea Educational Platform to a production environment.

## 1. Environment Preparation

Before deploying, ensure you have production accounts ready for:
- **Hosting:** VPS (DigitalOcean/AWS/Hostinger) or PaaS (Render/Railway).
- **Database:** PostgreSQL database URL (e.g., Supabase, Neon.tech, AWS RDS).
- **Email:** SMTP Credentials (Gmail App Password or SendGrid API).
- **Payments:** Razorpay Live Keys.

## 2. Setting Up Production Variables

Create a `.env` file in the `backend` folder on the production server:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=5000
JWT_SECRET="your-strong-production-secret"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@clinidea.in"
EMAIL_PASS="your-app-password"
ADMIN_EMAIL="admin@clinidea.in"
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-live-secret"
BASE_URL="https://www.clinidea.in"
```

## 3. Database Migration

Since local development used `dev.db` (SQLite), we must switch Prisma to PostgreSQL for production.
1. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Run database migration:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```

## 4. Deploying the Backend (Node.js)

Assuming you are on a VPS (Ubuntu):
1. Clone the repository and navigate to `backend`.
2. Install dependencies: `npm install --production`.
3. Install PM2 for process management: `npm install -g pm2`.
4. Start the server: `pm2 start server.js --name "clinidea-api"`.
5. Set PM2 to start on boot: `pm2 startup` and `pm2 save`.

## 5. Deploying the Frontend (React + Vite)

The frontend is optimized for static hosting.
1. In the `src/config.js` file, change the `BASE_URL` to your production API domain:
   ```javascript
   export const BASE_URL = "https://api.clinidea.in";
   ```
2. Run the build command:
   ```bash
   npm install
   npm run build
   ```
3. Copy the contents of the `dist/` directory to your web server (e.g., Nginx, Apache) or host it on Vercel/Netlify.

## 6. Configuring Nginx & SSL (HTTPS)

Install Nginx and configure it to reverse proxy the backend and serve the frontend.
Use **Certbot** to install a free SSL certificate for `clinidea.in` and `api.clinidea.in`.

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d clinidea.in -d www.clinidea.in -d api.clinidea.in
```

## 7. Daily Monitoring & Backups
- **Logs:** Use `pm2 logs` to monitor backend errors.
- **Database Backup:** Set up a cron job using `pg_dump` to take daily backups of your PostgreSQL database.
