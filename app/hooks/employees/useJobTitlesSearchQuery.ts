import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { useSession } from 'next-auth/react'
import { GenericJobTitle } from '@/app/types/utils/job-title'

interface UseJobTitlesSearchQueryResult {
  jobTitles: GenericJobTitle[]
  search: string
  setSearch: (value: string) => void
  loading: boolean
  error: string | null
}

const useJobTitlesSearchQuery = (): UseJobTitlesSearchQueryResult => {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const [jobTitles, setJobTitles] = useState<GenericJobTitle[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!search) {
      setJobTitles([])

      return
    }

    const fetchJobTitles = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(
          '/api/v1/employees/job-title/search/',
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            params: { keyword: search },
          }
        )
        setJobTitles(response.data)
      } catch {
        setError('Failed to fetch job titles')
      } finally {
        setLoading(false)
      }
    }
    fetchJobTitles()
  }, [search, session?.accessToken])

  return { jobTitles, search, setSearch, loading, error }
}

export default useJobTitlesSearchQuery
