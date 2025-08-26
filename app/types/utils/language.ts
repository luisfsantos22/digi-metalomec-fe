type Language = {
  id: string
  name: string
}

type UserLanguage = Language & {
  proficiency?: string // e.g., 'Fluent', 'Intermediate', 'Beginner'
}

export type { Language, UserLanguage }
