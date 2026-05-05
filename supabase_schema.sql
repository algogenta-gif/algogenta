-- ============================================================
-- ALGOGENTA — SUPABASE SQL SCHEMA
-- Paste this entire file into the Supabase SQL Editor and run
-- ============================================================

-- ────────────────────────────────────────────
-- 1. EXTENSIONS
-- ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────
-- 2. COMPANIES TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.companies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  owner_name    TEXT NOT NULL,
  company_type  TEXT NOT NULL DEFAULT 'Technology',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 3. PROFILES TABLE (extends auth.users)
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')) DEFAULT 'admin',
  company_id  UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 4. CALLS TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.calls (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('inbound', 'outbound')),
  duration      INTEGER NOT NULL DEFAULT 0,  -- seconds
  status        TEXT NOT NULL CHECK (status IN ('completed', 'missed', 'in_progress')) DEFAULT 'completed',
  caller_name   TEXT,
  caller_phone  TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 5. APPOINTMENTS TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_name   TEXT NOT NULL,
  client_email  TEXT,
  client_phone  TEXT,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 6. LEADS TABLE
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  source      TEXT NOT NULL DEFAULT 'Inbound Call',
  status      TEXT NOT NULL CHECK (status IN ('new', 'qualified', 'converted', 'lost')) DEFAULT 'new',
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────
-- 7. INDEXES
-- ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_calls_company_id        ON public.calls(company_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at        ON public.calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_type              ON public.calls(type);
CREATE INDEX IF NOT EXISTS idx_appointments_company_id ON public.appointments(company_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled  ON public.appointments(scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_company_id        ON public.leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at        ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id     ON public.profiles(company_id);

-- ────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────
ALTER TABLE public.companies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads        ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's company_id
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.get_my_role() = 'super_admin');

CREATE POLICY "Super admin can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.get_my_role() = 'super_admin');

CREATE POLICY "Super admin can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'super_admin');

-- COMPANIES policies
CREATE POLICY "Super admin full access to companies"
  ON public.companies FOR ALL
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "Admin can read own company"
  ON public.companies FOR SELECT
  USING (id = public.get_my_company_id());

-- CALLS policies
CREATE POLICY "Super admin full access to calls"
  ON public.calls FOR ALL
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "Admin can access own company calls"
  ON public.calls FOR ALL
  USING (company_id = public.get_my_company_id());

-- APPOINTMENTS policies
CREATE POLICY "Super admin full access to appointments"
  ON public.appointments FOR ALL
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "Admin can access own company appointments"
  ON public.appointments FOR ALL
  USING (company_id = public.get_my_company_id());

-- LEADS policies
CREATE POLICY "Super admin full access to leads"
  ON public.leads FOR ALL
  USING (public.get_my_role() = 'super_admin');

CREATE POLICY "Admin can access own company leads"
  ON public.leads FOR ALL
  USING (company_id = public.get_my_company_id());

-- ────────────────────────────────────────────
-- 9. AUTO-CREATE PROFILE ON SIGNUP
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, company_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin'),
    CASE
      WHEN NEW.raw_user_meta_data->>'company_id' IS NOT NULL
      THEN (NEW.raw_user_meta_data->>'company_id')::UUID
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────
-- 10. REALTIME
-- ────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- ────────────────────────────────────────────
-- 11. SEED — SUPER ADMIN USER
-- ────────────────────────────────────────────
-- Step 1: Go to Authentication > Users in Supabase Dashboard
-- Step 2: Create a new user with email: admin@algogenta.com
-- Step 3: After creation, run this update to make them super_admin:
--
-- UPDATE public.profiles
-- SET role = 'super_admin', full_name = 'Super Admin'
-- WHERE email = 'admin@algogenta.com';

-- ────────────────────────────────────────────
-- 12. SAMPLE DATA (optional for testing)
-- ────────────────────────────────────────────
-- Insert a sample company
INSERT INTO public.companies (id, name, owner_name, company_type, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Demo Company', 'Demo Admin', 'Technology', TRUE)
ON CONFLICT DO NOTHING;

-- Insert sample calls for demo company
INSERT INTO public.calls (company_id, type, duration, status, caller_name, caller_phone)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'inbound',  240, 'completed', 'Alice Johnson', '+1-555-0101'),
  ('11111111-1111-1111-1111-111111111111', 'outbound', 180, 'completed', 'Bob Smith',     '+1-555-0102'),
  ('11111111-1111-1111-1111-111111111111', 'inbound',  320, 'completed', 'Carol White',   '+1-555-0103'),
  ('11111111-1111-1111-1111-111111111111', 'outbound',  95, 'missed',    'David Brown',   '+1-555-0104'),
  ('11111111-1111-1111-1111-111111111111', 'inbound',  410, 'completed', 'Emma Davis',    '+1-555-0105')
ON CONFLICT DO NOTHING;

-- Insert sample appointments
INSERT INTO public.appointments (company_id, client_name, scheduled_at, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alice Johnson', NOW() + INTERVAL '1 hour',   'confirmed'),
  ('11111111-1111-1111-1111-111111111111', 'Bob Smith',     NOW() + INTERVAL '3 hours',  'pending'),
  ('11111111-1111-1111-1111-111111111111', 'Carol White',   NOW() + INTERVAL '6 hours',  'confirmed'),
  ('11111111-1111-1111-1111-111111111111', 'Emma Davis',    NOW() - INTERVAL '2 hours',  'completed')
ON CONFLICT DO NOTHING;

-- Insert sample leads
INSERT INTO public.leads (company_id, name, email, phone, source, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Michael Scott', 'michael@demo.com', '+1-555-0201', 'Inbound Call', 'qualified'),
  ('11111111-1111-1111-1111-111111111111', 'Pam Beesly',    'pam@demo.com',     '+1-555-0202', 'Web Form',     'new'),
  ('11111111-1111-1111-1111-111111111111', 'Jim Halpert',   'jim@demo.com',     '+1-555-0203', 'Outbound Call','converted')
ON CONFLICT DO NOTHING;
