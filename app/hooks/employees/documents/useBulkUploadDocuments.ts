import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'

interface UseBulkUploadDocumentsResult {
  bulkUploadDocuments: (
    employeeId: string,
    files: File[],
    documentType: string,
    title?: string,
    expiryDate?: string,
    notes?: string
  ) => Promise<boolean>
  loading: boolean
  error: string | null
}

const useBulkUploadDocuments = (): UseBulkUploadDocumentsResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bulkUploadDocuments = async (
    employeeId: string,
    files: File[],
    documentType: string,
    title?: string,
    expiryDate?: string,
    notes?: string
  ): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      // Append all files
      files.forEach((file) => {
        formData.append('files', file)
      })

      // Append other required fields
      formData.append('employee', employeeId)
      formData.append('document_type', documentType)

      // Append optional fields
      if (title) {
        formData.append('title', title)
      }
      if (expiryDate) {
        formData.append('expiry_date', expiryDate)
      }
      if (notes) {
        formData.append('notes', notes)
      }

      const response = await axiosInstance.post(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.bulkUpload,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.status === 201) {
        const count = response.data?.length || files.length
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: `${count} documento${count > 1 ? 's' : ''} carregado${count > 1 ? 's' : ''} com sucesso!`,
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao carregar os documentos. Tente novamente.',
          position: 'top-right',
        })

        return false
      }
    } catch (err: any) {
      console.error('Failed to bulk upload documents:', err)
      const errorMessage =
        err.response?.data?.error || 'Failed to upload documents'
      setError(errorMessage)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao carregar os documentos. Tente novamente.',
        position: 'top-right',
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  return { bulkUploadDocuments, loading, error }
}

export default useBulkUploadDocuments
