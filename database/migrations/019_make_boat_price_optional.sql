-- Migration: Make boat price optional
-- Date: 2026
-- Description: Allows listings to omit price and display "Price upon inquiry"

ALTER TABLE boat_data
  ALTER COLUMN price DROP NOT NULL;
