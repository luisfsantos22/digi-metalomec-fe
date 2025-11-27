import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import snakecaseKeys from 'snakecase-keys'
import axiosInstance from '../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../api/endpoints'
import { useSession } from 'next-auth/react'

export function useEditEmployee() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editEmployee = async (id: string | undefined, employeeData: any) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    let payload = snakecaseKeys(employeeData, { deep: true })
    payload = { ...payload }

    try {
      const response = await axiosInstance.put(
        EMPLOYEE_ENDPOINTS.getEmployeeById(id),
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Colaborador editado com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar o colaborador. Tente novamente.',
          position: 'top-right',
        })
      }

      return response.data
    } catch (err: any) {
      const validationErrors = err?.response?.data

      // If server returned validation payloads or a detail string, return to page and let the UI decide
      // how to display specific error messages (avoid generic toast for validation failures)
      if (validationErrors && Object.keys(validationErrors).length > 0) {
        setError(validationErrors)

        return validationErrors
      }

      // Non-validation error -> show generic toast and set error
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar o colaborador. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar o colaborador')

      return validationErrors
    } finally {
      setLoading(false)
    }
  }

  return { editEmployee, loading, error }
}
