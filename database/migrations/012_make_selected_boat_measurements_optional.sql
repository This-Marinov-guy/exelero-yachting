-- Migration: Make selected boat measurement fields optional
-- Description: Allows listings to omit waterline length, ballast, fuel tank, and water tank.

ALTER TABLE boat_data
    ALTER COLUMN waterline_length DROP NOT NULL,
    ALTER COLUMN ballast DROP NOT NULL,
    ALTER COLUMN fuel_tank DROP NOT NULL,
    ALTER COLUMN water_tank DROP NOT NULL;
