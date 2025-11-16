import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import axiosInstance from '../../axiosInstance'
import { mapContract } from '@/app/mappers/utils/contract'
import { EmployeeContract } from '@/app/types/utils/contract'

const useGetEmployeeContracts = (employeeId: string, deps: any[] = []) => {
  const { data: session } = useSession()
  const [contracts, setContracts] = useState<EmployeeContract[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (!session?.accessToken) {
      return
    }
    const fetchQualifications = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = EMPLOYEE_DOCUMENTS_ENDPOINTS.getEmployeeContracts(
          employeeId,
          'contract'
        )
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const contracts = response?.data?.map((item: any) => mapContract(item))
        setContracts(contracts)
        setCount(response?.data?.length || 0)
      } catch (err) {
        console.error('Failed to fetch contracts:', err)
        setError('Failed to fetch contracts')
      } finally {
        setLoading(false)
      }
    }
    fetchQualifications()
  }, [session?.accessToken, employeeId, ...deps])

  return { loading, error, contracts, count }
}

export default useGetEmployeeContracts
