import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateEmployeeResult {
  createEmployee: (employeeData: any) => Promise<string | null | any>
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
    try {
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.employees,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )

      // Check if response is actually an error string (backend returns 200 with error text)
      if (
        typeof response?.data === 'string' &&
        response.data.includes('duplicate key')
      ) {
        return { detail: response.data }
      }

      const id = response?.data?.id || null

      if (id) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Colaborador criado com sucesso!',
          position: 'top-right',
        })
        router.push(`/employee/details/${id}/`)
      }

      return id
    } catch (err: any) {
      const validationErrors = err?.response?.data
      setError(validationErrors || 'Failed to create employee')

      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { createEmployee, loading, error }
}

export default useCreateEmployee
