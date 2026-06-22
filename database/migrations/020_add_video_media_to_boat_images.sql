-- Migration: Add video media support to boat images
-- Date: 2026
-- Description: Allows boat media gallery items to be either images or videos

ALTER TABLE boat_images
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';

ALTER TABLE boat_images
  DROP CONSTRAINT IF EXISTS boat_images_media_type_check;

ALTER TABLE boat_images
  ADD CONSTRAINT boat_images_media_type_check
  CHECK (media_type IN ('image', 'video'));
