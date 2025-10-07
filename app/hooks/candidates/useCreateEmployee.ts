import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { CANDIDATE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateCandidateResult {
  createCandidate: (candidateData: any) => Promise<string | null>
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
      const id = response?.data?.id || null
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Candidato criado com sucesso!',
        position: 'top-right',
      })
      router.push(`/candidate/details/${id}/`)

      return id
    } catch {
      setError('Failed to create candidate')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o candidato. Tente novamente.',
        position: 'top-right',
      })

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCandidate, loading, error }
}

export default useCreateCandidate
