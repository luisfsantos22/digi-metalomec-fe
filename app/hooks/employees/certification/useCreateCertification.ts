import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { EmployeeCertification } from '@/app/types/employee/employee'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface useCreateEmployeeCertificationResult {
  createEmployeeCertification: (
    employeeId: string,
    certificationData: EmployeeCertification
  ) => Promise<EmployeeCertification | null>
  loading: boolean
  error: string | null
}

const useCreateEmployeeCertification =
  (): useCreateEmployeeCertificationResult => {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createEmployeeCertification = async (
      employeeId: string,
      certificationData: EmployeeCertification
    ): Promise<EmployeeCertification | null> => {
      setLoading(true)
      setError(null)

      let payload = snakecaseKeys(certificationData, { deep: true })
      payload = { ...payload, employee: employeeId }
      try {
        const response = await axiosInstance.post(
          EMPLOYEE_ENDPOINTS.employeeCertification,
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
            message: 'Certificação criada com sucesso!',
            position: 'top-right',
          })
        } else {
          notifications.show({
            title: 'Erro',
            color: 'red',
            message: 'Falha ao criar a certificação. Tente novamente.',
            position: 'top-right',
          })
        }

        return response.data
      } catch {
        console.error('Failed to create certification')
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

    return { createEmployeeCertification, loading, error }
  }

export default useCreateEmployeeCertification
