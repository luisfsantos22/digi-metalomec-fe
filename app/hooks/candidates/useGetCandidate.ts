import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../api/endpoints'
import { useSession } from 'next-auth/react'
import { GenericCandidate } from '@/app/types/candidate/candidate'
import { mapGenericCandidate } from '@/app/mappers/candidate/candidate'

const useGetCandidate = (candidateId: string, deps: any[] = []) => {
  const { data: session } = useSession()
  const [candidate, setCandidate] = useState<GenericCandidate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.accessToken || !candidateId) {
      return
    }
    const fetchCandidate = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = CANDIDATE_ENDPOINTS.getCandidateById(candidateId)
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const candidate = mapGenericCandidate(response.data)
        setCandidate(candidate)
      } catch (err) {
        console.error('Failed to fetch candidate:', err)
        setError('Failed to fetch candidate')
      } finally {
        setLoading(false)
      }
    }
    fetchCandidate()
  }, [session?.accessToken, candidateId, ...deps])

  return { loading, error, candidate }
}

export default useGetCandidate
