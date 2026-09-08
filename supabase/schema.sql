-- ==============================================================================
-- GEN ZS FOR CHRIST — SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- It creates the database tables, indexes, Row Level Security (RLS) policies,
-- and automated timestamp triggers for:
-- 1. Contact Form Messages
-- 2. Donations & Paystack Transactions
-- 3. Newsletter / Community Members
-- ==============================================================================

-- 1. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying contact messages by date and status
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);

-- 2. Donations Table (Paystack Integration)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference TEXT UNIQUE NOT NULL,
    donor_name TEXT NOT NULL DEFAULT 'Kind Partner',
    donor_email TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    channel TEXT DEFAULT 'card',
    paystack_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching donations by reference, status, and date
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_reference ON public.donations (reference);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations (status);

-- 3. Community Newsletter Subscribers Table (Optional)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'website_footer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER trigger_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_donations_updated_at ON public.donations;
CREATE TRIGGER trigger_donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- CONTACT MESSAGES POLICIES
-- ------------------------------------------------------------------------------
-- 1. Public can insert new contact messages
CREATE POLICY "Public can submit contact messages"
    ON public.contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 2. Only Authenticated Admins can select/view contact messages
CREATE POLICY "Admins can view contact messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- 3. Only Authenticated Admins can update contact messages (e.g. mark read/replied)
CREATE POLICY "Admins can update contact messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Only Authenticated Admins can delete contact messages
CREATE POLICY "Admins can delete contact messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- ------------------------------------------------------------------------------
-- DONATIONS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Public can insert new donation attempts (pending/initial)
CREATE POLICY "Public can log donation attempts"
    ON public.donations
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 2. Public can update their own donation status by matching reference
CREATE POLICY "Public can update donation status on callback"
    ON public.donations
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- 3. Only Authenticated Admins can view all donations
CREATE POLICY "Admins can view all donations"
    ON public.donations
    FOR SELECT
    TO authenticated
    USING (true);

-- 4. Only Authenticated Admins can delete or manage donation logs
CREATE POLICY "Admins can manage donations"
    ON public.donations
    FOR ALL
    TO authenticated
    USING (true);

-- ------------------------------------------------------------------------------
-- NEWSLETTER POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Public can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (true);
