import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'

export function useDeleteDocument() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDocument = async (
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
          message: 'Documento eliminado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar o documento. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar o documento')

        return false
      }
    } catch (err) {
      console.error('Failed to delete document:', err)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar o documento. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar o documento')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteDocument, loading, error }
}
