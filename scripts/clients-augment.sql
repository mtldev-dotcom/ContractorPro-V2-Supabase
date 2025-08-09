-- Augment the clients table to support fields used by the UI (clients page and Add Client modal)
-- Safe to run multiple times due to IF NOT EXISTS clauses

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS type VARCHAR(20)
    CHECK (type IN ('individual','business'))
    DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS secondary_phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(20)
    CHECK (preferred_contact_method IN ('email','phone','text'))
    DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS rating INTEGER
    CHECK (rating BETWEEN 1 AND 5)
    DEFAULT 5,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Optional: basic indexes to speed up lookups and filters
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_preferred_contact ON clients(preferred_contact_method);


