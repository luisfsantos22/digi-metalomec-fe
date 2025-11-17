import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface UseCreateDocumentResult {
  createDocument: (
    employeeId: string,
    documentData: FormData
  ) => Promise<boolean>
  loading: boolean
  error: string | null
}

const useCreateDocument = (): UseCreateDocumentResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDocument = async (
    employeeId: string,
    documentData: FormData
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Append employee ID to FormData
      documentData.append('employee', employeeId)
      documentData.append('document_type', 'other')

      const response = await axiosInstance.post(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.documents,
        documentData,
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
          message: 'Documento criado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao criar o documento. Tente novamente.',
          position: 'top-right',
        })

        return false
      }
    } catch (err) {
      console.error('Failed to create document:', err)
      setError('Failed to create document')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o documento. Tente novamente.',
        position: 'top-right',
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  return { createDocument, loading, error }
}

export default useCreateDocument
