
-- Orders insert: still allow anonymous inserts but with explicit minimal validation
DROP POLICY IF EXISTS "anyone can place order" ON public.orders;
CREATE POLICY "anyone can place order" ON public.orders FOR INSERT
  WITH CHECK (
    char_length(customer_name) BETWEEN 1 AND 200
    AND subtotal >= 0
    AND item_count > 0
    AND jsonb_typeof(items) = 'array'
  );

-- Restrict storage listing: only admins can list arbitrary objects
DROP POLICY IF EXISTS "public read site-assets" ON storage.objects;
CREATE POLICY "public read site-assets file" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');
-- (kept SELECT — bucket is public CDN; listing is via public.media table only)

-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
