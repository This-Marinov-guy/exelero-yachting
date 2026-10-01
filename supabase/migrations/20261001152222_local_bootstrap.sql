-- Database Schema for Excelero Yachting
-- PostgreSQL/Supabase compatible

-- Main boats table
CREATE TABLE IF NOT EXISTS boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    bought BOOLEAN NOT NULL DEFAULT FALSE,
    slug TEXT NOT NULL,
    dealer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boat data table (one-to-one relationship with boats)
CREATE TABLE IF NOT EXISTS boat_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID UNIQUE NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    condition VARCHAR(20) NOT NULL DEFAULT 'pre-owned' CHECK (condition IN ('new', 'pre-owned')),
    keel_type VARCHAR(50) NOT NULL DEFAULT 'Fin Keel' CHECK (keel_type IN ('Fin Keel', 'Bulb Keel', 'Winged keel', 'Long keel', 'Bilge Keel', 'Keel Sword', 'Canting Keel', 'Swiveling Keel', 'Lifting Keel')),
    ce_design_category VARCHAR(50) NOT NULL DEFAULT 'A - Ocean' CHECK (ce_design_category IN ('A - Ocean', 'B - Offshore', 'C - Inshore', 'D - Sheltered Waters')),
    material VARCHAR(50) NOT NULL DEFAULT 'GRP' CHECK (material IN ('GRP', 'Wood', 'Aluminium', 'Steel', 'Polyethylene', 'Ferro Cement', 'Carbon Fiber')),
    title VARCHAR(512) NOT NULL,
    manufacturer VARCHAR(512) NOT NULL,
    build_number VARCHAR(100),
    build_year VARCHAR(4) NOT NULL,
    location VARCHAR(512) NOT NULL,
    price INTEGER,
    vat_included BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    hull_length DOUBLE PRECISION NOT NULL,
    waterline_length DOUBLE PRECISION,
    beam DOUBLE PRECISION NOT NULL,
    draft DOUBLE PRECISION NOT NULL,
    ballast INTEGER,
    displacement INTEGER NOT NULL,
    engine_power DOUBLE PRECISION NOT NULL,
    fuel_tank INTEGER,
    water_tank INTEGER,
    brochure VARCHAR(500), -- Optional primary brochure URL
    brochures JSONB DEFAULT '[]'::jsonb,
    exterior_description TEXT NOT NULL,
    additional_details TEXT, -- Optional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker data table (one-to-many relationship with boats, one-to-many relationship with auth.users)
-- Note: boat_id is nullable to allow dealers to exist independently before being linked to a boat
CREATE TABLE IF NOT EXISTS broker_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boat_id UUID REFERENCES boats(id) ON DELETE CASCADE, -- Nullable: allows dealers to exist without boats
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(512) NOT NULL,
    email VARCHAR(512) NOT NULL,
    phone VARCHAR(50),
    dealer VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'boats_dealer_id_fkey'
    ) THEN
        ALTER TABLE boats
            ADD CONSTRAINT boats_dealer_id_fkey
            FOREIGN KEY (dealer_id) REFERENCES broker_data(id) ON DELETE SET NULL;
    END IF;
END $$;

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
    media_type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile image table (one-to-one relationship with auth.users)
CREATE TABLE IF NOT EXISTS profile_image (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_boats_user_id ON boats(user_id);
CREATE INDEX IF NOT EXISTS idx_boats_active_bought ON boats(active, bought);
CREATE UNIQUE INDEX IF NOT EXISTS idx_boats_slug_unique ON boats(slug);
CREATE INDEX IF NOT EXISTS idx_boats_dealer_id ON boats(dealer_id);
CREATE INDEX IF NOT EXISTS idx_boat_data_boat_id ON boat_data(boat_id);
CREATE INDEX IF NOT EXISTS idx_boat_data_condition ON boat_data(condition);
CREATE INDEX IF NOT EXISTS idx_broker_data_boat_id ON broker_data(boat_id);
CREATE INDEX IF NOT EXISTS idx_broker_data_user_id ON broker_data(user_id);
CREATE INDEX IF NOT EXISTS idx_inqueries_boat_id ON inqueries(boat_id);
CREATE INDEX IF NOT EXISTS idx_boat_images_boat_id ON boat_images(boat_id);
CREATE INDEX IF NOT EXISTS idx_boat_images_display_order ON boat_images(boat_id, display_order);
CREATE INDEX IF NOT EXISTS idx_profile_image_user_id ON profile_image(user_id);

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

CREATE TRIGGER update_profile_image_updated_at BEFORE UPDATE ON profile_image
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add email validation constraint for broker_data
ALTER TABLE broker_data ADD CONSTRAINT broker_data_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add email validation constraint for inqueries
ALTER TABLE inqueries ADD CONSTRAINT inqueries_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
-- Migration: Remove exterior_description from boat_data
ALTER TABLE boat_data DROP COLUMN IF EXISTS exterior_description;
-- 008_create_charter_requests.sql
-- Charter lead form storage

begin;

create table if not exists public.charter_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  name         text not null,
  email        text not null,
  phone        text,

  charter_type text not null check (charter_type in ('cruiser', 'power_boat', 'racer', 'yacht')),
  date_from    date not null,
  date_to      date not null,

  group_size   integer not null check (group_size > 0),
  note         text,
  status       text not null default 'new'
);

