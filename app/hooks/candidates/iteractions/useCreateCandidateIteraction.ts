import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import snakecaseKeys from 'snakecase-keys'
import { CANDIDATE_ENDPOINTS } from '../../api/endpoints'
import axiosInstance from '../../axiosInstance'

interface UseCreateCandidateIteractionResult {
  createCandidateIteraction: (iteractionData: any) => Promise<string | null>
  loading: boolean
  error: string | null
}

const useCreateCandidateIteraction = (): UseCreateCandidateIteractionResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createCandidateIteraction = async (iteractionData: any) => {
    setLoading(true)
    setError(null)

    const payload = snakecaseKeys(iteractionData, { deep: true })
    try {
      const response = await axiosInstance.post(
        CANDIDATE_ENDPOINTS.getCandidatesIteractions(),
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      const id = response?.data?.id || null
      if (!id) {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao criar a interação do candidato. Tente novamente.',
          position: 'top-right',
        })

        return null
      }
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Iteração criada com sucesso!',
        position: 'top-right',
      })

      return id
    } catch {
      setError('Failed to create candidate interaction')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar a interação do candidato. Tente novamente.',
        position: 'top-right',
      })

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCandidateIteraction, loading, error }
}

export default useCreateCandidateIteraction
