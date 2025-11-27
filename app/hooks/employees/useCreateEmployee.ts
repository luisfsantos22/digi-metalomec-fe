import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateEmployeeResult {
  createEmployee: (employeeData: any) => Promise<string | null>
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
      const id = response?.data?.id || null
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Colaborador criado com sucesso!',
        position: 'top-right',
      })
      router.push(`/employee/details/${id}/`)

      return id
    } catch (err: any) {
      const validationErrors = err?.response?.data
      setError(validationErrors || 'Failed to create employee')

      // If server provided structured validation errors (or detail), return them to the caller
      // and let the UI determine the exact message to display (prevents generic toast for validation failures).
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        return validationErrors
      }

      // Unknown/non-validation error -> show generic notification and return
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o colaborador. Tente novamente.',
        position: 'top-right',
      })

      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { createEmployee, loading, error }
}

export default useCreateEmployee
