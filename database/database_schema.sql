-- Database Schema for Excelero Yachting
-- PostgreSQL/Supabase compatible

-- Main boats table
CREATE TABLE IF NOT EXISTS boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boat data table (one-to-one relationship with boats)
CREATE TABLE IF NOT EXISTS boat_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID UNIQUE NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    title VARCHAR(512) NOT NULL,
    manufacturer VARCHAR(512),
    build_number VARCHAR(100),
    build_year VARCHAR(4),
    location VARCHAR(512),
    price INTEGER,
    vat_included BOOLEAN DEFAULT TRUE,
    dealer VARCHAR(512),
    description TEXT,
    designer VARCHAR(512),
    hull_length DOUBLE PRECISION,
    waterline_length DOUBLE PRECISION,
    beam DOUBLE PRECISION,
    draft DOUBLE PRECISION,
    ballast INTEGER,
    displacement INTEGER,
    engine_power DOUBLE PRECISION,
    fuel_tank INTEGER,
    water_tank INTEGER,
    brochure VARCHAR(500),
    exterior_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker data table (one-to-many relationship with boats)
CREATE TABLE IF NOT EXISTS broker_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    name VARCHAR(512) NOT NULL,
    email VARCHAR(512) NOT NULL,
    phone VARCHAR(50),
    dealer VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries table (one-to-one relationship with boats)
-- Note: "inqueries" is kept as per user request, though "inquiries" is the standard spelling
CREATE TABLE IF NOT EXISTS inqueries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID UNIQUE NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    name VARCHAR(512) NOT NULL,
    country VARCHAR(100),
    email VARCHAR(512) NOT NULL,
    phone VARCHAR(50),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boat images table (many-to-one relationship with boats)
CREATE TABLE IF NOT EXISTS boat_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    link VARCHAR(1000) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_boat_data_boat_id ON boat_data(boat_id);
CREATE INDEX IF NOT EXISTS idx_broker_data_boat_id ON broker_data(boat_id);
CREATE INDEX IF NOT EXISTS idx_inqueries_boat_id ON inqueries(boat_id);
CREATE INDEX IF NOT EXISTS idx_boat_images_boat_id ON boat_images(boat_id);
CREATE INDEX IF NOT EXISTS idx_boat_images_display_order ON boat_images(boat_id, display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON boats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boat_data_updated_at BEFORE UPDATE ON boat_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_data_updated_at BEFORE UPDATE ON broker_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inqueries_updated_at BEFORE UPDATE ON inqueries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boat_images_updated_at BEFORE UPDATE ON boat_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add email validation constraint for broker_data
ALTER TABLE broker_data ADD CONSTRAINT broker_data_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add email validation constraint for inqueries
ALTER TABLE inqueries ADD CONSTRAINT inqueries_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
