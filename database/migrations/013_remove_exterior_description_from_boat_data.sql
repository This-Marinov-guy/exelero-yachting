-- Migration: Remove exterior_description from boat_data
ALTER TABLE boat_data DROP COLUMN IF EXISTS exterior_description;
