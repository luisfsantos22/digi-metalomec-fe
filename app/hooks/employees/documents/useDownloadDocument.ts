import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import axiosInstance from '../../axiosInstance'

const useDownloadDocument = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadDocument = async (documentId: string, fileName: string) => {
    if (!session?.accessToken || !documentId) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = EMPLOYEE_DOCUMENTS_ENDPOINTS.downloadDocumentFile(documentId)
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      const downloadUrl = response.data.download_url

      window.open(downloadUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Failed to download document:', err)
      setError('Failed to download document')
    } finally {
      setLoading(false)
    }
  }

  return { downloadDocument, loading, error }
}

export default useDownloadDocument
