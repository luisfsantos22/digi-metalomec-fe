import { WorkshopFilters, WorkshopObj } from '@/app/types/workshop/workshop'
import { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { mapWorkshopItems } from '@/app/mappers/workshop/workshop'

export function useRepairsWorkshop(
  accessToken: string | undefined,
  refreshKey: number,
  filters: WorkshopFilters
) {
  const [workshopItems, setWorkshopItems] = useState<WorkshopObj[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) {
      return
    }

    const fetchWorkshopItems = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get('/repairs/company', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            nOr: filters?.nOr,
            vehicleName: filters?.vehicleName,
            licensePlate: filters?.licensePlate,
            state: filters?.state,
          },
        })
        const mapped = response.data.repairs.map(mapWorkshopItems)
        setWorkshopItems(mapped)
      } catch (err) {
        console.log(err)
        setError('Failed to load workshop items.')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshopItems()
  }, [accessToken, refreshKey, filters])

  return { workshopItems, loading, error }
}
