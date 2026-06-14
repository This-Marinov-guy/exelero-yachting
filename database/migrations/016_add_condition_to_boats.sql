-- Migration: Add condition to boat listings
-- Date: 2026
-- Description: Classifies boat listings as new or pre-owned for listing filters and direct links

ALTER TABLE boat_data
  ADD COLUMN IF NOT EXISTS condition text NOT NULL DEFAULT 'pre-owned';

ALTER TABLE boat_data
  DROP CONSTRAINT IF EXISTS boat_data_condition_check;

ALTER TABLE boat_data
  ADD CONSTRAINT boat_data_condition_check
  CHECK (condition IN ('new', 'pre-owned'));

ALTER TABLE boat_drafts
  ADD COLUMN IF NOT EXISTS condition text;

ALTER TABLE boat_drafts
  DROP CONSTRAINT IF EXISTS boat_drafts_condition_check;

ALTER TABLE boat_drafts
  ADD CONSTRAINT boat_drafts_condition_check
  CHECK (condition IS NULL OR condition IN ('new', 'pre-owned'));

CREATE INDEX IF NOT EXISTS idx_boat_data_condition ON boat_data(condition);
