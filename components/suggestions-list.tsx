"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuggestionCard } from "./suggestion-card"
import type { Suggestion } from "@/types/suggestion"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useTranslations } from "@/lib/translations"

const ITEMS_PER_PAGE = 10

export function SuggestionsList({ projectSlug }: { projectSlug: string }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down">>({})
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)
  const t = useTranslations()

  const fetchSuggestions = async (pageNum = 0, append = false) => {
    const supabase = getSupabaseBrowserClient()

    try {
      if (!append) setIsLoading(true)
      else setIsLoadingMore(true)

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single()

      if (projectError) {
        console.error("[v0] Project lookup error:", projectError)
        throw projectError
      }

      const from = pageNum * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error } = await supabase
        .from("suggestions")
        .select("*")
        .eq("project_id", project.id)
        .order(sortBy === "votes" ? "vote_count" : "created_at", {
          ascending: false,
        })
        .range(from, to)

      if (error) {
        console.error("[v0] Suggestions query error:", error)
        throw error
      }

      setHasMore(data && data.length === ITEMS_PER_PAGE)

      if (append) {
        setSuggestions((prev) => [...prev, ...(data || [])])
      } else {
        setSuggestions(data || [])
      }

      const voterId = localStorage.getItem("voter_id")
      if (voterId && data) {
        const { data: votes } = await supabase
          .from("votes")
          .select("suggestion_id, vote_type")
          .eq("voter_identifier", voterId)
          .in(
            "suggestion_id",
            data.map((s) => s.id),
          )

        const votesMap: Record<string, "up" | "down"> = {}
        votes?.forEach((vote) => {
          votesMap[vote.suggestion_id] = vote.vote_type === 1 ? "up" : "down"
        })
        setUserVotes((prev) => ({ ...prev, ...votesMap }))
      }
    } catch (error) {
      console.error("[v0] Error fetching suggestions:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const handleVoteChange = (suggestionId: string, newVote: "up" | "down" | null, voteCountDelta: number) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, vote_count: s.vote_count + voteCountDelta } : s)),
    )
    setUserVotes((prev) => {
      if (newVote === null) {
        const { [suggestionId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [suggestionId]: newVote }
    })
  }

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchSuggestions(nextPage, true)
      }
    },
    [hasMore, isLoadingMore, isLoading, page],
  )

  useEffect(() => {
    const element = observerTarget.current
    const option = { threshold: 0 }

    const observer = new IntersectionObserver(handleObserver, option)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [handleObserver])

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 50)

    setPage(0)
    setSuggestions([])
    setHasMore(true)
    fetchSuggestions(0, false)

    return () => clearTimeout(timer)
  }, [sortBy, projectSlug])

  if (isLoading) {
    return <div className="text-center py-8 text-sm sm:text-base">{t.loadingSuggestions}</div>
  }

  return (
    <Tabs value={sortBy} className="w-full" onValueChange={(value) => setSortBy(value as "votes" | "recent")}>
      <TabsList className="w-full grid grid-cols-2 h-10 sm:h-11 transition-all duration-200">
        <TabsTrigger value="votes" className="text-sm sm:text-base transition-all duration-200">
          {t.mostVoted}
        </TabsTrigger>
        <TabsTrigger value="recent" className="text-sm sm:text-base transition-all duration-200">
          {t.mostRecent}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="votes"
        className={`space-y-3 sm:space-y-4 mt-4 sm:mt-6 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {suggestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">{t.noSuggestions}</p>
        ) : (
          <>
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
              >
                <SuggestionCard
                  suggestion={suggestion}
                  userVote={userVotes[suggestion.id] || null}
                  onVoteChange={handleVoteChange}
                />
              </div>
            ))}
            <div ref={observerTarget} className="py-4 text-center">
              {isLoadingMore && <p className="text-sm text-muted-foreground">{t.loadingMore}</p>}
              {!hasMore && suggestions.length > 0 && (
                <p className="text-sm text-muted-foreground">{t.noMoreSuggestions}</p>
              )}
            </div>
          </>
        )}
      </TabsContent>
      <TabsContent
        value="recent"
        className={`space-y-3 sm:space-y-4 mt-4 sm:mt-6 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {suggestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm sm:text-base">{t.noSuggestions}</p>
        ) : (
          <>
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
              >
                <SuggestionCard
                  suggestion={suggestion}
                  userVote={userVotes[suggestion.id] || null}
                  onVoteChange={handleVoteChange}
                />
              </div>
            ))}
            <div ref={observerTarget} className="py-4 text-center">
              {isLoadingMore && <p className="text-sm text-muted-foreground">{t.loadingMore}</p>}
              {!hasMore && suggestions.length > 0 && (
                <p className="text-sm text-muted-foreground">{t.noMoreSuggestions}</p>
              )}
            </div>
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
