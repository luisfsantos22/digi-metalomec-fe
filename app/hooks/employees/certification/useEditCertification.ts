import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

export function useEditCertification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editCertification = async (
    id: string | undefined,
    employeeId: string,
    certificationData: any,
    accessToken: string
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    let payload = snakecaseKeys(certificationData, { deep: true })
    payload = { ...payload, employee: employeeId }

    try {
      const response = await axiosInstance.put(
        EMPLOYEE_ENDPOINTS.getCertificationEmployeeById(id),
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Certificação editada com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar a certificação. Tente novamente.',
          position: 'top-right',
        })
      }

      return response.data
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar a certificação. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar a certificação')
    } finally {
      setLoading(false)
    }
  }

  return { editCertification, loading, error }
}
