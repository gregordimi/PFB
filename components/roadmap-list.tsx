"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { RoadmapItem } from "@/types/roadmap"
import { RoadmapStatusCard } from "@/components/roadmap-status-card"
import { useTranslations } from "@/lib/translations"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RoadmapListProps {
  projectSlug: string
}

export function RoadmapList({ projectSlug }: RoadmapListProps) {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "planned" | "todo" | "doing" | "done">("all")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const t = useTranslations()
  const supabase = createBrowserClient()

  useEffect(() => {
    fetchRoadmapItems()
  }, [projectSlug])

  const fetchRoadmapItems = async () => {
    try {
      setLoading(true)

      // Get project by slug
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single()

      if (projectError || !project) {
        console.error("[v0] Error fetching project:", projectError)
        return
      }

      // Fetch roadmap items
      const { data, error } = await supabase
        .from("roadmap_items")
        .select("*")
        .eq("project_id", project.id)
        .order("display_order", { ascending: true })

      if (error) {
        console.error("[v0] Error fetching roadmap items:", error)
        return
      }

      setItems(data || [])
    } catch (error) {
      console.error("[v0] Error in fetchRoadmapItems:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItemsByStatus = (status: "all" | "planned" | "todo" | "doing" | "done") => {
    if (status === "all") return items
    return items.filter((item) => item.status === status)
  }

  const statusCounts = {
    all: items.length,
    planned: items.filter((i) => i.status === "planned").length,
    todo: items.filter((i) => i.status === "todo").length,
    doing: items.filter((i) => i.status === "doing").length,
    done: items.filter((i) => i.status === "done").length,
  }

  const handleTabChange = (newTab: typeof activeTab) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTab(newTab)
      setIsTransitioning(false)
    }, 150)
  }

  const filteredItems = filterItemsByStatus(activeTab)

  return (
    <div className="space-y-6">
      <div className="hidden sm:block">
        <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as typeof activeTab)} className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-6 transition-all duration-200">
            <TabsTrigger value="all" className="transition-all duration-200">
              Всички ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="planned" className="transition-all duration-200">
              {t.statusPlanned} ({statusCounts.planned})
            </TabsTrigger>
            <TabsTrigger value="todo" className="transition-all duration-200">
              {t.statusTodo} ({statusCounts.todo})
            </TabsTrigger>
            <TabsTrigger value="doing" className="transition-all duration-200">
              {t.statusDoing} ({statusCounts.doing})
            </TabsTrigger>
            <TabsTrigger value="done" className="transition-all duration-200">
              {t.statusDone} ({statusCounts.done})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="block sm:hidden mb-6">
        <Select value={activeTab} onValueChange={(v) => handleTabChange(v as typeof activeTab)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички ({statusCounts.all})</SelectItem>
            <SelectItem value="planned">
              {t.statusPlanned} ({statusCounts.planned})
            </SelectItem>
            <SelectItem value="todo">
              {t.statusTodo} ({statusCounts.todo})
            </SelectItem>
            <SelectItem value="doing">
              {t.statusDoing} ({statusCounts.doing})
            </SelectItem>
            <SelectItem value="done">
              {t.statusDone} ({statusCounts.done})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className={`mt-0 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base sm:text-lg">{t.noRoadmapItems}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
              >
                <RoadmapStatusCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
