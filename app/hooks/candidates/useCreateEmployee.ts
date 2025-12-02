import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { CANDIDATE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateCandidateResult {
  createCandidate: (candidateData: any) => Promise<string | null | any>
  loading: boolean
  error: string | null
}

const useCreateCandidate = (): UseCreateCandidateResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createCandidate = async (candidateData: any) => {
    setLoading(true)
    setError(null)

    const payload = snakecaseKeys(candidateData, { deep: true })
    try {
      const response = await axiosInstance.post(
        CANDIDATE_ENDPOINTS.candidates,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )

      // Check if response is actually an error string (backend returns 200 with error text)
      if (
        typeof response?.data === 'string' &&
        response.data.includes('duplicate key')
      ) {
        const validationErrors = {
          detail: response.data,
        }
        return validationErrors
      }

      const id = response?.data?.id || null

      if (id) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Candidato criado com sucesso!',
          position: 'top-right',
        })
        router.push(`/candidate/details/${id}/`)
      }

      return id
    } catch (err: any) {
      const validationErrors = err?.response?.data
      setError(validationErrors || 'Failed to create candidate')

      // Return validation errors to be handled by the component
      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { createCandidate, loading, error }
}

export default useCreateCandidate
