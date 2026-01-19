-- Add confirmation_document column to admissions table for student-specific documents
ALTER TABLE public.admissions 
ADD COLUMN IF NOT EXISTS confirmation_document_url TEXT DEFAULT NULL;

-- Add DELETE policy for admissions (currently missing)
CREATE POLICY "Anyone can delete admissions"
ON public.admissions
FOR DELETE
USING (true);