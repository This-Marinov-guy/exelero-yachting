# Storage RLS Policies Setup Guide

## Important Note

**Storage RLS policies cannot be created via SQL in Supabase.** You must create them through the Supabase Dashboard or Management API.

## Quick Setup via Dashboard

### For `profile_images` Bucket

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Select the **`profile_images`** bucket
3. Click **"New Policy"** and create the following policies:

#### Policy 1: Upload (INSERT)
- **Policy Name:** `Users can upload own profile images`
- **Allowed Operation:** `INSERT`
- **Target Roles:** `authenticated`
- **Policy Definition (WITH CHECK):**
  ```sql
  bucket_id = 'profile_images' AND
  ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))
  ```

#### Policy 2: Update (UPDATE)
- **Policy Name:** `Users can update own profile images`
- **Allowed Operation:** `UPDATE`
- **Target Roles:** `authenticated`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'profile_images' AND
  ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))
  ```
- **Policy Definition (WITH CHECK):**
  ```sql
  bucket_id = 'profile_images' AND
  ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))
  ```

#### Policy 3: Delete (DELETE)
- **Policy Name:** `Users can delete own profile images`
- **Allowed Operation:** `DELETE`
- **Target Roles:** `authenticated`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'profile_images' AND
  ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))
  ```

#### Policy 4: View (SELECT)
- **Policy Name:** `Public can view profile images`
- **Allowed Operation:** `SELECT`
- **Target Roles:** `public`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'profile_images'
  ```

### For `boat_images` Bucket

1. Go to **Supabase Dashboard** → **Storage** → **Policies**
2. Select the **`boat_images`** bucket
3. Click **"New Policy"** and create the following policies:

#### Policy 1: Upload (INSERT)
- **Policy Name:** `Authenticated users can upload boat images`
- **Allowed Operation:** `INSERT`
- **Target Roles:** `authenticated`
- **Policy Definition (WITH CHECK):**
  ```sql
  bucket_id = 'boat_images'
  ```

#### Policy 2: Update (UPDATE)
- **Policy Name:** `Authenticated users can update boat images`
- **Allowed Operation:** `UPDATE`
- **Target Roles:** `authenticated`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'boat_images'
  ```
- **Policy Definition (WITH CHECK):**
  ```sql
  bucket_id = 'boat_images'
  ```

#### Policy 3: Delete (DELETE)
- **Policy Name:** `Authenticated users can delete boat images`
- **Allowed Operation:** `DELETE`
- **Target Roles:** `authenticated`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'boat_images'
  ```

#### Policy 4: View (SELECT)
- **Policy Name:** `Public can view boat images`
- **Allowed Operation:** `SELECT`
- **Target Roles:** `public`
- **Policy Definition (USING):**
  ```sql
  bucket_id = 'boat_images'
  ```

## Path Structure

- **profile_images:** Files should be uploaded to `{user_id}/{filename}`
  - Example: `550e8400-e29b-41d4-a716-446655440000/1234567890.jpg`
  
- **boat_images:** Files should be uploaded to `{boat_id}/{filename}`
  - Example: `660e8400-e29b-41d4-a716-446655440000/1234567890.jpg`

## Troubleshooting

If you're still getting RLS policy errors after setting up the policies:

1. **Verify the bucket exists:** Go to Storage → Buckets and confirm `profile_images` exists
2. **Check RLS is enabled:** The bucket should have RLS enabled (it's enabled by default for new buckets)
3. **Verify policy syntax:** Make sure you copied the policy definitions exactly as shown
4. **Check user authentication:** Ensure the user is properly authenticated when uploading
5. **Verify path structure:** The file path must match the expected structure (`{user_id}/{filename}`)

## Testing

After setting up the policies, test by:
1. Sign in to your application
2. Try uploading a profile image
3. Check the browser console for any errors
4. Verify the image appears in Storage → `profile_images` bucket
