import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { GenericEmployee } from '@/app/types/employee/employee'
import { mapGenericEmployee } from '@/app/mappers/employee/employee'

interface useCompanyEmployeesQueryResult {
  employees: GenericEmployee[]
  loading: boolean
  error: string | null
  count: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

const useCompanyEmployeesQuery = (
  page: number
): useCompanyEmployeesQueryResult => {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<GenericEmployee[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance.get(
          `/api/v1/employees/employees/?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        const count = response.data.count
        const dataResults = response.data.results

        const mappedResults = dataResults.map((emp: any) =>
          mapGenericEmployee(emp)
        )

        setCount(count)
        setEmployees(mappedResults)
      } catch {
        setError('Failed to fetch workshop users')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchUsers()
    }
  }, [session?.accessToken, page])

  return { employees, loading, error, count }
}

export default useCompanyEmployeesQuery
