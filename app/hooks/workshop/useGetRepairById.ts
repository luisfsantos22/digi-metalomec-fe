import { WorkshopObj } from '@/app/types/workshop/workshop'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { mapWorkshopItems } from '@/app/mappers/workshop/workshop'

export function useGetRepairById(accessToken: string, repairId: string) {
  const [repairItem, setRepairItem] = useState<WorkshopObj>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken || !repairId) return

    const fetchWorkshopItem = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get('/repairs/' + repairId, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        const mapped = mapWorkshopItems(response.data.repair)
        setRepairItem(mapped)
      } catch (err) {
        console.log(err)
        setError('Failed to load workshop item.')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshopItem()
  }, [])

  return { repairItem, loading, error }
}
