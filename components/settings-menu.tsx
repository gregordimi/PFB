"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "./settings-dialog"
import { useTranslations } from "@/lib/translations"

interface SettingsMenuProps {
  projectSlug: string
}

export function SettingsMenu({ projectSlug }: SettingsMenuProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 sm:h-11 sm:w-11 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">{t.settings}</span>
      </Button>

      <SettingsDialog open={open} onOpenChange={setOpen} projectSlug={projectSlug} />
    </>
  )
}
