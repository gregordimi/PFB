-- Add optional contact field to suggestions table
-- This field is private and not displayed in the UI

ALTER TABLE suggestions
ADD COLUMN IF NOT EXISTS contact TEXT;

COMMENT ON COLUMN suggestions.contact IS 'Optional contact information (email/phone) - private field not displayed in UI';
