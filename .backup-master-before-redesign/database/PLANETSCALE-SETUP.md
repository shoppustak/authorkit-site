# PlanetScale Database Setup for AuthorKit Bookshelf

This guide walks you through setting up PlanetScale (MySQL) for the AuthorKit Bookshelf feature.

## Why PlanetScale?

✅ **Free tier with NO PAUSING** (unlike Supabase)
✅ **5GB storage** - plenty for thousands of books
✅ **1 billion row reads/month** - more than enough for bookshelf
✅ **Production-ready** - designed for real applications
✅ **No cold starts** - always fast
✅ **Built-in branching** - safe schema changes

---

## Step 1: Create PlanetScale Account & Database

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub (easiest) or email
3. Click **"New database"**
4. Fill in the details:
   - **Name**: `authorkit-bookshelf`
   - **Region**: Choose closest to your users (e.g., `us-east` for US)
   - **Plan**: **Hobby** (free - no credit card required)
5. Click **"Create database"**
6. Wait ~30 seconds for provisioning

---

## Step 2: Create the Schema

PlanetScale uses branches (like Git). Your database starts with a `main` branch.

### Option A: Using the Web Console (Recommended)

1. In your database dashboard, click **"Console"** tab
2. Make sure you're on the `main` branch (shown at top)
3. Copy the entire contents of `planetscale-schema.sql` from this directory
4. Paste into the console
5. Click **"Execute"** or press `Cmd/Ctrl + Enter`
6. You should see "Query executed successfully" 4 times (one per table)

### Option B: Using the CLI (Advanced)

```bash
# Install PlanetScale CLI
brew install planetscale/tap/pscale

# Authenticate
pscale auth login

# Connect to database
pscale shell authorkit-bookshelf main

# Paste schema SQL and execute
```

---

## Step 3: Verify Tables Created

1. In PlanetScale dashboard, click **"Branches"**
2. Click on `main` branch
3. Click **"Schema"** tab
4. You should see 4 tables:
   - `bookshelf_sites`
   - `bookshelf_books`
   - `bookshelf_book_genres`
   - `bookshelf_genre_requests`

---

## Step 4: Get Connection String

PlanetScale uses connection strings instead of separate URL/keys.

1. In your database dashboard, click **"Connect"**
2. Select **"Connect with"** → **"@planetscale/database"** (Node.js)
3. Click **"New password"** button
4. Give it a name: `vercel-production`
5. Click **"Create password"**

You'll see something like:

```javascript
DATABASE_URL="mysql://xxxxxxxx:pscale_pw_xxxxxxxx@aws.connect.psdb.cloud/authorkit-bookshelf?sslaccept=strict"
```

**IMPORTANT**: Copy this URL immediately - it's shown only once!

---

## Step 5: Add Environment Variable to Vercel

1. Go to your Vercel dashboard
2. Select the `authorkit-site` project
3. Go to **Settings** → **Environment Variables**
4. Add **ONE** variable:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `mysql://xxxxxxxx:pscale_pw_xxxxxxxx@...` | Production, Preview, Development |

5. Click **"Save"**

That's it! No need for separate URL/key/service key like Supabase.

---

## Step 6: Deploy to Vercel

```bash
# Make sure dependencies are installed
cd authorkit-site
npm install

# Commit changes
git add .
git commit -m "feat: migrate to PlanetScale database"
git push origin master
```

Vercel will automatically deploy with the new `DATABASE_URL` environment variable.

---

## Step 7: Test the Connection

After deployment, test with cURL:

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

---

## Step 8: Verify in PlanetScale

1. Go to PlanetScale dashboard → **Console**
2. Run this query:

```sql
SELECT * FROM bookshelf_sites;
```

You should see your test site!

---

## Managing Schema Changes (Production)

PlanetScale uses **safe schema migrations** with branches:

### Making Schema Changes

1. Create a development branch:
   ```bash
   pscale branch create authorkit-bookshelf dev
   ```

2. Make schema changes on the `dev` branch (via Console or CLI)

3. Create a deploy request (like a pull request):
   ```bash
   pscale deploy-request create authorkit-bookshelf dev
   ```

4. Review and deploy the changes to `main`

This prevents accidental schema changes in production!

---

## Security Notes

✅ **Connection strings are encrypted** in Vercel environment variables
✅ **SSL enforced** (`sslaccept=strict` in connection string)
✅ **Passwords can be rotated** in PlanetScale dashboard
✅ **Branch-based access control** - only `main` is production

---

## PlanetScale Free Tier Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| **Storage** | 5 GB | Enough for ~50,000 books with covers |
| **Row reads** | 1 billion/month | ~385 reads/second average |
| **Row writes** | 10 million/month | ~4 writes/second average |
| **Databases** | 1 | Plenty for AuthorKit |
| **Branches** | 1 production | Use for safe schema changes |

For the Bookshelf use case, free tier is **more than sufficient** unless you get massive traffic.

---

## Upgrading to Paid (Optional)

If you exceed free limits (unlikely), upgrade to **Scaler** ($29/month):

- 25 GB storage
- 100 billion row reads/month
- 50 million row writes/month
- Multiple databases
- More branches
- Better performance

---

## Troubleshooting

### Error: "Connection refused"

**Solution**:
- Verify `DATABASE_URL` is set correctly in Vercel
- Check that you copied the full connection string (including password)
- Redeploy after adding environment variable

### Error: "Table doesn't exist"

**Solution**:
- Run the schema SQL in PlanetScale Console
- Verify you're on the `main` branch when running schema
- Check the Schema tab to confirm tables exist

### Error: "Access denied"

**Solution**:
- Create a new password in PlanetScale Connect modal
- Use the new connection string in Vercel
- Redeploy

### Slow Queries (Unlikely)

**Solution**:
- Check PlanetScale **Insights** tab for query performance
- All necessary indexes are already in the schema
- Consider upgrading to Scaler plan for better performance

---

## Monitoring

### View Query Performance

1. Go to PlanetScale dashboard
2. Click **"Insights"** tab
3. See:
   - Query performance
   - Slow queries
   - Row reads/writes usage
   - Storage usage

### Check Usage

1. Go to **"Settings"** → **"Usage"**
2. Monitor:
   - Storage consumed
   - Row reads this month
   - Row writes this month

You'll get email alerts if you approach limits.

---

## Backup Strategy

PlanetScale Free tier doesn't include automated backups, but you have options:

### Option 1: Manual Exports (Free)

```bash
# Export all data to SQL
pscale dump authorkit-bookshelf main --output backup.sql
```

Run this weekly/monthly and store in Google Drive or S3.

### Option 2: Automated Backups (Paid)

Upgrade to **Scaler** ($29/month) for:
- Daily automated backups
- 7-day retention
- One-click restore

### Option 3: Application-Level Backups

Add a cron job to export data via API and store externally.

---

## Migration from Supabase (If Needed)

If you already have data in Supabase:

1. Export from Supabase:
   ```sql
   COPY (SELECT * FROM bookshelf_sites) TO '/tmp/sites.csv' WITH CSV HEADER;
   ```

2. Import to PlanetScale using CLI or Console

Need help? Contact support@authorkit.pro

---

## Conclusion

PlanetScale setup is complete! Your database:
- ✅ Never pauses (free tier)
- ✅ Scales automatically
- ✅ Production-ready
- ✅ Fast globally

Next: Test end-to-end WordPress → API → PlanetScale flow!
