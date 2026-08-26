-- ============================================================================
-- FEWSION - SUPER ADMIN DATABASE SETUP & MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Extend user_role ENUM to include 'super_admin'
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 3. Platform Settings Table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings if missing
INSERT INTO public.platform_settings (key, value)
VALUES 
    ('maintenance_mode', '{"enabled": false, "message": "System undergoing routine maintenance."}'::jsonb),
    ('commission_rate', '{"percentage": 10}'::jsonb),
    ('registration_open', '{"brand": true, "creator": true, "editor": true}'::jsonb),
    ('security_policy', '{"require_email_verification": true, "session_timeout_minutes": 120}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Super Admin Access
-- Policy: Super Admin & Admin can view and insert audit logs
CREATE POLICY "Admins read audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')
        )
    );

-- Policy: Admins read platform settings
CREATE POLICY "Admins read platform settings" ON public.platform_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role IN ('super_admin', 'admin')
        )
    );

-- Policy: Only Super Admin can write/update platform settings
CREATE POLICY "Super admin update platform settings" ON public.platform_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- Policy: Allow Super Admin full access on public.users
CREATE POLICY "Super admin manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users AS u 
            WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'admin')
        )
    );

-- 6. Helper instructions to promote an admin:
-- Run the following line in Supabase SQL Editor to make your user a Super Admin:
-- UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@fewsion.in';
