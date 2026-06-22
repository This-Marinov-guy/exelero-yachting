-- Migration: Remove build years from boat slugs
-- Date: 2026
-- Description: Regenerates existing boat slugs from the title with the build year removed

BEGIN;

UPDATE boats
SET slug = 'boat-' || replace(id::text, '-', '');

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

COMMIT;
