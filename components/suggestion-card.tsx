"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronUp, ChevronDown } from "lucide-react"
import type { Suggestion } from "@/types/suggestion"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useTranslations } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"

interface SuggestionCardProps {
  suggestion: Suggestion
  userVote: "up" | "down" | null
  onVoteChange: (suggestionId: string, newVote: "up" | "down" | null, voteCountDelta: number) => void
}

export function SuggestionCard({ suggestion, userVote, onVoteChange }: SuggestionCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [optimisticVoteCount, setOptimisticVoteCount] = useState(suggestion.vote_count)
  const [optimisticUserVote, setOptimisticUserVote] = useState(userVote)
  const t = useTranslations()
  const { toast } = useToast()

  const handleVote = async (voteType: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation()
    if (isVoting) return

    setIsVoting(true)
    const supabase = getSupabaseBrowserClient()

    let voteCountDelta = 0
    let newVote: "up" | "down" | null = null

    if (optimisticUserVote === voteType) {
      // Removing vote
      voteCountDelta = voteType === "up" ? -1 : 1
      newVote = null
    } else if (optimisticUserVote) {
      // Changing vote
      voteCountDelta = voteType === "up" ? 2 : -2
      newVote = voteType
    } else {
      // Adding new vote
      voteCountDelta = voteType === "up" ? 1 : -1
      newVote = voteType
    }

    setOptimisticVoteCount((prev) => prev + voteCountDelta)
    setOptimisticUserVote(newVote)
    onVoteChange(suggestion.id, newVote, voteCountDelta)

    try {
      const voterId = localStorage.getItem("voter_id") || `voter_${Math.random().toString(36).substring(7)}`
      localStorage.setItem("voter_id", voterId)

      const voteValue = voteType === "up" ? 1 : -1

      if (userVote === voteType) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("suggestion_id", suggestion.id)
          .eq("voter_identifier", voterId)

        if (deleteError) throw deleteError

        toast({
          title: t.toastVoteRemoved,
          variant: "default",
        })
      } else {
        // Remove existing vote if any
        if (userVote) {
          const { error: deleteError } = await supabase
            .from("votes")
            .delete()
            .eq("suggestion_id", suggestion.id)
            .eq("voter_identifier", voterId)

          if (deleteError) throw deleteError
        }

        // Insert new vote
        const { error: insertError } = await supabase.from("votes").insert({
          suggestion_id: suggestion.id,
          voter_identifier: voterId,
          vote_type: voteValue,
        })

        if (insertError) throw insertError

        toast({
          title: t.toastVoteSuccess,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("[v0] Error voting:", error)
      setOptimisticVoteCount((prev) => prev - voteCountDelta)
      setOptimisticUserVote(optimisticUserVote)
      onVoteChange(suggestion.id, optimisticUserVote, -voteCountDelta)

      toast({
        title: t.toastVoteError,
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 60) return t.minutesAgo(diffInMinutes)
    if (diffInMinutes < 1440) return t.hoursAgo(Math.floor(diffInMinutes / 60))
    return t.daysAgo(Math.floor(diffInMinutes / 1440))
  }

  return (
    <>
      <Card
        className="min-h-[160px] sm:min-h-[180px] flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader className="flex-none pb-2 sm:pb-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 flex-none">
              <Button
                variant={optimisticUserVote === "up" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => handleVote("up", e)}
                disabled={isVoting}
              >
                <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-semibold min-w-[1.5rem] text-center">{optimisticVoteCount}</span>
              <Button
                variant={optimisticUserVote === "down" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9"
                onClick={(e) => handleVote("down", e)}
                disabled={isVoting}
              >
                <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl flex-1 leading-tight">{suggestion.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0 min-h-0">
          {suggestion.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-2">
              {suggestion.description}
            </p>
          )}
          <div className="flex justify-end pt-1 sm:pt-2">
            <Badge variant="secondary" className="text-xs">
              {formatTimeAgo(suggestion.created_at)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl lg:text-3xl pr-8">{suggestion.title}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              {formatTimeAgo(suggestion.created_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {suggestion.description && <p className="text-sm sm:text-base leading-relaxed">{suggestion.description}</p>}
            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant={optimisticUserVote === "up" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  onClick={(e) => handleVote("up", e)}
                  disabled={isVoting}
                >
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <span className="text-base sm:text-lg font-semibold min-w-[2rem] sm:min-w-[2.5rem] text-center">
                  {optimisticVoteCount}
                </span>
                <Button
                  variant={optimisticUserVote === "down" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  onClick={(e) => handleVote("down", e)}
                  disabled={isVoting}
                >
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">{t.vote(optimisticVoteCount)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
