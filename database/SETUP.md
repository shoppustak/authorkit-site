# Supabase Database Setup for AuthorKit Bookshelf

This guide walks you through setting up the Supabase database for the AuthorKit Bookshelf feature.

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: `authorkit-bookshelf`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your target audience (e.g., US East for US audience)
   - **Pricing Plan**: Free tier is fine for MVP
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

## Step 2: Run the Schema SQL

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from this directory
4. Paste into the SQL editor
5. Click "Run" or press `Cmd/Ctrl + Enter`
6. Verify you see "Success. No rows returned" (this is expected)

## Step 3: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see 4 tables:
   - `bookshelf_sites`
   - `bookshelf_books`
   - `bookshelf_book_genres`
   - `bookshelf_genre_requests`

## Step 4: Get API Credentials

1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** under "Project Settings"
3. You'll see two important values:

### Project URL
```
https://your-project-id.supabase.co
```
Copy this - you'll need it as `SUPABASE_URL`

### API Keys

**anon / public key** (starts with `eyJ...`)
- This is safe to use in public client code
- Copy this - you'll need it as `SUPABASE_ANON_KEY`

**service_role key** (starts with `eyJ...`)
- ⚠️ **NEVER expose this publicly** - it bypasses RLS
- Copy this - you'll need it as `SUPABASE_SERVICE_KEY`
- This will be used server-side in Vercel API endpoints only

## Step 5: Add Environment Variables to Vercel

Once you have the credentials:

1. Go to your Vercel dashboard
2. Select the `authorkit-site` project
3. Go to **Settings** → **Environment Variables**
4. Add three variables:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `eyJ...` (anon key) | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | `eyJ...` (service_role key) | Production, Preview, Development |

5. Click "Save"

## Step 6: Test the Connection

After deploying the API endpoints, you can test the database connection by:

1. Making a test API call to `/api/bookshelf/register`
2. Checking the `bookshelf_sites` table in Supabase to see if the record was created
3. Check the Supabase **Logs** section for any errors

## Security Notes

✅ **Row Level Security (RLS)** is enabled on all tables
✅ Public read access is granted for books and genres (anonymous users can browse)
✅ Write access requires the service role key (only API endpoints have this)
✅ Service role key is only used server-side, never exposed to clients

## Troubleshooting

**Problem**: "relation does not exist" error
- **Solution**: Make sure you ran the SQL schema in the correct database

**Problem**: Permission denied errors
- **Solution**: Check that RLS policies are created correctly (re-run the schema SQL)

**Problem**: Can't connect from Vercel
- **Solution**: Verify environment variables are set correctly and redeployed

## Database Maintenance

### Backup
Supabase automatically backs up your database daily. You can also manually create backups in the **Database** → **Backups** section.

### Monitoring
Monitor database usage in **Settings** → **Usage**. Free tier includes:
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth

For production, consider upgrading to Pro ($25/month) for:
- 8 GB database space
- 100 GB file storage
- 250 GB bandwidth
- Daily backups retained for 7 days
