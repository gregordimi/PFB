"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Globe, User, FolderOpen } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTranslations, getLanguage, setLanguage, type Language } from "@/lib/translations"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectSlug: string
}

export function SettingsDialog({ open, onOpenChange, projectSlug }: SettingsDialogProps) {
  const t = useTranslations()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [language, setLanguageState] = useState<Language>("bg")
  const [voterId, setVoterId] = useState<string>("")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme("system")
    }

    // Load language
    setLanguageState(getLanguage())

    // Load voter ID
    const id = localStorage.getItem("voter_id") || "Anonymous"
    setVoterId(id)
  }, [])

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", newTheme === "dark")
    }
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{t.settingsTitle}</DialogTitle>
          <DialogDescription>{t.settingsDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{t.appearance}</h3>
            </div>

            <div className="space-y-3 pl-7">
              <Label>{t.theme}</Label>
              <RadioGroup value={theme} onValueChange={handleThemeChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="font-normal cursor-pointer flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    {t.themeLight}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="font-normal cursor-pointer flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    {t.themeDark}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="font-normal cursor-pointer flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    {t.themeSystem}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{t.language}</h3>
            </div>

            <div className="space-y-3 pl-7">
              <RadioGroup value={language} onValueChange={handleLanguageChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bg" id="bg" />
                  <Label htmlFor="bg" className="font-normal cursor-pointer">
                    {t.languageBulgarian}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="font-normal cursor-pointer">
                    {t.languageEnglish}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* User Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{t.userInfo}</h3>
            </div>

            <div className="space-y-2 pl-7">
              <Label className="text-muted-foreground">{t.username}</Label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">{voterId}</p>
            </div>
          </div>

          {/* Project Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">{t.projectInfo}</h3>
            </div>

            <div className="space-y-2 pl-7">
              <Label className="text-muted-foreground">{t.projectName}</Label>
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md">{projectSlug}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
