import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'

interface useCreateJobTitleResult {
  createJobTitle: (
    jobTitleData: GenericJobTitle
  ) => Promise<GenericJobTitle | null>
  loading: boolean
  error: string | null
}

const useCreateJobTitle = (): useCreateJobTitleResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createJobTitle = async (
    jobTitleData: GenericJobTitle
  ): Promise<GenericJobTitle | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.jobTitles,
        jobTitleData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Cargo criado com sucesso!',
        position: 'top-right',
      })

      return response.data
    } catch {
      setError('Failed to create job title')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o cargo. Tente novamente.',
        position: 'top-right',
      })

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createJobTitle, loading, error }
}

export default useCreateJobTitle
