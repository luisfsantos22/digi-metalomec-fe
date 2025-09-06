import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import { Certification } from '@/app/types/employee/employee'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'
import { Skill } from '@/app/types/employee/skill'

interface useCreateSkillResult {
  createSkill: (skillData: Skill) => Promise<Skill | null>
  loading: boolean
  error: string | null
}

const useCreateSkill = (): useCreateSkillResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSkill = async (skillData: Skill): Promise<Skill | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.skills,
        skillData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Habilidade Técnica criada com sucesso!',
        position: 'top-right',
      })

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

  return { createSkill, loading, error }
}

export default useCreateSkill
