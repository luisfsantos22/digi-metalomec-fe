import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { notifications } from '@mantine/notifications'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { useRouter } from 'next/navigation'

interface UseEditRepairResult {
  editRepair: (repairId: string, repairData: WorkshopFormData) => Promise<void>
  loading: boolean
  error: string | null
}

const useEditRepair = (): UseEditRepairResult => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const editRepair = async (repairId: string, repairData: any) => {
    setLoading(true)
    setError(null)

    if (!repairId) {
      setError('Repair ID is required')

      return
    }
    if (!repairData) {
      setError('Repair data is required')

      return
    }

    try {
      await axiosInstance.put(`/repairs/${repairId}`, repairData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      notifications.show({
        title: 'Sucesso',
        color: 'green',
        message: 'Reparação criada com sucesso!',
        position: 'top-right',
      })
      router.push('/workshop-module/repair')
    } catch {
      setError('Failed to create repair')
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao criar a reparação. Tente novamente.',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  return { editRepair, loading, error }
}

export default useEditRepair
