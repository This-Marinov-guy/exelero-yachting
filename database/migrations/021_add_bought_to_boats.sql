-- Migration: Add bought status to boats
-- Date: 2026
-- Description: Allows listings to be marked as bought/sold and excluded from public brokerage pages

ALTER TABLE boats
  ADD COLUMN IF NOT EXISTS bought boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_boats_active_bought ON boats(active, bought);

COMMENT ON COLUMN boats.bought IS 'Indicates whether the boat has been bought/sold and should be hidden from public brokerage listings.';
