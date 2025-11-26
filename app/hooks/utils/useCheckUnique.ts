import { useSession } from 'next-auth/react'
import axiosInstance from '../axiosInstance'
import { useCallback, useState } from 'react'
import { CANDIDATE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '@/app/hooks/api/endpoints'

type Entity = 'candidates' | 'employees'

export default function useCheckUnique(entity: Entity) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkUnique = useCallback(
    async (value: string) => {
      if (!value || value.trim() === '') return false
      setLoading(true)
      setError(null)
        try {
          // try several strategies to find a match: keyword, phone_number, phone, email
          const endpoint =
            entity === 'employees'
              ? EMPLOYEE_ENDPOINTS.getEmployeesPage(1)
              : CANDIDATE_ENDPOINTS.getCandidatesPage(1)

          const tryParams = [
            { keyword: value },
            { phone_number: value },
            { phone: value },
            { email: value },
          ]

          for (const p of tryParams) {
            const params: Record<string, any> = { page: 1, ...p }
            const response = await axiosInstance.get(endpoint, {
              headers: { Authorization: `Bearer ${session?.accessToken}` },
              params,
            })
            const count = response?.data?.count ?? 0
            if (count > 0) return true
          }

          return false
      } catch (err: any) {
        setError('Failed to verify uniqueness')
        return false
      } finally {
        setLoading(false)
      }
    },
    [session?.accessToken, entity]
  )

  return { checkUnique, loading, error }
}
