import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'

export function useEditContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editContract = async (
    id: string | undefined,
    employeeId: string,
    contractData: FormData,
    accessToken: string
  ) => {
    if (!id) {
      return false
    }
    setLoading(true)
    setError(null)

    try {
      // Append employee ID to FormData if not already present
      contractData.append('employee', employeeId)
      contractData.append('document_type', 'contract')

      const response = await axiosInstance.put(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.getDocumentById(id),
        contractData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Contrato editado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar o contrato. Tente novamente.',
          position: 'top-right',
        })

        return false
      }
    } catch (err) {
      console.error('Failed to edit contract:', err)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar o contrato. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar o contrato')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { editContract, loading, error }
}
