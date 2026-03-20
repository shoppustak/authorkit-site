# AuthorKit Bookshelf - Deployment Guide (Supabase)

This guide walks you through deploying the AuthorKit Bookshelf API endpoints and frontend to Vercel with Supabase database.

## Prerequisites

1. ✅ Supabase database created and configured (see `database/SETUP.md`)
2. ✅ Supabase `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` ready
3. ✅ Vercel account with access to the `authorkit-site` project
4. ✅ Git repository connected to Vercel

## Step 1: Install Dependencies Locally

Before deploying, test the setup locally:

```bash
cd authorkit-site
npm install
```

This installs `@supabase/supabase-js` and other dependencies.

## Step 2: Configure Environment Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select the **authorkit-site** project
3. Go to **Settings** → **Environment Variables**
4. Add **TWO** variables:

### SUPABASE_URL
- **Value**: `https://xxxxx.supabase.co` (from Supabase Project Settings → API)
- **Environment**: Production, Preview, Development (check all three)

### SUPABASE_SERVICE_KEY
- **Value**: `eyJhbG...` (from Supabase Project Settings → API → service_role key)
- **Environment**: Production, Preview, Development (check all three)
- **⚠️ Important**: This is the **service_role** key, NOT the public anon key

5. Click **Save**

## Step 3: Deploy to Vercel

### Option A: Deploy via Git Push (Recommended)

```bash
git add .
git commit -m "feat: deploy AuthorKit Bookshelf with Supabase"
git push origin master
```

Vercel will automatically detect the push and deploy.

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Step 4: Verify API Endpoints

After deployment, test each endpoint:

### Test 1: Register a Site

```bash
curl -X POST https://authorkit.pro/api/bookshelf/register \
  -H "Content-Type: application/json" \
  -d '{
    "site_url": "https://test-author.com",
    "site_name": "Test Author Site"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "site_id": 1,
  "message": "Site registered successfully"
}
```

### Test 2: Sync a Book

```bash
curl -X POST https://authorkit.pro/api/bookshelf/sync \
  -H "Content-Type: application/json" \
  -d '{
    "site_url": "https://test-author.com",
    "site_name": "Test Author Site",
    "book_post_id": 1,
    "title": "Test Book",
    "slug": "test-book",
    "description": "A test book for verifying the API",
    "cover": {
      "medium": "https://example.com/cover.jpg",
      "large": "https://example.com/cover-large.jpg"
    },
    "author": "Test Author",
    "bookshelf_genres": ["fantasy", "young-adult"],
    "formats": ["ebook", "paperback"],
    "publication_date": "2026-01-01"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "book_id": 1,
  "message": "Book synced successfully"
}
```

### Test 3: Fetch Books

```bash
curl https://authorkit.pro/api/bookshelf/books?limit=5
```

**Expected response:**
```json
{
  "success": true,
  "books": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
  },
  "stats": {
    "total_books": 1,
    "total_authors": 1
  }
}
```

### Test 4: Remove a Book

```bash
curl -X POST https://authorkit.pro/api/bookshelf/remove \
  -H "Content-Type: application/json" \
  -d '{
    "site_url": "https://test-author.com",
    "book_post_id": 1
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Book removed successfully"
}
```

### Test 5: Deregister a Site

```bash
curl -X POST https://authorkit.pro/api/bookshelf/deregister \
  -H "Content-Type: application/json" \
  -d '{
    "site_url": "https://test-author.com"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "books_removed": 0,
  "message": "Site deregistered successfully"
}
```

## Step 5: Check Vercel Logs

1. Go to your Vercel dashboard
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on any API endpoint to view logs
5. Verify no errors appear

## Step 6: Verify Database Records

1. Go to your Supabase dashboard
2. Click **Table Editor**
3. Select the **bookshelf_sites** and **bookshelf_books** tables
4. Verify your test records appear

You should see your test records!

## Troubleshooting

### Error: "Missing environment variable: SUPABASE_URL" or "SUPABASE_SERVICE_KEY"

