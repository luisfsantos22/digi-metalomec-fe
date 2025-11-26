import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import snakecaseKeys from 'snakecase-keys'
import axiosInstance from '../axiosInstance'
import { CANDIDATE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import { useSession } from 'next-auth/react'

export function useUpdateCandidate() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editCandidate = async (id: string | undefined, candidateData: any) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    let payload = snakecaseKeys(candidateData, { deep: true })
    payload = { ...payload }

    try {
      const response = await axiosInstance.put(
        CANDIDATE_ENDPOINTS.getCandidateById(id),
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
          message: 'Candidato editado com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar o candidato. Tente novamente.',
          position: 'top-right',
        })
      }

      return response.data
    } catch (err: any) {
      const validationErrors = err?.response?.data
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar o candidato. Tente novamente.',
        position: 'top-right',
      })
      setError(validationErrors || 'Um erro ocorreu ao editar o candidato')
      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { editCandidate, loading, error }
}
