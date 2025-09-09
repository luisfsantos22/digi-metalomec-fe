import { Language } from '@/app/types/utils/language'

export const mapLanguage = (lang: Language) => {
  return {
    id: lang.id,
    name: lang.name,
  }
}
