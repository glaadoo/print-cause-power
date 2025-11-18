-- Add columns for new cause features
ALTER TABLE public.causes 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS tags text,
ADD COLUMN IF NOT EXISTS website_url text;

-- Create RLS policy to allow authenticated users to insert causes
CREATE POLICY "Authenticated users can create causes"
ON public.causes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);