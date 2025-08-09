import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'

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

    try {
      await axiosInstance.post('/employees/', employeeData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
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
