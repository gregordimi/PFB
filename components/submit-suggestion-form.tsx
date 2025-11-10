"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useTranslations } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"

export function SubmitSuggestionForm({ projectSlug, onSubmit }: { projectSlug: string; onSubmit: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contact, setContact] = useState("") // Added contact state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    const supabase = getSupabaseBrowserClient()

    try {
      console.log("[v0] Looking up project with slug:", projectSlug)

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single()

      if (projectError) {
        console.error("[v0] Project lookup error:", projectError)
        throw projectError
      }

      console.log("[v0] Found project for submission:", project)

      const { data: insertedData, error } = await supabase
        .from("suggestions")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          contact: contact.trim() || null,
          project_id: project.id,
        })
        .select()

      if (error) {
        console.error("[v0] Insert error:", error)
        throw error
      }

      console.log("[v0] Successfully inserted suggestion:", insertedData)

      toast({
        title: t.toastSuggestionSuccess,
        variant: "default",
      })

      setTitle("")
      setDescription("")
      setContact("") // Reset contact field
      setIsOpen(false)
      onSubmit()
    } catch (error) {
      console.error("Error submitting suggestion:", error)
      toast({
        title: t.toastSuggestionError,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          {t.submitSuggestion}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.submitFormTitle}</DialogTitle>
          <DialogDescription>{t.submitFormDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.titleLabel}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              maxLength={500}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">{t.contactLabel}</Label>
            <Input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t.contactPlaceholder}
              maxLength={100}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
