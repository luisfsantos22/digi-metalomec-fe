import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'

export function useDeleteSkill() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteSkill = async (id: string | undefined, accessToken: string) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.delete(
        EMPLOYEE_ENDPOINTS.getSkillById(id),
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
          message: 'Habilidade técnica eliminada com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar a habilidade técnica. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar a habilidade técnica')
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar a habilidade técnica. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar a habilidade técnica')
    } finally {
      setLoading(false)
    }
  }

  return { deleteSkill, loading, error }
}
