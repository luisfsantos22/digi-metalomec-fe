import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import { useSession } from 'next-auth/react'
import { mapEmployee } from '@/app/mappers/employee/employee'
import { Employee } from '@/app/types/employee/employee'

const useGetEmployee = (employeeId: string, deps: any[] = []) => {
  const { data: session } = useSession()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.accessToken || !employeeId) {
      return
    }
    const fetchEmployee = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = EMPLOYEE_ENDPOINTS.getEmployeeById(employeeId)
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const employee = mapEmployee(response.data)
        setEmployee(employee)
      } catch (err) {
        console.error('Failed to fetch employee:', err)
        setError('Failed to fetch employee')
      } finally {
        setLoading(false)
      }
    }
    fetchEmployee()
  }, [session?.accessToken, employeeId, ...deps])

  return { loading, error, employee }
}

export default useGetEmployee
