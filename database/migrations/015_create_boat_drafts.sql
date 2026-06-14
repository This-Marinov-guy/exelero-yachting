-- Migration: Create boat_drafts table
-- Date: 2026
-- Description: Stores in-progress boat listings so users can save and resume editing

CREATE TABLE boat_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  type text,
  condition text,
  manufacturer text,
  build_number text,
  build_year text,
  location text,
  price integer,
  vat_included boolean DEFAULT false,
  description text,
  hull_length numeric,
  waterline_length numeric,
  beam numeric,
  draft numeric,
  ballast integer,
  displacement integer,
  engine_power numeric,
  fuel_tank integer,
  water_tank integer,
  brochure text,
  brochure_file_name text,
  additional_details text,
  dealer_id uuid,
  upload_folder_name text,
  images jsonb DEFAULT '[]',
  main_image_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE boat_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own drafts" ON boat_drafts FOR ALL USING (auth.uid() = user_id);
