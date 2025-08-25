import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateEmployeeResult {
  createEmployee: (employeeData: any) => Promise<void>
  loading: boolean
  error: string | null
}

const useCreateEmployee = (): UseCreateEmployeeResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createEmployee = async (employeeData: any) => {
    setLoading(true)
    setError(null)

    const payload = snakecaseKeys(employeeData, { deep: true })
    console.log('Payload to create employee:', payload)
    //#TODO: fix add
    try {
      await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.employees,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Colaborador criado com sucesso!',
        position: 'top-right',
      })
      router.push('/dashboard?module=employees')
    } catch {
      setError('Failed to create employee')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o colaborador. Tente novamente.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  return { createEmployee, loading, error }
}

export default useCreateEmployee
