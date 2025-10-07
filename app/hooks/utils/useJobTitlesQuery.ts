import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import { mapGenericJobTitle } from '@/app/mappers/utils/job-title'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'

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
        const response = await axiosInstance.get(EMPLOYEE_ENDPOINTS.jobTitles, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
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
