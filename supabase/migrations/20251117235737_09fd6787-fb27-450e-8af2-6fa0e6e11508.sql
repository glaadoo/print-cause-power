-- Create causes table
CREATE TABLE public.causes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  total_raised NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.causes ENABLE ROW LEVEL SECURITY;

-- Anyone can view causes
CREATE POLICY "Anyone can view causes"
ON public.causes
FOR SELECT
USING (true);

-- Insert common causes
INSERT INTO public.causes (name, description) VALUES
  ('Education', 'Support educational programs and initiatives'),
  ('Healthcare', 'Provide medical care and health services'),
  ('Environment', 'Protect our planet and natural resources'),
  ('Hunger Relief', 'Fight hunger and food insecurity'),
  ('Animal Welfare', 'Care for and protect animals'),
  ('Disaster Relief', 'Help communities recover from disasters');

-- Add cause_id to orders table
ALTER TABLE public.orders ADD COLUMN cause_id UUID REFERENCES public.causes(id);

-- Add cause_id to donations table  
ALTER TABLE public.donations ADD COLUMN cause_id UUID REFERENCES public.causes(id);

-- Update existing donations to link to causes based on text
UPDATE public.donations d
SET cause_id = c.id
FROM public.causes c
WHERE d.cause = c.name;

-- Update existing orders with donations to link to a default cause
-- (since we don't have historical cause selection data for orders)
UPDATE public.orders o
SET cause_id = (SELECT id FROM public.causes LIMIT 1)
WHERE o.total_donation > 0 AND o.cause_id IS NULL;