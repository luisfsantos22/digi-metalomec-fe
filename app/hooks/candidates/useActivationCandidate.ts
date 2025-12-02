import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../api/endpoints'
import { notifications } from '@mantine/notifications'

export function useActivationCandidate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activationCandidate = async (
    id: string | undefined,
    toActivate: boolean,
    accessToken: string
  ) => {
    if (!id) {
      return false
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.patch(
        CANDIDATE_ENDPOINTS.getCandidateForActivation(id),
        { is_active: toActivate },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: `Candidato ${toActivate ? 'ativado' : 'desativado'} com sucesso!`,
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: `Falha ao ${toActivate ? 'ativar' : 'desativar'} o candidato. Tente novamente.`,
          position: 'top-right',
        })
        setError(
          `Um erro ocorreu ao ${toActivate ? 'ativar' : 'desativar'} o candidato`
        )

        return false
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: `Falha ao ${toActivate ? 'ativar' : 'desativar'} o candidato. Tente novamente.`,
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar o candidato')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { activationCandidate, loading, error }
}
