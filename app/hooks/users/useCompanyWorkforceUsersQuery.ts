import { SimpleUser } from '@/app/types/user/user'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'

interface useCompanyWorkshopUsersQueryResult {
  users: SimpleUser[]
  loading: boolean
  error: string | null
}

const useCompanyWorkshopUsersQuery = (): useCompanyWorkshopUsersQueryResult => {
  const { data: session } = useSession()
  const [users, setUsers] = useState<SimpleUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await axiosInstance.get(`/users/company/workshop`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        setUsers(response.data.users)
      } catch {
        setError('Failed to fetch workshop users')
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchUsers()
    }
  }, [session?.accessToken])

  return { users, loading, error }
}

export default useCompanyWorkshopUsersQuery
