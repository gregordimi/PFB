"use client"

import { Suspense } from "react"
import { ArrowLeft, Map } from "lucide-react"
import { RoadmapList } from "@/components/roadmap-list"
import { useTranslations } from "@/lib/translations"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function RoadmapPageContent() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const projectSlug = searchParams.get("project") || "demo"

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-primary text-primary-foreground p-3 sm:p-4 rounded-2xl flex-shrink-0">
            <Map className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{t.roadmap}</h1>
            <p className="text-muted-foreground text-base sm:text-lg">{t.roadmapDescription}</p>
          </div>
          <Link href={`/?project=${projectSlug}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              {t.backToSuggestions}
            </Button>
          </Link>
        </div>

        <RoadmapList projectSlug={projectSlug} />
      </div>
    </main>
  )
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoadmapPageContent />
    </Suspense>
  )
}
