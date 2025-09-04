-- Migration: ensure pgcrypto exists and make UUID default usage consistent
-- Created: 2025-09-04 15:16:10
-- This migration is safe: it creates the pgcrypto extension if missing and
-- updates the DEFAULT expression for affected UUID columns so future inserts
-- use gen_random_uuid(). Existing rows are not modified.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Replace uuid_generate_v4() defaults with gen_random_uuid() for tables that used uuid-ossp.
-- Change only the DEFAULT; this does not modify existing values.
-- Confirmed in current migrations: public.financial_transactions used uuid_generate_v4().
ALTER TABLE public.financial_transactions
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add other ALTER TABLE ... ALTER COLUMN ... SET DEFAULT gen_random_uuid();
-- lines below if you discover additional tables using uuid_generate_v4().
