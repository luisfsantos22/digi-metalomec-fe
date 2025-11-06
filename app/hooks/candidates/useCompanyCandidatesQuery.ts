import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useDebouncedValue from '../useDebouncedValue'
import axiosInstance from '../axiosInstance'
import { CANDIDATE_ENDPOINTS } from '../api/endpoints'
import { GenericCandidate } from '@/app/types/candidate/candidate'
import { mapGenericCandidate } from '@/app/mappers/candidate/candidate'

interface useCompanyCandidatesQueryResult {
  candidates: GenericCandidate[]
  loading: boolean
  error: string | null
  count: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

const useCompanyCandidatesQuery = (
  page: number,
  searchQuery: string = '',
  jobTitleFilter: string = '',
  phoneFilter: string = '',
  refreshFlag: boolean = false,
  locationPlace: string = '',
  locationRadius: number | null = null
): useCompanyCandidatesQueryResult => {
  const { data: session } = useSession()
  const [candidates, setCandidates] = useState<GenericCandidate[]>([])
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000)
  const debouncedJobTitleFilter = useDebouncedValue(jobTitleFilter, 1000)
  const debouncedPhoneFilter = useDebouncedValue(phoneFilter, 1000)
  const debouncedLocationPlace = useDebouncedValue(locationPlace, 1000)
  const debouncedLocationRadius = useDebouncedValue(locationRadius, 1000)

  useEffect(() => {
    const fetchUsers = async () => {
      // Check if location search is being used (both fields must be filled)
      const useLocationSearch =
        debouncedLocationPlace &&
        debouncedLocationPlace.trim() !== '' &&
        debouncedLocationRadius &&
        debouncedLocationRadius > 0

      // Check if both location fields are empty (should fall back to regular search)
      const bothLocationFieldsEmpty =
        (!debouncedLocationPlace || debouncedLocationPlace.trim() === '') &&
        (!debouncedLocationRadius || debouncedLocationRadius <= 0)

      // Don't fetch if only one field is filled (wait for both) - just return without changing state
      if (
        !bothLocationFieldsEmpty &&
        ((debouncedLocationPlace &&
          debouncedLocationPlace.trim() !== '' &&
          !debouncedLocationRadius) ||
          (debouncedLocationRadius &&
            debouncedLocationRadius > 0 &&
            (!debouncedLocationPlace || debouncedLocationPlace.trim() === '')))
      ) {
        // Don't clear results - just skip the fetch
        return
      }

      setLoading(true)
      setError(null)
      try {
        // Build params only with non-empty values
        const params: Record<string, any> = {}

        // Determine endpoint and params based on search type
        let endpoint: string

        if (useLocationSearch) {
          // Location-based search: first try geocoding client-side to get precise coords
          try {
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              debouncedLocationPlace
            )}&addressdetails=1&limit=1`
            const geoResp = await fetch(geocodeUrl, {
              headers: { Accept: 'application/json' },
            })
            const geoData = await geoResp.json()

            if (!geoData || geoData.length === 0) {
              // No geocoding result — show friendly error and skip backend call
              setError(
                `Unable to geocode location: ${debouncedLocationPlace}. Try a more specific query.`
              )
              setCandidates([])
              setCount(0)
              setLoading(false)

              return
            }

            const { lat, lon, display_name } = geoData[0]

            endpoint = CANDIDATE_ENDPOINTS.searchByLocation
            // send only radius and precise coordinates (no place param)
            params.radius = debouncedLocationRadius
            params.lat = lat ? parseFloat(lat) : undefined
            params.lon = lon ? parseFloat(lon) : undefined
            params.page = page
          } catch (geoErr: any) {
            setError(
              `Unable to find or geocode location: ${debouncedLocationPlace}`
            )
            setCandidates([])
            setCount(0)
            setLoading(false)

            return
          }
        } else {
          // Regular search
          endpoint = CANDIDATE_ENDPOINTS.getCandidatesPage(page)
          if (debouncedSearchQuery && debouncedSearchQuery.trim() !== '')
            params.keyword = debouncedSearchQuery
          if (debouncedJobTitleFilter && debouncedJobTitleFilter.trim() !== '')
            params.job_title = debouncedJobTitleFilter
          if (debouncedPhoneFilter && debouncedPhoneFilter.trim() !== '')
            params.phone = debouncedPhoneFilter
        }

        const response = await axiosInstance.get(endpoint, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          params,
        })
        const count = response.data.count
        const dataResults = response.data.results
        const mappedResults = dataResults.map((candidate: any) =>
          mapGenericCandidate(candidate)
        )
        setCount(count)
        setCandidates(mappedResults)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to fetch candidates')
        setCandidates([])
        setCount(0)
      } finally {
        setLoading(false)
      }
    }
    if (session?.accessToken) {
      fetchUsers()
    }
  }, [
    session?.accessToken,
    page,
    debouncedSearchQuery,
    debouncedJobTitleFilter,
    debouncedPhoneFilter,
    debouncedLocationPlace,
    debouncedLocationRadius,
    refreshFlag,
  ])

  return { candidates, loading, error, count }
}

export default useCompanyCandidatesQuery
