-- Create roadmap_items table for project status tracking
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planned', 'todo', 'doing', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only read, admins must edit in DB directly
CREATE POLICY roadmap_items_select_all ON public.roadmap_items
  FOR SELECT USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_roadmap_items_project_id ON public.roadmap_items(project_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_status ON public.roadmap_items(status);

-- Insert demo roadmap items for the demo project
INSERT INTO public.roadmap_items (project_id, title, description, status, display_order)
SELECT 
  p.id,
  'Мобилна версия',
  'Създаване на адаптивен дизайн за мобилни устройства',
  'done',
  1
FROM public.projects p WHERE p.slug = 'demo'
UNION ALL
SELECT 
  p.id,
  'Имейл известия',
  'Автоматични имейл известия при промени',
  'doing',
  2
FROM public.projects p WHERE p.slug = 'demo'
UNION ALL
SELECT 
  p.id,
  'Експорт на данни',
  'Възможност за експорт на предложения в CSV/Excel',
  'todo',
  3
FROM public.projects p WHERE p.slug = 'demo'
UNION ALL
SELECT 
  p.id,
  'API интеграция',
  'REST API за външни интеграции',
  'planned',
  4
FROM public.projects p WHERE p.slug = 'demo';
