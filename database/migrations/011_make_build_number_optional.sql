-- Migration: Make build number optional
-- Description: Allows boat listings to be saved without a build number.

ALTER TABLE boat_data
    ALTER COLUMN build_number DROP NOT NULL;
