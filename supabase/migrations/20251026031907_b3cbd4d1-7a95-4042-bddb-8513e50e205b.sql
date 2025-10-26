-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notify_me table for out-of-stock item notifications
CREATE TABLE IF NOT EXISTS public.notify_me (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  variant JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift_card_redemptions table
CREATE TABLE IF NOT EXISTS public.gift_card_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID NOT NULL REFERENCES public.gift_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notify_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- RLS Policies for notify_me
CREATE POLICY "Users can view their own notify-me items"
  ON public.notify_me FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notify-me items"
  ON public.notify_me FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notify-me items"
  ON public.notify_me FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for gift_cards
CREATE POLICY "Users can view gift cards they've redeemed"
  ON public.gift_cards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.gift_card_redemptions
    WHERE gift_card_id = gift_cards.id
    AND user_id = auth.uid()
  ));

-- RLS Policies for gift_card_redemptions
CREATE POLICY "Users can view their own redemptions"
  ON public.gift_card_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
  ON public.gift_card_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notify_me_user_id ON public.notify_me(user_id);
CREATE INDEX idx_gift_card_redemptions_user_id ON public.gift_card_redemptions(user_id);
CREATE INDEX idx_gift_card_redemptions_gift_card_id ON public.gift_card_redemptions(gift_card_id);