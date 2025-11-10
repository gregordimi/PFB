export interface RoadmapItem {
  id: string
  project_id: string
  title: string
  description: string | null
  status: "planned" | "todo" | "doing" | "done"
  created_at: string
  updated_at: string
  display_order: number
}

export type RoadmapStatus = "planned" | "todo" | "doing" | "done"
