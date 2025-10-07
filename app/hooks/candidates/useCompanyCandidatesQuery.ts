import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useDebouncedValue from '../useDebouncedValue'
import axiosInstance from '../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../api/endpoints'
import { GenericCandidate } from '@/app/types/candidate/candidate'
import { mapGenericCandidate } from '@/app/mappers/candidate/candidate'

interface useCompanyCandidatesQueryResult {
  candidates: GenericCandidate[]
  loading: boolean
  error: string | null
  count: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

const useCompanyCandidatesQuery = (
  page: number,
  searchQuery: string = '',
  jobTitleFilter: string = '',
  phoneFilter: string = '',
  refreshFlag: boolean = false
): useCompanyCandidatesQueryResult => {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState<GenericCandidate[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000)
  const debouncedJobTitleFilter = useDebouncedValue(jobTitleFilter, 1000)
  const debouncedPhoneFilter = useDebouncedValue(phoneFilter, 1000)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        // Build params only with non-empty values
        const params: Record<string, any> = {}
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== '')
          params.keyword = debouncedSearchQuery
        if (debouncedJobTitleFilter && debouncedJobTitleFilter.trim() !== '')
          params.job_title = debouncedJobTitleFilter
        if (debouncedPhoneFilter && debouncedPhoneFilter.trim() !== '')
          params.phone = debouncedPhoneFilter

        const response = await axiosInstance.get(
          CANDIDATE_ENDPOINTS.getCandidatesPage(page),
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            params,
          }
        )
        const count = response.data.count
        const dataResults = response.data.results
        const mappedResults = dataResults.map((candidate: any) =>
          mapGenericCandidate(candidate)
        )
        setCount(count)
        setCandidates(mappedResults)
      } catch {
        setError('Failed to fetch candidates')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchUsers()
    }
  }, [
    session?.accessToken,
    page,
    debouncedSearchQuery,
    debouncedJobTitleFilter,
    debouncedPhoneFilter,
    refreshFlag,
  ])

  return { candidates, loading, error, count }
}

export default useCompanyCandidatesQuery
