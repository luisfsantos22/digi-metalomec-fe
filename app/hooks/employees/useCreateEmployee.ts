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
      console.log('Starting createEmployee request...')
      const response = await axiosInstance.post(
        EMPLOYEE_ENDPOINTS.employees,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      console.log('Request successful, response:', response)
      
      // Check if response is actually an error string (backend returns 200 with error text)
      if (typeof response?.data === 'string' && response.data.includes('duplicate key')) {
        console.log('Detected error string in 200 response')
        const validationErrors = {
          detail: response.data
        }
        console.log('Returning validationErrors:', validationErrors)
        return validationErrors
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

      console.log('Returning id:', id)
      return id
    } catch (err: any) {
      console.log('useCreateEmployee catch block:', err)
      console.log('err.response:', err?.response)
      console.log('err.response.data:', err?.response?.data)
      
      const validationErrors = err?.response?.data
      setError(validationErrors || 'Failed to create employee')

      console.log('Returning validationErrors:', validationErrors)
      // Return validation errors to be handled by the component
      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { createEmployee, loading, error }
}

export default useCreateEmployee
