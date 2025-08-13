import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import { mapGenericJobTitle } from '@/app/mappers/utils/job-title'

export const useJobTitlesQuery = () => {
  const { data: session } = useSession()
  const [jobTitles, setJobTitles] = useState<GenericJobTitle[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobTitles = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(
          '/api/v1/employees/job-titles/',
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        const dataResults = response.data || []
        const mappedResults = dataResults.map((job: GenericJobTitle) =>
          mapGenericJobTitle(job)
        )

        setJobTitles(mappedResults)
      } catch {
        setError('Failed to fetch job titles')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchJobTitles()
    }
  }, [session?.accessToken])

  return { jobTitles, loading, error }
}
