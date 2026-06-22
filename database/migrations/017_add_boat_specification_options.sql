-- Migration: Add boat specification select options
-- Date: 2026
-- Description: Stores keel type, CE design category, and hull material for listings and drafts

ALTER TABLE boat_data
  ADD COLUMN IF NOT EXISTS keel_type text NOT NULL DEFAULT 'Fin Keel',
  ADD COLUMN IF NOT EXISTS ce_design_category text NOT NULL DEFAULT 'A - Ocean',
  ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT 'GRP';

ALTER TABLE boat_data
  DROP CONSTRAINT IF EXISTS boat_data_keel_type_check,
  DROP CONSTRAINT IF EXISTS boat_data_ce_design_category_check,
  DROP CONSTRAINT IF EXISTS boat_data_material_check;

ALTER TABLE boat_data
  ADD CONSTRAINT boat_data_keel_type_check
  CHECK (keel_type IN ('Fin Keel', 'Bulb Keel', 'Winged keel', 'Long keel', 'Bilge Keel', 'Keel Sword', 'Canting Keel', 'Swiveling Keel', 'Lifting Keel')),
  ADD CONSTRAINT boat_data_ce_design_category_check
  CHECK (ce_design_category IN ('A - Ocean', 'B - Offshore', 'C - Inshore', 'D - Sheltered Waters')),
  ADD CONSTRAINT boat_data_material_check
  CHECK (material IN ('GRP', 'Wood', 'Aluminium', 'Steel', 'Polyethylene', 'Ferro Cement', 'Carbon Fiber'));

ALTER TABLE boat_drafts
  ADD COLUMN IF NOT EXISTS keel_type text,
  ADD COLUMN IF NOT EXISTS ce_design_category text,
  ADD COLUMN IF NOT EXISTS material text;

ALTER TABLE boat_drafts
  DROP CONSTRAINT IF EXISTS boat_drafts_keel_type_check,
  DROP CONSTRAINT IF EXISTS boat_drafts_ce_design_category_check,
  DROP CONSTRAINT IF EXISTS boat_drafts_material_check;

ALTER TABLE boat_drafts
  ADD CONSTRAINT boat_drafts_keel_type_check
  CHECK (keel_type IS NULL OR keel_type IN ('Fin Keel', 'Bulb Keel', 'Winged keel', 'Long keel', 'Bilge Keel', 'Keel Sword', 'Canting Keel', 'Swiveling Keel', 'Lifting Keel')),
  ADD CONSTRAINT boat_drafts_ce_design_category_check
  CHECK (ce_design_category IS NULL OR ce_design_category IN ('A - Ocean', 'B - Offshore', 'C - Inshore', 'D - Sheltered Waters')),
  ADD CONSTRAINT boat_drafts_material_check
  CHECK (material IS NULL OR material IN ('GRP', 'Wood', 'Aluminium', 'Steel', 'Polyethylene', 'Ferro Cement', 'Carbon Fiber'));
