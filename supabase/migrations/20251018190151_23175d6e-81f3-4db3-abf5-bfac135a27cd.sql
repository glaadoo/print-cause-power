-- Create donations table
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  cause text NOT NULL,
  payment_method text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Public can view all donations (for the barometer and recent list)
CREATE POLICY "Anyone can view donations"
ON public.donations
FOR SELECT
USING (true);

-- Authenticated users can create donations
CREATE POLICY "Authenticated users can create donations"
ON public.donations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admins can manage all donations
CREATE POLICY "Admins can manage all donations"
ON public.donations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for performance
CREATE INDEX idx_donations_created_at ON public.donations(created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;