-- ============================================
-- Manthan Tech Fest - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'cultural', 'sports')),
  fee INTEGER NOT NULL DEFAULT 0, -- fee in paise (INR * 100)
  max_participants INTEGER DEFAULT 200,
  current_participants INTEGER DEFAULT 0,
  event_date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  rules TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  team_size INTEGER DEFAULT 1, -- 1 = individual
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REGISTRATIONS TABLE
-- ============================================
CREATE TABLE registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  year TEXT,
  department TEXT,
  event_ids UUID[] NOT NULL,
  total_amount INTEGER NOT NULL, -- in paise
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
-- Uses Supabase Auth. This table maps auth users to admin roles.
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RATE LIMITING TABLE
-- ============================================
CREATE TABLE rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Events: Public read, admin-only write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
  );

-- Registrations: Service role only for inserts, admins can read/update
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and staff can view registrations"
  ON registrations FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Service role can insert registrations"
  ON registrations FOR INSERT
  WITH CHECK (true); -- Controlled via service role key on backend

CREATE POLICY "Admins can update registrations"
  ON registrations FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Admin users: Only admins can manage
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Rate limits: Service role only
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_registrations_ticket_id ON registrations(ticket_id);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX idx_registrations_razorpay_order_id ON registrations(razorpay_order_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Increment participant count
CREATE OR REPLACE FUNCTION increment_participant_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET current_participants = current_participants + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA - Sample Events
-- ============================================
INSERT INTO events (name, slug, description, category, fee, event_date, venue, rules, team_size) VALUES
-- Technical Events
('CodeStorm', 'codestorm', 'Competitive programming challenge. Solve complex algorithmic problems under time pressure. Individual participation.', 'technical', 15000, '2026-03-15 10:00:00+05:30', 'Computer Lab 1', ARRAY['Individual participation', 'Duration: 2 hours', 'Languages: C, C++, Java, Python', 'Internet access not allowed'], 1),
('HackNova', 'hacknova', '24-hour hackathon. Build innovative solutions for real-world problems. Teams of 2-4 members.', 'technical', 40000, '2026-03-15 09:00:00+05:30', 'Main Auditorium', ARRAY['Team size: 2-4 members', 'Duration: 24 hours', 'Bring your own laptops', 'Pre-registration mandatory'], 4),
('RoboWars', 'robowars', 'Battle of robots! Design, build, and fight your robot against competitors.', 'technical', 50000, '2026-03-16 11:00:00+05:30', 'Sports Ground', ARRAY['Team size: 2-5 members', 'Robot weight limit: 25kg', 'Battery voltage max: 24V', 'Safety gear mandatory'], 5),
('WebCraft', 'webcraft', 'Web development competition. Design and develop a responsive website in 4 hours.', 'technical', 10000, '2026-03-16 10:00:00+05:30', 'Computer Lab 2', ARRAY['Individual or team of 2', 'Duration: 4 hours', 'Frameworks allowed', 'No pre-built templates'], 2),
('DebugDash', 'debugdash', 'Find and fix bugs in code snippets across multiple languages. Speed matters!', 'technical', 10000, '2026-03-15 14:00:00+05:30', 'Computer Lab 1', ARRAY['Individual participation', 'Duration: 1.5 hours', 'Languages: C, Java, Python', 'Pen and paper allowed'], 1),

-- Cultural Events
('Rhythmix', 'rhythmix', 'Group dance competition. Showcase your crew''s best choreography and energy.', 'cultural', 30000, '2026-03-15 18:00:00+05:30', 'Main Stage', ARRAY['Team size: 5-15 members', 'Duration: 5-8 minutes', 'Music to be submitted in advance', 'Props allowed'], 15),
('Sargam', 'sargam', 'Solo singing competition. Any genre, any language. Let your voice shine.', 'cultural', 10000, '2026-03-16 15:00:00+05:30', 'Seminar Hall', ARRAY['Solo participation', 'Duration: 4-6 minutes', 'Karaoke track allowed', 'Musical instruments optional'], 1),
('Natya', 'natya', 'Street play / Nukkad Natak. Perform a socially relevant theme without stage props.', 'cultural', 20000, '2026-03-16 11:00:00+05:30', 'Open Air Theatre', ARRAY['Team size: 8-20 members', 'Duration: 10-15 minutes', 'No stage, no mic', 'Theme: Social awareness'], 20),
('Lens & Frame', 'lens-frame', 'Photography contest. Capture the essence of the fest through your lens.', 'cultural', 5000, '2026-03-15 09:00:00+05:30', 'Entire Campus', ARRAY['Individual participation', 'DSLR or mobile allowed', 'Submit 5 best shots', 'No heavy editing'], 1),

-- Sports Events
('Cricket Blitz', 'cricket-blitz', 'Box cricket tournament. Fast-paced, 6-a-side matches.', 'sports', 30000, '2026-03-15 08:00:00+05:30', 'Cricket Ground', ARRAY['Team size: 6+2 substitutes', '6 overs per side', 'Tennis ball only', 'Umpire decision is final'], 8),
('Futsal Fury', 'futsal-fury', '5-a-side futsal tournament. Fast feet, quick goals.', 'sports', 25000, '2026-03-16 08:00:00+05:30', 'Indoor Court', ARRAY['Team size: 5+2 substitutes', 'Match duration: 20 minutes', 'Futsal shoes mandatory', 'Yellow/Red card rules apply'], 7),
('Badminton Bash', 'badminton-bash', 'Singles and doubles badminton tournament.', 'sports', 10000, '2026-03-15 09:00:00+05:30', 'Sports Hall', ARRAY['Singles and Doubles', 'Shuttlecock provided', 'Bring own racket', 'Standard BWF rules'], 2);
