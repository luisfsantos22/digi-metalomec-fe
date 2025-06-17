import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { VehicleWorkshop } from '@/app/types/vehicle'

interface useCreateVehicleResult {
  createVehicle: (vehicleData: VehicleWorkshop) => Promise<void>
  loading: boolean
  error: string | null
}

const useCreateVehicle = (): useCreateVehicleResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createVehicle = async (vehicleData: any) => {
    setLoading(true)
    setError(null)

    try {
      await axiosInstance.post('/vehicles/', vehicleData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Veículo criada com sucesso!',
        position: 'top-right',
      })
    } catch {
      setError('Failed to create repair')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar o veículo. Tente novamente.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  return { createVehicle, loading, error }
}

export default useCreateVehicle
