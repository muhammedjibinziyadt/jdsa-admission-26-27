-- Add RLS policy for updating admin credentials
CREATE POLICY "Anyone can update admin credentials" 
ON public.admin_credentials 
FOR UPDATE 
USING (true)
WITH CHECK (true);