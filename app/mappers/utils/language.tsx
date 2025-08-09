import { Language } from '@/app/types/utils/Language'

export const mapLanguage = (lang: Language) => {
  return {
    id: lang.id,
    name: lang.name,
  }
}
