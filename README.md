# RFP Portal

A clean, vendor-facing Request for Proposal app. Create RFPs, share a link with vendors, collect and score their responses.

## Quick Start (Local)

```bash
npm install
cp .env.example .env.local
# Add your Postgres connection string to .env.local
npx prisma db push
npm run dev
```

## Deploy to Vercel (Free)

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. In Vercel dashboard: Storage → Create Database → Postgres
4. Vercel auto-sets DATABASE_URL. Click Deploy.
5. After deploy, run the DB migration from Vercel CLI:
   ```
   npx vercel env pull .env.local
   npx prisma db push
   ```

That's it. Your app is live.
