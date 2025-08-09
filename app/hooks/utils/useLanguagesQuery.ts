import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { Language } from '@/app/types/utils/Language'
import { mapLanguage } from '@/app/mappers/utils/language'

export const useLanguagesQuery = () => {
  const { data: session } = useSession()
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get('/api/v1/languages/', {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const dataResults = response.data || []
        const mappedResults = dataResults.map((lang: Language) =>
          mapLanguage(lang)
        )

        setLanguages(mappedResults)
      } catch {
        setError('Failed to fetch languages')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchLanguages()
    }
  }, [session?.accessToken])

  return { languages, loading, error }
}
