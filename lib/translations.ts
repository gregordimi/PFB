"use client"

export type Language = "bg" | "en"

const translationsBg = {
  // Page header
  suggestions: "Предложения",
  shareIdeas: "Споделете вашите идеи и гласувайте за предложения от общността",
  submitSuggestion: "Изпрати предложение",

  // Tabs
  mostVoted: "Най-гласувани",
  mostRecent: "Най-нови",

  // Empty states
  noSuggestions: "Все още няма предложения. Бъдете първият, който ще изпрати такова!",
  loadingSuggestions: "Зареждане на предложения...",

  // Time formatting
  minutesAgo: (count: number) => `преди ${count} ${count === 1 ? "минута" : "минути"}`,
  hoursAgo: (count: number) => `преди ${count} ${count === 1 ? "час" : "часа"}`,
  daysAgo: (count: number) => `преди ${count} ${count === 1 ? "ден" : "дни"}`,

  // Voting
  vote: (count: number) => `${count} ${count === 1 ? "глас" : "гласа"}`,

  // Submit form
  submitFormTitle: "Изпратете предложение",
  submitFormDescription: "Споделете вашата идея с общността",
  titleLabel: "Заглавие *",
  titlePlaceholder: "Въведете ясно и кратко заглавие",
  descriptionLabel: "Описание (по избор)",
  descriptionPlaceholder: "Предоставете повече детайли за вашето предложение",
  contactLabel: "Контакт (по избор)",
  contactPlaceholder: "Имейл или телефон за обратна връзка",
  cancel: "Отказ",
  submit: "Изпрати",
  submitting: "Изпращане...",

  // Error messages for missing project
  errorTitle: "Нещо се обърка",
  noProjectSelected: "Не е избран проект. Моля, свържете се с администратора.",

  // Toast notifications
  toastVoteSuccess: "Гласът ви беше записан успешно",
  toastVoteRemoved: "Гласът ви беше премахнат",
  toastVoteError: "Грешка при гласуване. Моля, опитайте отново.",
  toastSuggestionSuccess: "Предложението беше изпратено успешно",
  toastSuggestionError: "Грешка при изпращане на предложението. Моля, опитайте отново.",

  // Settings menu translations
  settings: "Настройки",
  projectSettings: "Настройки на проекта",
  currentProject: "Текущ проект",
  loadingMore: "Зареждане на още...",
  noMoreSuggestions: "Няма повече предложения",

  // Settings page
  settingsTitle: "Настройки",
  settingsDescription: "Управлявайте вашите предпочитания",
  appearance: "Външен вид",
  theme: "Тема",
  themeLight: "Светла",
  themeDark: "Тъмна",
  themeSystem: "Системна",
  language: "Език",
  languageBulgarian: "Български",
  languageEnglish: "English",
  userInfo: "Потребителска информация",
  username: "Потребителско име",
  projectInfo: "Информация за проекта",
  projectName: "Име на проекта",

  // Roadmap/Status page
  roadmap: "Пътна карта",
  roadmapDescription: "Вижте какво планираме и какво разработваме",
  statusPlanned: "Планирано",
  statusTodo: "За изпълнение",
  statusDoing: "В процес",
  statusDone: "Завършено",
  noRoadmapItems: "Все още няма елементи в пътната карта",
  loadingRoadmap: "Зареждане на пътната карта...",
  backToSuggestions: "Обратно към предложенията",
  viewRoadmap: "Виж пътната карта",
} as const

const translationsEn = {
  // Page header
  suggestions: "Suggestions",
  shareIdeas: "Share your ideas and vote on suggestions from the community",
  submitSuggestion: "Submit Suggestion",

  // Tabs
  mostVoted: "Most Voted",
  mostRecent: "Most Recent",

  // Empty states
  noSuggestions: "No suggestions yet. Be the first to submit one!",
  loadingSuggestions: "Loading suggestions...",

  // Time formatting
  minutesAgo: (count: number) => `${count} minute${count === 1 ? "" : "s"} ago`,
  hoursAgo: (count: number) => `${count} hour${count === 1 ? "" : "s"} ago`,
  daysAgo: (count: number) => `${count} day${count === 1 ? "" : "s"} ago`,

  // Voting
  vote: (count: number) => `${count} vote${count === 1 ? "" : "s"}`,

  // Submit form
  submitFormTitle: "Submit a Suggestion",
  submitFormDescription: "Share your idea with the community",
  titleLabel: "Title *",
  titlePlaceholder: "Enter a clear and concise title",
  descriptionLabel: "Description (optional)",
  descriptionPlaceholder: "Provide more details about your suggestion",
  contactLabel: "Contact (optional)",
  contactPlaceholder: "Email or phone for feedback",
  cancel: "Cancel",
  submit: "Submit",
  submitting: "Submitting...",

  // Error messages for missing project
  errorTitle: "Something went wrong",
  noProjectSelected: "No project selected. Please contact the administrator.",

  // Toast notifications
  toastVoteSuccess: "Your vote was recorded successfully",
  toastVoteRemoved: "Your vote was removed",
  toastVoteError: "Error voting. Please try again.",
  toastSuggestionSuccess: "Suggestion submitted successfully",
  toastSuggestionError: "Error submitting suggestion. Please try again.",

  // Settings menu translations
  settings: "Settings",
  projectSettings: "Project Settings",
  currentProject: "Current Project",
  loadingMore: "Loading more...",
  noMoreSuggestions: "No more suggestions",

  // Settings page
  settingsTitle: "Settings",
  settingsDescription: "Manage your preferences",
  appearance: "Appearance",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
  language: "Language",
  languageBulgarian: "Български",
  languageEnglish: "English",
  userInfo: "User Information",
  username: "Username",
  projectInfo: "Project Information",
  projectName: "Project Name",

  // Roadmap/Status page
  roadmap: "Roadmap",
  roadmapDescription: "See what we're planning and working on",
  statusPlanned: "Planned",
  statusTodo: "To Do",
  statusDoing: "In Progress",
  statusDone: "Done",
  noRoadmapItems: "No roadmap items yet",
  loadingRoadmap: "Loading roadmap...",
  backToSuggestions: "Back to Suggestions",
  viewRoadmap: "View Roadmap",
} as const

export function useTranslations() {
  if (typeof window === "undefined") return translationsEn

  const language = (localStorage.getItem("language") as Language) || "en"
  return language === "en" ? translationsEn : translationsBg
}

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"
  return (localStorage.getItem("language") as Language) || "en"
}

export function setLanguage(lang: Language) {
  localStorage.setItem("language", lang)
  window.location.reload()
}
