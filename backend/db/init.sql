-- Job Application Tracker - Database Schema
-- Run with: psql $DATABASE_URL -f db/init.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
    CREATE TYPE job_type_enum AS ENUM ('Internship', 'Full-time', 'Part-time');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_enum AS ENUM ('Applied', 'Interviewing', 'Offer', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_type job_type_enum NOT NULL,
    status status_enum NOT NULL DEFAULT 'Applied',
    applied_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_company_name ON applications(company_name);
CREATE INDEX IF NOT EXISTS idx_applications_job_title ON applications(job_title);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Optional seed data for local development/demo screenshots
INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
VALUES
    ('Acme Corp', 'Frontend Developer Intern', 'Internship', 'Applied', '2026-06-01', 'Applied via referral'),
    ('Globex', 'Full Stack Engineer', 'Full-time', 'Interviewing', '2026-05-20', 'First call scheduled'),
    ('Initech', 'React Developer', 'Part-time', 'Rejected', '2026-05-10', NULL)
ON CONFLICT DO NOTHING;
