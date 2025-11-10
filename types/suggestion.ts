export interface Suggestion {
  id: string
  title: string
  description: string | null
  vote_count: number
  created_at: string
  project_id: string | null
  contact: string | null // Added optional contact field (private, not displayed in UI)
}

export interface Vote {
  id: string
  suggestion_id: string
  voter_identifier: string
  vote_type: "up" | "down"
  created_at: string
}