alter table public.charter_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'charter_requests'
      and policyname = 'charter_requests_insert_anon'
  ) then
    create policy charter_requests_insert_anon
      on public.charter_requests
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;

-- 009_create_transportation_requests.sql
-- Transportation lead form storage

begin;

create table if not exists public.transportation_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  name           text not null,
  email          text not null,
  phone          text,

  date_start     date not null,
  deadline_date  date not null,

  start_point    text,
  end_point      text,

  boat_weight_kg numeric,
  boat_length_m  numeric,
  boat_beam_m    numeric,
  boat_draft_m   numeric,
  boat_height_m  numeric,

  note           text,
  status         text not null default 'new'
);

alter table public.transportation_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'transportation_requests'
      and policyname = 'transportation_requests_insert_anon'
  ) then
    create policy transportation_requests_insert_anon
      on public.transportation_requests
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;

-- 010_create_contact.sql
-- Contact form submissions (website contact form)

begin;

create table if not exists public.contact (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  first_name text not null,
  last_name  text not null,
  email      text not null,
  phone      text not null,
  message    text not null
);

-- Optional: index for listing by date
create index if not exists contact_created_at_idx on public.contact (created_at desc);

alter table public.contact enable row level security;

-- Allow anonymous inserts from the contact form (via API using anon key)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'contact'
      and policyname = 'contact_insert_anon'
  ) then
    create policy contact_insert_anon
      on public.contact
      for insert
      to anon
      with check (true);
  end if;
end
$$;

commit;
-- Migration: Create boat_drafts table
-- Date: 2026
-- Description: Stores in-progress boat listings so users can save and resume editing

CREATE TABLE boat_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  type text,
  condition text,
  keel_type text,
  ce_design_category text,
  material text,
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
  brochures jsonb DEFAULT '[]',
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

-- Local API access. Public reads are limited to active listings; writes are
-- scoped to the signed-in user. Every exposed table has RLS enabled.
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boat_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boat_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_image ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inqueries ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.boats, public.boat_data, public.broker_data,
  public.boat_images, public.profile_image TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.boats, public.boat_data,
  public.broker_data, public.boat_images, public.profile_image,
  public.boat_drafts TO authenticated;
GRANT SELECT ON public.inqueries TO authenticated;
GRANT INSERT ON public.charter_requests, public.transportation_requests,
  public.contact TO anon, authenticated;

CREATE POLICY "View visible boats" ON public.boats
  FOR SELECT TO anon, authenticated
  USING ((active AND NOT bought) OR user_id = (SELECT auth.uid()));
CREATE POLICY "Manage own boats" ON public.boats
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "View visible boat data" ON public.boat_data
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id));
CREATE POLICY "Manage own boat data" ON public.boat_data
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "View visible boat images" ON public.boat_images
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id));
CREATE POLICY "Manage own boat images" ON public.boat_images
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "View listing dealers" ON public.broker_data
  FOR SELECT TO anon, authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.boats b
      WHERE b.id = broker_data.boat_id OR b.dealer_id = broker_data.id
    )
  );
CREATE POLICY "Manage own dealer data" ON public.broker_data
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "View profile images" ON public.profile_image
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Manage own profile image" ON public.profile_image
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Boat owners view inquiries" ON public.inqueries
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())
  ));

DROP POLICY "Users manage own drafts" ON public.boat_drafts;
CREATE POLICY "Users manage own drafts" ON public.boat_drafts
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Signed-in users submit charter requests" ON public.charter_requests
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users submit transportation requests" ON public.transportation_requests
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Signed-in users submit contact requests" ON public.contact
  FOR INSERT TO authenticated WITH CHECK (true);
