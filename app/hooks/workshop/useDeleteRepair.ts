import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'

export function useDeleteRepair() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteRepair = async (
    uuid: string | undefined,
    accessToken: string
  ) => {
    if (!uuid) {
      return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axiosInstance.delete(`/repairs/${uuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.status === 204) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Reparação eliminada com sucesso!',
          position: 'top-right',
        })
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao eliminar a reparação. Tente novamente.',
          position: 'top-right',
        })
        setError('Um erro ocorreu ao eliminar a reparação')
      }
    } catch {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao eliminar a reparação. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao eliminar a reparação')
    } finally {
      setLoading(false)
    }
  }

  return { deleteRepair, loading, error }
}
