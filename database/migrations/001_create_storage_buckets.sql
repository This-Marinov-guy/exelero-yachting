-- Migration: Create Storage Buckets for Profile Images and Boat Images
-- Date: 2024
-- Description: Creates storage buckets and RLS policies for profile_images and boat_images

-- ============================================================================
-- NOTE: Storage buckets must be created via Supabase Dashboard or API
-- This migration file documents the required setup and RLS policies
-- ============================================================================

-- ============================================================================
-- BUCKET 1: profile_images
-- ============================================================================
-- Purpose: Store user profile images
-- Path structure: profile_images/{user_id}/{timestamp}.{ext}
-- 
-- To create via Supabase Dashboard:
-- 1. Go to Storage > New bucket
-- 2. Name: profile_images
-- 3. Public: Yes (to allow public URLs)
-- 4. File size limit: 5MB
-- 5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
--
-- Or via SQL (requires superuser):
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'profile_images',
--   'profile_images',
--   true,
--   5242880, -- 5MB in bytes
--   ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
-- );

-- RLS Policies for profile_images bucket
-- ============================================================================
-- IMPORTANT: Storage RLS policies CANNOT be created via SQL in Supabase.
-- You MUST create them through the Supabase Dashboard.
-- 
-- Go to: Storage > Policies > profile_images > New Policy
-- 
-- See STORAGE_RLS_SETUP.md for detailed step-by-step instructions.
-- ============================================================================

-- Policy Definitions (copy these to Dashboard when creating policies):

-- Policy 1: Users can upload their own profile images
-- Name: "Users can upload own profile images"
-- Operation: INSERT
-- Roles: authenticated
-- WITH CHECK:
--   bucket_id = 'profile_images' AND
--   ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))

-- Policy 2: Users can update their own profile images
-- Name: "Users can update own profile images"
-- Operation: UPDATE
-- Roles: authenticated
-- USING:
--   bucket_id = 'profile_images' AND
--   ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))
-- WITH CHECK:
--   bucket_id = 'profile_images' AND
--   ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))

-- Policy 3: Users can delete their own profile images
-- Name: "Users can delete own profile images"
-- Operation: DELETE
-- Roles: authenticated
-- USING:
--   bucket_id = 'profile_images' AND
--   ((storage.foldername(name))[1] = auth.uid()::text OR name LIKE (auth.uid()::text || '/%'))

-- Policy 4: Public can view profile images
-- Name: "Public can view profile images"
-- Operation: SELECT
-- Roles: public
-- USING:
--   bucket_id = 'profile_images'

-- ============================================================================
-- BUCKET 2: boat_images
-- ============================================================================
-- Purpose: Store boat images
-- Path structure: boat_images/{boat_id}/{timestamp}.{ext}
--
-- To create via Supabase Dashboard:
-- 1. Go to Storage > New bucket
-- 2. Name: boat_images
-- 3. Public: Yes (to allow public URLs)
-- 4. File size limit: 10MB (boats may have larger images)
-- 5. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
--
-- Or via SQL (requires superuser):
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'boat_images',
--   'boat_images',
--   true,
--   10485760, -- 10MB in bytes
--   ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
-- );

-- RLS Policies for boat_images bucket
-- ============================================================================
-- IMPORTANT: Storage RLS policies CANNOT be created via SQL in Supabase.
-- You MUST create them through the Supabase Dashboard.
-- 
-- Go to: Storage > Policies > boat_images > New Policy
-- 
-- See STORAGE_RLS_SETUP.md for detailed step-by-step instructions.
-- ============================================================================

-- Policy Definitions (copy these to Dashboard when creating policies):

-- Policy 1: Authenticated users can upload boat images
-- Name: "Authenticated users can upload boat images"
-- Operation: INSERT
-- Roles: authenticated
-- WITH CHECK:
--   bucket_id = 'boat_images'

-- Policy 2: Authenticated users can update boat images
-- Name: "Authenticated users can update boat images"
-- Operation: UPDATE
-- Roles: authenticated
-- USING:
--   bucket_id = 'boat_images'
-- WITH CHECK:
--   bucket_id = 'boat_images'

-- Policy 3: Authenticated users can delete boat images
-- Name: "Authenticated users can delete boat images"
-- Operation: DELETE
-- Roles: authenticated
-- USING:
--   bucket_id = 'boat_images'

-- Policy 4: Public can view boat images
-- Name: "Public can view boat images"
-- Operation: SELECT
-- Roles: public
-- USING:
--   bucket_id = 'boat_images'

-- ============================================================================
-- HELPER FUNCTION: Get user's profile image URL
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_profile_image_url(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT image_url
  FROM profile_image
  WHERE user_id = user_uuid
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- HELPER FUNCTION: Get boat images URLs
-- ============================================================================
CREATE OR REPLACE FUNCTION get_boat_images_urls(boat_uuid UUID)
RETURNS TABLE(image_url TEXT, display_order INTEGER) AS $$
  SELECT link, display_order
  FROM boat_images
  WHERE boat_id = boat_uuid
  ORDER BY display_order ASC, created_at ASC;
$$ LANGUAGE sql STABLE;
