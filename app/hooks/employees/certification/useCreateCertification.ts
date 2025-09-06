import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import { Certification } from '@/app/types/employee/employee'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'

interface useCreateCertificationResult {
  createCertification: (
    certificationData: Certification
  ) => Promise<Certification | null>
  loading: boolean
  error: string | null
}

const useCreateCertification = (): useCreateCertificationResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCertification = async (
    certificationData: Certification
  ): Promise<Certification | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.certifications,
        certificationData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Certificação criada com sucesso!',
        position: 'top-right',
      })

      return response.data
    } catch {
      setError('Failed to create certification')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar a certificação. Tente novamente.',
        position: 'top-right',
      })

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCertification, loading, error }
}

export default useCreateCertification
