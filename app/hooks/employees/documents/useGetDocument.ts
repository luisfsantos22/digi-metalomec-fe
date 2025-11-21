import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import axiosInstance from '../../axiosInstance'
import { mapDocument } from '@/app/mappers/utils/document'
import { EmployeeDocument } from '@/app/types/employee/document'

const useGetEmployeeDocument = (documentId: string) => {
  const { data: session } = useSession()
  const [document, setDocument] = useState<EmployeeDocument | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.accessToken || !documentId) {
      return
    }
    const fetchDocument = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = EMPLOYEE_DOCUMENTS_ENDPOINTS.getDocumentById(documentId)
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const document = mapDocument(response?.data)
        setDocument(document)
      } catch (err) {
        console.error('Failed to fetch document:', err)
        setError('Failed to fetch document')
      } finally {
        setLoading(false)
      }
    }
    fetchDocument()
  }, [session?.accessToken, documentId])

  return { loading, error, document }
}

export default useGetEmployeeDocument
