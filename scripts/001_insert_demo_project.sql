-- Insert a demo project for testing
INSERT INTO projects (id, slug, name, description, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'demo',
  'Demo Project',
  'Demo project for testing the feedback system',
  now(),
  now()
)
ON CONFLICT (slug) DO NOTHING;
