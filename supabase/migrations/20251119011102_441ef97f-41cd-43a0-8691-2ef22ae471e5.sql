-- ============================================================
-- SECURITY FIX: Add Explicit Anonymous Access Denial Policies
-- ============================================================
-- Prevents data exposure by explicitly denying anonymous access
-- to tables containing sensitive customer information

-- ------------------------------------------------------------
-- 1. PROFILES: Deny anonymous access to customer personal info
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (false);

-- ------------------------------------------------------------
-- 2. ADDRESSES: Deny anonymous access to home addresses
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to addresses"
  ON public.addresses FOR SELECT
  TO anon
  USING (false);

-- ------------------------------------------------------------
-- 3. ORDERS: Deny anonymous access to purchase history
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to orders"
  ON public.orders FOR SELECT
  TO anon
  USING (false);

-- ------------------------------------------------------------
-- 4. DONATIONS: Deny anonymous access to donor information
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to donations"
  ON public.donations FOR SELECT
  TO anon
  USING (false);

-- ------------------------------------------------------------
-- 5. GIFT CARDS: Deny anonymous access to gift card codes
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to gift cards"
  ON public.gift_cards FOR SELECT
  TO anon
  USING (false);

-- ------------------------------------------------------------
-- 6. ORDER ITEMS: Deny anonymous access to purchase details
-- ------------------------------------------------------------
CREATE POLICY "Deny anonymous access to order items"
  ON public.order_items FOR SELECT
  TO anon
  USING (false);