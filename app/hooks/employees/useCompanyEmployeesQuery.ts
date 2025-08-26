import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useDebouncedValue from '../useDebouncedValue'
import axiosInstance from '../axiosInstance'
import { GenericEmployee } from '@/app/types/employee/employee'
import { mapGenericEmployee } from '@/app/mappers/employee/employee'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'

interface useCompanyEmployeesQueryResult {
  employees: GenericEmployee[]
  loading: boolean
  error: string | null
  count: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

const useCompanyEmployeesQuery = (
  page: number,
  searchQuery: string = '',
  jobTitleFilter: string = '',
  availabilityFilter: string[] = [],
  statusFilter: string = ''
): useCompanyEmployeesQueryResult => {
  const { data: session } = useSession()
  const [employees, setEmployees] = useState<GenericEmployee[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        // Build params only with non-empty values
        const params: Record<string, any> = {}
        if (debouncedSearchQuery && debouncedSearchQuery.trim() !== '')
          params.keyword = debouncedSearchQuery
        if (jobTitleFilter && jobTitleFilter.trim() !== '')
          params.job_title = jobTitleFilter
        if (availabilityFilter && availabilityFilter.length > 0)
          params.availability_status = availabilityFilter.join(',')
        if (statusFilter && statusFilter.trim() !== '')
          params.status = statusFilter

        const response = await axiosInstance.get(
          EMPLOYEE_ENDPOINTS.getEmployeesPage(page),
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
            params,
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
  }, [
    session?.accessToken,
    page,
    debouncedSearchQuery,
    jobTitleFilter,
    availabilityFilter,
    statusFilter,
  ])

  return { employees, loading, error, count }
}

export default useCompanyEmployeesQuery
