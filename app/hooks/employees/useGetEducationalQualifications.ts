import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import { useSession } from 'next-auth/react'
import { mapEducationalQualification } from '@/app/mappers/utils/educational-qualification'

const useGetEducationalQualifications = () => {
  const { data: session } = useSession()
  const [qualifications, setQualifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.accessToken) {
      return
    }
    const fetchQualifications = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = EMPLOYEE_ENDPOINTS.getEducationalQualifications
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const qualifications = response.data.map((item: any) =>
          mapEducationalQualification(item)
        )
        setQualifications(qualifications)
      } catch (err) {
        console.error('Failed to fetch educational qualifications:', err)
        setError('Failed to fetch educational qualifications')
      } finally {
        setLoading(false)
      }
    }
    fetchQualifications()
  }, [session?.accessToken])

  return { loading, error, qualifications }
}

export default useGetEducationalQualifications
