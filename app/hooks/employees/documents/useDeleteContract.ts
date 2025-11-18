import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'

export function useDeleteContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteContract = async (
    id: string | undefined,
    accessToken: string
  ) => {
    if (!id) {
      return false
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.delete(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.getDocumentById(id),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 204) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Contrato eliminado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar o contrato. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar o contrato')

        return false
      }
    } catch (err) {
      console.error('Failed to delete contract:', err)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar o contrato. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar o contrato')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteContract, loading, error }
}
