-- ============================================================================
-- FEWSION - COMPLETE SUPABASE DATABASE SCHEMA
-- Execute this SQL in Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Vector embeddings for AI Recommendations

-- 2. ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('brand', 'creator', 'editor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Users / Profiles Table (Links to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'creator',
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    city TEXT,
    country TEXT DEFAULT 'India',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Creator Profiles & AI Scoring Table
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instagram_handle TEXT UNIQUE,
    bio TEXT,
    primary_niche TEXT NOT NULL DEFAULT 'General',
    follower_count INT DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    ai_score INT DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    screenshot_url TEXT,
    ai_metrics_data JSONB DEFAULT '{}'::jsonb,
    profile_embedding vector(1536), -- Vector embedding for AI recommendations
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brand Profiles Table
CREATE TABLE IF NOT EXISTS public.brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Editor Profiles Table
CREATE TABLE IF NOT EXISTS public.editor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    portfolio_url TEXT,
    editing_skills TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    niche TEXT NOT NULL,
    budget_inr DECIMAL(12,2) NOT NULL,
    status campaign_status DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    editor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    pitch_text TEXT,
    bid_amount DECIMAL(12,2) NOT NULL,
    ai_match_score INT DEFAULT 0 CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Agreements & Commission Escrow Table
CREATE TABLE IF NOT EXISTS public.agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    editor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    agreed_total_inr DECIMAL(12,2) NOT NULL,
    fewsion_commission_pct DECIMAL(4,2) DEFAULT 10.00, -- 10% marketplace fee
    fewsion_commission_inr DECIMAL(12,2) NOT NULL,
    contract_terms TEXT NOT NULL,
    status TEXT DEFAULT 'pending_signatures',
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES & ROW LEVEL SECURITY (RLS)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_creator_ai_score ON public.creator_profiles(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public users viewable by all" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Creator profiles viewable by all" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Creators insert own profile" ON public.creator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Creators update own profile" ON public.creator_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Campaigns viewable by all" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Brands insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = brand_id);

-- Automatic Profile Creation Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Fewsion User'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'creator'::user_role)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
