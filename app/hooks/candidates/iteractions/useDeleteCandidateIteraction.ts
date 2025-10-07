import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../../api/endpoints'

export function useDeleteCandidateIteraction() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteCandidateIteraction = async (
    id: string | undefined,
    accessToken: string
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.delete(
        CANDIDATE_ENDPOINTS.getCandidateIteractionById(id),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 204) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Iteração eliminada com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar a iteração. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar a iteração')

        return false
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar a iteração. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar a iteração')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteCandidateIteraction, loading, error }
}
