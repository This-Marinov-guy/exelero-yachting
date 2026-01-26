# Database Migrations

This directory contains SQL migration files for the Excelero Yachting database.

## Migration Files

### 001_create_storage_buckets.sql
Documents storage bucket setup and RLS policy definitions for:
- `profile_images` - User profile images
- `boat_images` - Boat images

**Note:** This file documents the required setup. Storage buckets and RLS policies must be created via the Supabase Dashboard (see `STORAGE_RLS_SETUP.md`).

### 002_fix_profile_images_rls.sql
Additional documentation for fixing profile images RLS policies if upload issues occur.

### STORAGE_RLS_SETUP.md
**IMPORTANT:** Step-by-step guide for setting up storage RLS policies via the Supabase Dashboard.

## How to Apply Migrations

### Via Supabase Dashboard

1. **Create Storage Buckets:**
   - Go to Storage in your Supabase Dashboard
   - Create two buckets:
     - `profile_images` (Public, 5MB limit, image types only)
     - `boat_images` (Public, 10MB limit, image types only)

2. **Apply RLS Policies:**
   - **IMPORTANT:** Storage RLS policies CANNOT be created via SQL
   - Go to Storage > Policies in Supabase Dashboard
   - Create policies manually for each bucket (see `STORAGE_RLS_SETUP.md` for detailed instructions)
   - Or use the policy definitions documented in the migration files

### Via Supabase CLI

```bash
# Apply migration
supabase db push

# Or apply specific migration
supabase migration up 001_create_storage_buckets
```

### Manual Application

**For Database Tables:**
1. Open Supabase Dashboard > SQL Editor
2. Copy the contents of `database_schema.sql`
3. Execute the SQL

**For Storage Buckets and RLS Policies:**
1. Create buckets via Storage > New bucket in Dashboard
2. Create RLS policies via Storage > Policies in Dashboard
3. See `STORAGE_RLS_SETUP.md` for detailed instructions

## Storage Bucket Setup

### profile_images Bucket
- **Name:** `profile_images`
- **Public:** Yes
- **File Size Limit:** 5MB
- **Allowed MIME Types:** image/jpeg, image/jpg, image/png, image/webp
- **Path Structure:** `profile_images/{user_id}/{timestamp}.{ext}`

### boat_images Bucket
- **Name:** `boat_images`
- **Public:** Yes
- **File Size Limit:** 10MB
- **Allowed MIME Types:** image/jpeg, image/jpg, image/png, image/webp
- **Path Structure:** `boat_images/{boat_id}/{timestamp}.{ext}`

## RLS Policies

**IMPORTANT:** Storage RLS policies must be created via the Supabase Dashboard, not SQL.

The migration files document the required RLS policies to ensure:
- Users can only upload/update/delete their own profile images
- Authenticated users can manage boat images
- Public read access for both buckets (for displaying images)

**See `STORAGE_RLS_SETUP.md` for step-by-step instructions on creating these policies.**

## Helper Functions

The migration also includes helper functions:
- `get_user_profile_image_url(user_uuid)` - Get a user's profile image URL
- `get_boat_images_urls(boat_uuid)` - Get all image URLs for a boat