**Solution**:
- Ensure both `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in Vercel
- Redeploy after adding the variables (Vercel requires redeploy for new env vars)

### Error: "Invalid API key"

**Solution**:
- Verify you're using the **service_role** key, not the anon/public key
- Check Supabase Project Settings → API → service_role
- Copy the key exactly (it starts with `eyJhbG...`)
- Update in Vercel and redeploy

### Error: "Table doesn't exist" or "relation does not exist"

**Solution**:
- Run the SQL schema in Supabase SQL Editor (see `database/SETUP.md`)
- Verify you're using the correct database
- Check the Table Editor to confirm all 4 tables exist:
  - bookshelf_sites
  - bookshelf_books
  - bookshelf_book_genres
  - bookshelf_genres

### Error: "Row level security policy"

**Solution**:
- The API uses the service_role key which bypasses RLS
- If you see RLS errors, verify `SUPABASE_SERVICE_KEY` is set correctly
- Check `api/_lib/supabase.js` to ensure service_role key is being used

### Books not appearing in database

**Solution**:
- Check Vercel function logs for errors
- Verify the sync endpoint is being called correctly from WordPress
- Check WordPress debug.log for API errors
- Query the database in Supabase SQL Editor: `SELECT * FROM bookshelf_books;`

## Performance Monitoring

### View Database Performance

1. Go to Supabase dashboard
2. Click **Database** → **Query Performance**
3. Monitor:
   - Query execution time
   - Most frequent queries
   - Cache hit rate
   - Connection pool usage

### Check API Performance

1. Go to Vercel dashboard
2. Click **Analytics** tab
3. Monitor:
   - Function execution time
   - Error rate
   - Invocation count

## Next Steps

Once API endpoints are verified:
1. ✅ Test end-to-end WordPress → API → Supabase flow
2. ✅ Deploy frontend pages (already included in deployment)
3. ✅ Configure subdomain `bookshelf.authorkit.pro` if needed
4. ✅ Add real books from your WordPress site

## Rollback Procedure

If deployment fails:

```bash
# Via Vercel Dashboard
# 1. Go to Deployments
# 2. Find previous successful deployment
# 3. Click "..." → "Promote to Production"

# Via CLI
vercel rollback
```

## Cost Monitoring

### Supabase Free Tier
- ✅ Free tier includes 500MB database storage
- ✅ 2GB bandwidth/month
- ✅ 50MB file storage
- ⚠️ **Database pauses after 7 days of inactivity** (~60s cold start)
- ✅ **Keepalive cron prevents pausing** (configured in `vercel.json`)

**Database Pausing Prevention:**
The Bookshelf includes a keepalive cron job that runs every 6 days:
- Endpoint: `/api/bookshelf/keepalive`
- Schedule: `0 0 */6 * *` (every 6 days at midnight)
- Action: Queries database to keep it active
- Vercel cron runs automatically in production

Monitor usage in Supabase **Settings** → **Usage** to track limits.

### Vercel Free Tier
- 100GB bandwidth/month
- 100 hours serverless execution/month
- ✅ **Cron jobs included** (keepalive runs automatically)
- Should be plenty for Bookshelf MVP

## Security Best Practices

✅ **Service role key is encrypted** in Vercel environment variables
✅ **SSL enforced** (all Supabase connections use HTTPS)
✅ **API keys can be rotated** in Supabase dashboard (Settings → API)
✅ **Row-level security (RLS)** configured with public read, service write
✅ **Service role bypasses RLS** for trusted backend operations

## Database Backup

Supabase Free tier doesn't include automated backups. Options:

### Manual Exports (Recommended for Free Tier)

Using Supabase dashboard:
1. Go to **Database** → **Backups**
2. Click **Download backup**
3. Save `.sql` file locally

Using `pg_dump` (if you have PostgreSQL tools installed):

```bash
# Get connection string from Supabase (Settings → Database)
pg_dump "postgresql://postgres:[password]@[host]:5432/postgres" > backup-$(date +%Y%m%d).sql
```

Run this weekly and store backups in Google Drive or S3.

### Automated Backups (Paid Plan)

Upgrade to Pro ($25/month) for:
- Daily automated backups
- Point-in-time recovery
- 7-day retention

## Going Live

Final checklist before opening to authors:

- [ ] All 5 API endpoints tested and working
- [ ] Database tables verified in PlanetScale
- [ ] Frontend pages loading correctly
- [ ] Test book syncs from WordPress successfully
- [ ] Environment variables set in Vercel
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Update affiliate tag in `js/bookshelf.js` if needed

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check PlanetScale query logs (Insights tab)
3. Verify environment variables are set correctly
4. Contact support@authorkit.pro with:
   - Error message
   - Vercel deployment URL
   - Steps to reproduce
