-- ============================================================
-- SECURITY FIX: Address Critical Error-Level Vulnerabilities
-- ============================================================

-- ------------------------------------------------------------
-- 1. FIX NOTIFICATIONS: Remove unrestricted insert policy
-- ------------------------------------------------------------

-- Drop the insecure public insert policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Create a secure server-side function for notification creation
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id UUID,
  notification_type TEXT,
  notification_title TEXT,
  notification_body TEXT
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  notification_id UUID;
BEGIN
  -- Only allow admins to create notifications
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can create notifications';
  END IF;
  
  -- Validate notification type
  IF notification_type NOT IN ('order', 'donation', 'system', 'product') THEN
    RAISE EXCEPTION 'Invalid notification type';
  END IF;
  
  -- Insert notification
  INSERT INTO public.notifications (user_id, type, title, body)
  VALUES (target_user_id, notification_type, notification_title, notification_body)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Grant execute to authenticated users (function enforces admin check internally)
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;

-- ------------------------------------------------------------
-- 2. FIX DONATIONS: Restrict public access to donor information
-- ------------------------------------------------------------

-- Drop the public viewing policy
DROP POLICY IF EXISTS "Anyone can view donations" ON public.donations;

-- Allow users to view their own donations
CREATE POLICY "Users can view their own donations"
  ON public.donations FOR SELECT
  USING (auth.uid() = user_id);

-- Admin policy already exists: "Admins can manage all donations"

-- ------------------------------------------------------------
-- 3. FIX GIFT CARDS: Add proper admin-only viewing policy
-- ------------------------------------------------------------

-- Add admin viewing policy for all gift cards
CREATE POLICY "Admins can view all gift cards"
  ON public.gift_cards FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Existing user redemption policy remains: "Users can view gift cards they've redeemed"