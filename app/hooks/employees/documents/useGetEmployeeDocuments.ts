import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import axiosInstance from '../../axiosInstance'
import { EmployeeDocument } from '@/app/types/utils/document'
import { mapDocument } from '@/app/mappers/utils/document'

const useGetEmployeeDocuments = (employeeId: string, deps: any[] = []) => {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (!session?.accessToken) {
      return
    }
    const fetchDocuments = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = EMPLOYEE_DOCUMENTS_ENDPOINTS.getEmployeeDocumentsByType(
          employeeId,
          'other'
        )
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const documents = response?.data?.map((item: any) => mapDocument(item))
        setDocuments(documents)
        setCount(response?.data?.length || 0)
      } catch (err) {
        console.error('Failed to fetch documents:', err)
        setError('Failed to fetch documents')
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [session?.accessToken, employeeId, ...deps])

  return { loading, error, documents, count }
}

export default useGetEmployeeDocuments
