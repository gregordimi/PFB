"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RoadmapItem } from "@/types/roadmap"
import { useTranslations } from "@/lib/translations"
import { CheckCircle2, Circle, Clock, Sparkles } from "lucide-react"

interface RoadmapStatusCardProps {
  item: RoadmapItem
}

export function RoadmapStatusCard({ item }: RoadmapStatusCardProps) {
  const t = useTranslations()

  const getStatusConfig = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "done":
        return {
          label: t.statusDone,
          color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
          icon: CheckCircle2,
        }
      case "doing":
        return {
          label: t.statusDoing,
          color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
          icon: Clock,
        }
      case "todo":
        return {
          label: t.statusTodo,
          color: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
          icon: Circle,
        }
      case "planned":
        return {
          label: t.statusPlanned,
          color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
          icon: Sparkles,
        }
    }
  }

  const config = getStatusConfig(item.status)
  const StatusIcon = config.icon

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl leading-tight flex-1">{item.title}</CardTitle>
          <Badge variant="outline" className={`flex items-center gap-1.5 ${config.color} flex-shrink-0`}>
            <StatusIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{config.label}</span>
          </Badge>
        </div>
      </CardHeader>
      {item.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
