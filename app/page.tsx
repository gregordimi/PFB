"use client"

import { Lightbulb } from "lucide-react"
import { SuggestionsList } from "@/components/suggestions-list"
import { SubmitSuggestionForm } from "@/components/submit-suggestion-form"
import { SettingsMenu } from "@/components/settings-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Map } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "@/lib/translations"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const t = useTranslations()
  const searchParams = useSearchParams()
  const projectSlug = searchParams.get("project") || "demo"

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-primary text-primary-foreground p-3 sm:p-4 rounded-2xl flex-shrink-0">
            <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">{t.suggestions}</h1>
            <p className="text-muted-foreground text-base sm:text-lg">{t.shareIdeas}</p>
          </div>
          <div className="w-full sm:w-auto sm:flex-shrink-0 flex gap-2">
            <Link href={`/roadmap?project=${projectSlug}`} className="flex-1 sm:flex-initial">
              <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">{t.viewRoadmap}</span>
              </Button>
            </Link>
            <SettingsMenu projectSlug={projectSlug} />
            <SubmitSuggestionForm projectSlug={projectSlug} onSubmit={() => setRefreshKey((k) => k + 1)} />
          </div>
        </div>

        <SuggestionsList key={refreshKey} projectSlug={projectSlug} />
      </div>
    </main>
  )
}
