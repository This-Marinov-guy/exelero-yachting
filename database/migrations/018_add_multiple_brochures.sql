-- Migration: Add multiple brochure uploads
-- Date: 2026
-- Description: Stores multiple brochure files while preserving the legacy primary brochure URL

ALTER TABLE boat_data
  ADD COLUMN IF NOT EXISTS brochures jsonb DEFAULT '[]'::jsonb;

ALTER TABLE boat_drafts
  ADD COLUMN IF NOT EXISTS brochures jsonb DEFAULT '[]'::jsonb;
