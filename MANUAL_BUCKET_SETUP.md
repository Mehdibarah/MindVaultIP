# Manual Bucket Setup (Alternative)

If you prefer to set up the bucket manually through the Supabase dashboard instead of running SQL:

## Method 1: Supabase Dashboard

1. **Go to your Supabase project:**
   - https://supabase.com/dashboard/project/ycivhrsvatslktkxqtrh

2. **Navigate to Storage:**
   - Click "Storage" in the left sidebar

3. **Create New Bucket:**
   - Click "New bucket"
   - Name: `awards`
   - Make it **Public** ✅
   - File size limit: `10485760` (10MB)
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

4. **Set up RLS Policies:**
   - Go to "Authentication" → "Policies"
   - Find the `storage.objects` table
   - Create these policies:

   **Public Read Policy:**
   ```
   Name: awards_public_read
   Operation: SELECT
   Target roles: public
   USING expression: bucket_id = 'awards'
   ```

   **Authenticated Write Policy:**
   ```
   Name: awards_authenticated_write
   Operation: INSERT
   Target roles: authenticated
   WITH CHECK expression: bucket_id = 'awards' AND auth.role() = 'authenticated'
   ```

## Method 2: Quick SQL (Recommended)

Just run this simple SQL in your Supabase SQL Editor:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('awards', 'awards', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']);

-- Create public read policy
CREATE POLICY "awards_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'awards');

-- Create authenticated write policy  
CREATE POLICY "awards_authenticated_write" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'awards' AND auth.role() = 'authenticated');
```

## Test Your Setup

After either method, run:
```bash
node diagnose-storage.js
```

You should see:
- ✅ Bucket 'awards' exists
- ✅ Storage access successful
