import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateContractResult {
  createContract: (
    employeeId: string,
    contractData: FormData
  ) => Promise<boolean>
  loading: boolean
  error: string | null
}

const useCreateContract = (): UseCreateContractResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createContract = async (
    employeeId: string,
    contractData: FormData
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Append employee ID to FormData
      contractData.append('employee', employeeId)
      contractData.append('document_type', 'contract')

      const response = await axiosInstance.post(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.documents,
        contractData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 201) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Contrato criado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao criar o contrato. Tente novamente.',
          position: 'top-right',
        })

        return false
      }
    } catch (err) {
      console.error('Failed to create contract:', err)
      setError('Failed to create contract')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o contrato. Tente novamente.',
        position: 'top-right',
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  return { createContract, loading, error }
}

export default useCreateContract
