-- Migration: Add permanent boat slugs and dealer reference
-- Date: 2026
-- Description: Creates immutable public listing slugs and stores the selected dealer directly on boats

ALTER TABLE boats
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS dealer_id uuid REFERENCES broker_data(id) ON DELETE SET NULL;

WITH source AS (
  SELECT
    b.id,
    b.created_at,
    COALESCE(
      NULLIF(
        trim(both '-' from regexp_replace(
          lower(
            CASE
              WHEN bd.build_year IS NOT NULL AND bd.build_year <> ''
                THEN replace(COALESCE(bd.title, ''), bd.build_year, ' ')
              ELSE COALESCE(bd.title, '')
            END
          ),
          '[^a-z0-9]+',
          '-',
          'g'
        )),
        ''
      ),
      'boat-' || substring(b.id::text, 1, 8)
    ) AS base_slug
  FROM boats b
  LEFT JOIN boat_data bd ON bd.boat_id = b.id
  WHERE b.slug IS NULL
),
ranked AS (
  SELECT
    id,
    CASE
      WHEN row_number() OVER (PARTITION BY base_slug ORDER BY created_at, id) = 1 THEN base_slug
      ELSE base_slug || '-' || row_number() OVER (PARTITION BY base_slug ORDER BY created_at, id)
    END AS next_slug
  FROM source
)
UPDATE boats b
SET slug = ranked.next_slug
FROM ranked
WHERE b.id = ranked.id;

UPDATE boats b
SET dealer_id = broker_data.id
FROM broker_data
WHERE broker_data.boat_id = b.id
  AND b.dealer_id IS NULL;

UPDATE boats b
SET dealer_id = (
  SELECT broker_data.id
  FROM broker_data
  WHERE broker_data.user_id = b.user_id
  ORDER BY broker_data.created_at ASC
  LIMIT 1
)
WHERE b.dealer_id IS NULL
  AND EXISTS (
    SELECT 1
    FROM broker_data
    WHERE broker_data.user_id = b.user_id
  );

ALTER TABLE boats
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_boats_slug_unique ON boats(slug);
CREATE INDEX IF NOT EXISTS idx_boats_dealer_id ON boats(dealer_id);

COMMENT ON COLUMN boats.slug IS 'Permanent public listing slug generated from the original boat title without the build year.';
COMMENT ON COLUMN boats.dealer_id IS 'Selected dealer/broker for this listing.';
