import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'

export function useDeleteEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteEmployee = async (
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
        EMPLOYEE_ENDPOINTS.getEmployeeById(id),
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
          message: 'Colaborador eliminado com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar o colaborador. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar o colaborador')
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar o colaborador. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar o colaborador')
    } finally {
      setLoading(false)
    }
  }

  return { deleteEmployee, loading, error }
}
