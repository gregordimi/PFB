-- Drop existing tables and recreate from scratch
-- This will delete all existing data

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS suggestions CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suggestions table
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id UUID NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
  voter_identifier TEXT NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(suggestion_id, voter_identifier)
);

-- Create indexes for better performance
CREATE INDEX idx_suggestions_project_id ON suggestions(project_id);
CREATE INDEX idx_suggestions_vote_count ON suggestions(vote_count DESC);
CREATE INDEX idx_votes_suggestion_id ON votes(suggestion_id);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects (public read, admin write)
CREATE POLICY projects_select_all ON projects FOR SELECT USING (true);
CREATE POLICY projects_insert_all ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY projects_update_all ON projects FOR UPDATE USING (true);

-- RLS Policies for suggestions (public read/write)
CREATE POLICY suggestions_select_all ON suggestions FOR SELECT USING (true);
CREATE POLICY suggestions_insert_all ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY suggestions_update_all ON suggestions FOR UPDATE USING (true);

-- RLS Policies for votes (public read/write/delete)
CREATE POLICY votes_select_all ON votes FOR SELECT USING (true);
CREATE POLICY votes_insert_all ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY votes_delete_all ON votes FOR DELETE USING (true);

-- Create function to update vote count
CREATE OR REPLACE FUNCTION update_suggestion_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE suggestions 
    SET vote_count = vote_count + NEW.vote_type
    WHERE id = NEW.suggestion_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE suggestions 
    SET vote_count = vote_count - OLD.vote_type
    WHERE id = OLD.suggestion_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE suggestions 
    SET vote_count = vote_count - OLD.vote_type + NEW.vote_type
    WHERE id = NEW.suggestion_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic vote count updates
DROP TRIGGER IF EXISTS trigger_update_vote_count ON votes;
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_vote_count();

-- Insert a sample project for testing
INSERT INTO projects (slug, name, description) 
VALUES ('demo', 'Demo Project', 'A demo project for testing the feedback system')
ON CONFLICT (slug) DO NOTHING;
