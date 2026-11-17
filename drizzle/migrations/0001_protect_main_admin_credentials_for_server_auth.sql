DROP POLICY IF EXISTS "Anyone can read admin credentials" ON public.admin_credentials;
DROP POLICY IF EXISTS "Anyone can update admin credentials" ON public.admin_credentials;
REVOKE ALL ON TABLE public.admin_credentials FROM anon, authenticated;
GRANT ALL ON TABLE public.admin_credentials TO service_role;
CREATE POLICY "Server functions manage admin credentials" ON public.admin_credentials FOR ALL TO service_role USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');