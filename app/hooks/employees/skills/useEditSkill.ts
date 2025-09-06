import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_ENDPOINTS } from '../../api/endpoints'

export function useEditCertification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editCertification = async (
    id: string | undefined,
    certificationData: any,
    accessToken: string
  ) => {
    if (!id) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.put(
        EMPLOYEE_ENDPOINTS.getCertificationById(id),
        certificationData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Certificação editada com sucesso!',
        position: 'top-right',
      })

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
