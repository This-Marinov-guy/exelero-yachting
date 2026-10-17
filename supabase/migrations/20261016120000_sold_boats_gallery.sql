-- Sold listings remain visible to Gallery visitors, while unsold drafts are
-- kept private. This also enables the boat RLS rules on older deployments
-- where the initial schema existed before its policies were applied.
BEGIN;

ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boat_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boat_images ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.boats, public.boat_data, public.boat_images FROM anon;
GRANT SELECT ON public.boats, public.boat_data, public.boat_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.boats, public.boat_data, public.boat_images TO authenticated;

DROP POLICY IF EXISTS "View visible boats" ON public.boats;
CREATE POLICY "View visible boats" ON public.boats
  FOR SELECT TO anon
  USING ((active AND NOT bought) OR bought);

DROP POLICY IF EXISTS "Manage own boats" ON public.boats;
CREATE POLICY "Manage own boats" ON public.boats
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "Account users view all boats" ON public.boats;
CREATE POLICY "Account users view all boats" ON public.boats
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Account users update all boats" ON public.boats;
CREATE POLICY "Account users update all boats" ON public.boats
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Account users delete all boats" ON public.boats;
CREATE POLICY "Account users delete all boats" ON public.boats
  FOR DELETE TO authenticated USING (true);

-- Account editors may change listing status, but cannot reassign ownership.
REVOKE UPDATE ON public.boats FROM authenticated;
GRANT UPDATE (active, bought, slug, dealer_id) ON public.boats TO authenticated;

DROP POLICY IF EXISTS "View visible boat data" ON public.boat_data;
CREATE POLICY "View visible boat data" ON public.boat_data
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND ((b.active AND NOT b.bought) OR b.bought)
  ));
DROP POLICY IF EXISTS "Account users view all boat data" ON public.boat_data;
CREATE POLICY "Account users view all boat data" ON public.boat_data
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Manage own boat data" ON public.boat_data;
CREATE POLICY "Manage own boat data" ON public.boat_data
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Account users update all boat details" ON public.boat_data;
CREATE POLICY "Account users update all boat details" ON public.boat_data
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "View visible boat images" ON public.boat_images;
CREATE POLICY "View visible boat images" ON public.boat_images
  FOR SELECT TO anon
  USING (EXISTS (
    SELECT 1 FROM public.boats b WHERE b.id = boat_id AND ((b.active AND NOT b.bought) OR b.bought)
  ));
DROP POLICY IF EXISTS "Account users view all boat images" ON public.boat_images;
CREATE POLICY "Account users view all boat images" ON public.boat_images
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Manage own boat images" ON public.boat_images;
CREATE POLICY "Manage own boat images" ON public.boat_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.boats b WHERE b.id = boat_id AND b.user_id = (SELECT auth.uid())));
DROP POLICY IF EXISTS "Account users add boat media" ON public.boat_images;
CREATE POLICY "Account users add boat media" ON public.boat_images
  FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Account users update boat media" ON public.boat_images;
CREATE POLICY "Account users update boat media" ON public.boat_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Account users delete boat media" ON public.boat_images;
CREATE POLICY "Account users delete boat media" ON public.boat_images
  FOR DELETE TO authenticated USING (true);

COMMIT;
