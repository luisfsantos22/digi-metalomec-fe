import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'

export function useEditSkill() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editSkill = async (
    id: string | undefined,
    skillData: any,
    accessToken: string
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.put(
        EMPLOYEE_ENDPOINTS.getSkillById(id),
        skillData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Habilidade técnica editada com sucesso!',
        position: 'top-right',
      })

      return response.data
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar a habilidade técnica. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar a habilidade técnica')
    } finally {
      setLoading(false)
    }
  }

  return { editSkill, loading, error }
}
