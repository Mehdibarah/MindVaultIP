# Setup Supabase Proofs Table

The application requires a `proofs` table in your Supabase database.

## Quick Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-proofs-schema.sql`
4. Click **Run**

## What This Creates

- **Table**: `public.proofs` with all required fields
- **RLS Policies**: Row-level security for public/private proofs
- **Indexes**: For better query performance
- **Triggers**: Auto-update `updated_at` timestamp

## Verification

After running the SQL, verify the table was created:

```sql
SELECT * FROM public.proofs LIMIT 1;
```

You should see an empty table (no errors).

## Troubleshooting

If you see "relation does not exist" errors:
1. Make sure you're connected to the correct Supabase project
2. Check that the SQL ran without errors
3. Verify the table exists: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'proofs';`

