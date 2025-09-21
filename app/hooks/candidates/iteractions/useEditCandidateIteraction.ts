import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import snakecaseKeys from 'snakecase-keys'
import { useSession } from 'next-auth/react'
import axiosInstance from '../../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../../api/endpoints'

export function useEditCandidateIteraction() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editCandidateIteraction = async (
    id: string | undefined,
    iteractionData: any
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    let payload = snakecaseKeys(iteractionData, { deep: true })
    payload = { ...payload }

    try {
      const response = await axiosInstance.put(
        CANDIDATE_ENDPOINTS.getCandidateIteractionById(id),
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Iteração editada com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar a interação do candidato. Tente novamente.',
          position: 'top-right',
        })
      }

      return response.data
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar a interação do candidato. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar a interação do candidato')
    } finally {
      setLoading(false)
    }
  }

  return { editCandidateIteraction, loading, error }
}
