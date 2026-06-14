-- Migration: Add is_cover flag to boat_images
ALTER TABLE boat_images ADD COLUMN IF NOT EXISTS is_cover BOOLEAN NOT NULL DEFAULT FALSE;
