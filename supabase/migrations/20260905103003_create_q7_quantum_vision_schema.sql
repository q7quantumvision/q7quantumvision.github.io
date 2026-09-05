/*
# Create Q7 Quantum Vision portal schema

1. New Tables
- `profiles`: one row per signed-in user, with display name and an admin-only flag.
- `projects`: Quantum Integration delivery trackers owned by a client account.
- `contact_submissions`: public contact form submissions for the Q7 team.

2. Project fields
- `projects.name`: project display name.
- `projects.progress`: integer progress percentage from 0 to 100.
- `projects.status`: controlled delivery status text.
- `projects.user_id`: owning client account, filled from the authenticated session for normal inserts.

3. Security
- Row Level Security is enabled on every table.
- Clients can read only their own profile and projects.
- Admins can read all profiles and projects and create/update/delete projects.
- The `is_admin` flag cannot be changed through normal client updates.
- Contact submissions can be created publicly, but are not publicly readable.
- A trigger creates a profile after each new Auth account.

4. Important notes
- Set `profiles.is_admin = true` for the trusted administrator account using the Supabase SQL editor.
- The frontend never treats an admin flag as authoritative without the database policies also enforcing it.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'Calibrating' CHECK (status IN ('Calibrating', 'Running Simulations', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON public.projects(updated_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
REVOKE ALL ON public.contact_submissions FROM anon, authenticated;
GRANT INSERT (name, email, company, message) ON public.contact_submissions TO anon, authenticated;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true));

DROP POLICY IF EXISTS "Users can update own name" ON public.profiles;
CREATE POLICY "Users can update own name" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Clients can view own projects" ON public.projects;
CREATE POLICY "Clients can view own projects" ON public.projects FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true));

DROP POLICY IF EXISTS "Admins can create projects" ON public.projects;
CREATE POLICY "Admins can create projects" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true));

DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true));

DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles admin WHERE admin.id = auth.uid() AND admin.is_admin = true));

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 120 AND char_length(email) BETWEEN 3 AND 320 AND char_length(message) BETWEEN 1 AND 5000);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
