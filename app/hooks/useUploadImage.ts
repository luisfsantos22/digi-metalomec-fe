import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useGlobalLoading } from './utils/useGlobalLoading'
import axiosInstance from './axiosInstance'

interface UseUploadImageResult {
  uploadImage: (file: File) => Promise<string>
  loading: boolean
  error: string | null
}

const useUploadImage = (): UseUploadImageResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { startLoading, stopLoading } = useGlobalLoading()

  const uploadImage = async (file: File): Promise<string> => {
    setLoading(true)
    setError(null)
    startLoading()
    try {
      const formData = new FormData()
      formData.append('file', file)
      // Adjust the endpoint as needed for your API
      const response = await axiosInstance.post(
        '/api/v1/employees/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      const url = response.data.url || response.data.fileUrl || ''
      if (!url) {
        throw new Error('Image upload failed, no URL returned')
      }

      return url
    } catch (err) {
      setError('Erro ao fazer upload da imagem.')
      throw err
    } finally {
      setLoading(false)
      stopLoading()
    }
  }

  return { uploadImage, loading, error }
}

export default useUploadImage
