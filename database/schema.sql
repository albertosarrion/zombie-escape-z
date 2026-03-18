-- ZOMBIE ESCAPE Z - DATABASE SCHEMA

-- ==========================================
-- 1. USERS (PROFILES) TABLE
-- Extends the default Supabase Auth users table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'survivor' CHECK (role IN ('survivor', 'admin', 'zombie')),
    team_id UUID, -- Will reference teams table
    is_alive BOOLEAN DEFAULT true,
    last_location_lat DOUBLE PRECISION,
    last_location_lng DOUBLE PRECISION,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- ==========================================
-- 2. TEAMS (SQUADS) TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    access_code TEXT NOT NULL UNIQUE,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key reference back to profiles
ALTER TABLE public.profiles
    ADD CONSTRAINT fk_profiles_team FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- Turn on Row Level Security
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Teams Policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create a team" ON public.teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only team leader can update team" ON public.teams
    FOR UPDATE USING (auth.uid() = leader_id);


-- ==========================================
-- 3. WAYPOINTS (MAP POIs) TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.waypoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('danger', 'safehouse', 'objective', 'info')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE public.waypoints ENABLE ROW LEVEL SECURITY;

-- Waypoints Policies
CREATE POLICY "Waypoints are viewable by everyone" ON public.waypoints
    FOR SELECT USING (true);

-- Only admins can create/update waypoints (we check the role in the profiles table)
CREATE POLICY "Only admins can manage waypoints" ON public.waypoints
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
