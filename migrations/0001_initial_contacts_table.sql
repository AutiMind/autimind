-- Migration: Initial contacts table
-- Created: 2025-07-25

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'responded', 'archived')),
  priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  admin_notes TEXT,
  responded_at DATETIME,
  user_agent TEXT,
  ip_address TEXT,
  source TEXT DEFAULT 'website'
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_submitted_at ON contacts(submitted_at);
CREATE INDEX IF NOT EXISTS idx_contacts_priority ON contacts(priority);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);