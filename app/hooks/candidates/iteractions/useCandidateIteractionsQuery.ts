import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { CandidateIteraction } from '@/app/types/candidate/candidate'
import { mapGenericCandidateIteraction } from '@/app/mappers/candidate/candidate'
import axiosInstance from '../../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../../api/endpoints'

interface useCandidateIteractionsQueryResult {
  iteractions: CandidateIteraction[]
  loading: boolean
  error: string | null
  count: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

const useCandidateIteractionsQuery = (
  candidateId: string,
  page?: number | null,
  refreshFlag: boolean = false
): useCandidateIteractionsQueryResult => {
  const { data: session } = useSession()
  const [iteractions, setIteractions] = useState<CandidateIteraction[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(
          page
            ? CANDIDATE_ENDPOINTS.getCandidatesIteractionsPage(
                candidateId,
                page
              )
            : CANDIDATE_ENDPOINTS.getCandidatesIteractions(candidateId),
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        if (page) {
          const count = response.data.count
          const dataResults = response.data.results
          const mappedResults = dataResults.map((iteraction: any) =>
            mapGenericCandidateIteraction(iteraction)
          )
          setCount(count)
          setIteractions(mappedResults)
        } else {
          const dataResults = response.data || []
          const mappedResults = dataResults.map((iteraction: any) =>
            mapGenericCandidateIteraction(iteraction)
          )
          setIteractions(mappedResults)
        }
      } catch {
        setError('Failed to fetch candidates')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchUsers()
    }
  }, [session?.accessToken, page, refreshFlag])

  return { iteractions, loading, error, count }
}

export default useCandidateIteractionsQuery
