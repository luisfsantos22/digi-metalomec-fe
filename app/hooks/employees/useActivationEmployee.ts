import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import { notifications } from '@mantine/notifications'

export function useActivationEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activationEmployee = async (
    id: string | undefined,
    toActivate: boolean,
    accessToken: string
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.patch(
        EMPLOYEE_ENDPOINTS.getEmployeeForActivation(id),
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
          message: `Colaborador ${toActivate ? 'ativado' : 'desativado'} com sucesso!`,
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: `Falha ao ${toActivate ? 'ativar' : 'desativar'} o colaborador. Tente novamente.`,
          position: 'top-right',
        })
        setError(
          `Um erro ocorreu ao ${toActivate ? 'ativar' : 'desativar'} o colaborador`
        )
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: `Falha ao ${toActivate ? 'ativar' : 'desativar'} o colaborador. Tente novamente.`,
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar o colaborador')
    } finally {
      setLoading(false)
    }
  }

  return { activationEmployee, loading, error }
}
