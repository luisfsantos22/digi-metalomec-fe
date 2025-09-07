import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'
import { EmployeeSkill } from '@/app/types/employee/skill'
import snakecaseKeys from 'snakecase-keys'

interface useCreateSkillEmployeeResult {
  createEmployeeSkill: (
    employeeId: string,
    skillData: EmployeeSkill
  ) => Promise<EmployeeSkill | null>
  loading: boolean
  error: string | null
}

const useCreateEmployeeSkill = (): useCreateSkillEmployeeResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEmployeeSkill = async (
    employeeId: string,
    skillData: EmployeeSkill
  ): Promise<EmployeeSkill | null> => {
    setLoading(true)
    setError(null)

    let payload = snakecaseKeys(skillData, { deep: true })
    payload = { ...payload, employee: employeeId }

    try {
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.skillEmployee,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      if (response.status === 201) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Habilidade Técnica criada com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao criar a habilidade técnica. Tente novamente.',
          position: 'top-right',
        })
      }

      return response.data
    } catch {
      setError('Failed to create skill')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar a habilidade técnica. Tente novamente.',
        position: 'top-right',
      })

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createEmployeeSkill, loading, error }
}

export default useCreateEmployeeSkill
