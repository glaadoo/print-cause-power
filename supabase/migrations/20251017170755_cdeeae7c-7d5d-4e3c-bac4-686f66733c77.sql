-- Create enum for request types
CREATE TYPE public.pressmaster_request_type AS ENUM ('quote', 'story');

-- Create enum for request modes
CREATE TYPE public.pressmaster_mode AS ENUM ('stub', 'live');

-- Create enum for request status
CREATE TYPE public.pressmaster_status AS ENUM ('pending', 'success', 'error');

-- Create pressmaster_requests table
CREATE TABLE public.pressmaster_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type pressmaster_request_type NOT NULL DEFAULT 'quote',
  request_body JSONB NOT NULL,
  response_body JSONB,
  mode pressmaster_mode NOT NULL,
  status pressmaster_status NOT NULL DEFAULT 'pending',
  donation_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pressmaster_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view all requests"
  ON public.pressmaster_requests
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own requests"
  ON public.pressmaster_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create requests"
  ON public.pressmaster_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_pressmaster_requests_updated_at
  BEFORE UPDATE ON public.pressmaster_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for faster queries
CREATE INDEX idx_pressmaster_requests_user_id ON public.pressmaster_requests(user_id);
CREATE INDEX idx_pressmaster_requests_donation_id ON public.pressmaster_requests(donation_id);
CREATE INDEX idx_pressmaster_requests_created_at ON public.pressmaster_requests(created_at DESC);