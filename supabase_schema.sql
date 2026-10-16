-- =========================================================================
-- DigiJournal — Supabase SQL Migration
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =========================================================================

-- 1. Create table for Journal Entries
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL DEFAULT 'Untitled Reflection',
  content TEXT NOT NULL DEFAULT '',
  mood TEXT DEFAULT 'happy',
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  word_count INT DEFAULT 0,
  handwriting_style TEXT DEFAULT 'cozy',
  stickers JSONB DEFAULT '[]',
  page_type TEXT DEFAULT 'entry',
  subtitle TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe migrations for existing journal_entries tables
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS handwriting_style TEXT DEFAULT 'cozy';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS stickers JSONB DEFAULT '[]';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'entry';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT '';

-- 2. Create table for Quests / To-Dos
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'Personal',
  due_date DATE DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create table for Future Me Time Capsule Letters
CREATE TABLE IF NOT EXISTS public.future_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  recipient TEXT DEFAULT 'Future Me',
  body TEXT NOT NULL,
  mood TEXT DEFAULT 'grateful',
  envelope_style TEXT DEFAULT 'classic',
  unlock_date DATE NOT NULL,
  is_opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create table for Player Profile & Settings
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Annjo',
  xp INT DEFAULT 0,
  unlocked_achievements TEXT[] DEFAULT '{}',
  sound_enabled BOOLEAN DEFAULT true,
  volume FLOAT DEFAULT 0.5,
  tutorial_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES for fast queries by user and date
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON public.journal_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_todos_user ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_future_letters_user ON public.future_letters(user_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can ONLY see, insert, update, or delete their OWN data.
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Journal Entries Policies
CREATE POLICY "Users can view their own entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Todos Policies
CREATE POLICY "Users can view their own todos"
  ON public.todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON public.todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON public.todos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON public.todos FOR DELETE
  USING (auth.uid() = user_id);

-- Future Letters Policies
CREATE POLICY "Users can view their own future letters"
  ON public.future_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own future letters"
  ON public.future_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own future letters"
  ON public.future_letters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own future letters"
  ON public.future_letters FOR DELETE
  USING (auth.uid() = user_id);

-- Profile Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =========================================================================
-- 5. Create table for User Suggestions (Feedback Box)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  category TEXT NOT NULL CHECK (
    category IN (
      'New Feature Idea',
      'UI or Design Feedback',
      'Bug Report',
      'Journaling Experience',
      'Performance or Technical Issue',
      'General Feedback'
    )
  ),
  message VARCHAR(1000) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'reviewing', 'planned', 'implemented', 'declined')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying suggestions by user and date
CREATE INDEX IF NOT EXISTS idx_user_suggestions_user ON public.user_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suggestions_created ON public.user_suggestions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_suggestions_status ON public.user_suggestions(status);

-- Enable RLS on user_suggestions
ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Suggestions RLS Policies:
-- 1. Users can insert suggestions associated with their authenticated UID (or null for guest submissions)
CREATE POLICY "Users can insert suggestions"
  ON public.user_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND auth.uid() IS NULL));

-- 2. Users can view ONLY their own submitted suggestions
CREATE POLICY "Users can view their own suggestions"
  ON public.user_suggestions FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Ordinary users CANNOT update or delete suggestions, preventing tampering with
-- the message or modifying administrative status fields ('new', 'reviewing', 'planned', 'implemented', 'declined').

-- =========================================================================
-- OWNER REVIEW GUIDANCE:
-- Application owners can review, filter, and triage suggestions directly in
-- the Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard -> Select Project -> Table Editor
-- 2. Click on the 'user_suggestions' table.
-- 3. Filter by 'category', 'status', or sort by 'created_at'.
-- 4. Update the 'status' column directly to 'reviewing', 'planned', 'implemented', or 'declined'.
-- =========================================================================
