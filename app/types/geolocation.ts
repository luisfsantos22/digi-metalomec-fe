export type GeographicLocationInput = {
  city: string
  municipality: string
  locality?: string | null
  parish?: string | null
  latitude?: number | null
  longitude?: number | null
  addressFull?: string | null
}

export type GeographicLocationOutput = {
  id?: string
  city: string
  municipality: string
  locality?: string | null
  parish?: string | null
  latitude?: number | null
  longitude?: number | null
  addressFull?: string | null
}

/**
 * Nominatim API response structure for reverse geocoding
 * Based on OpenStreetMap Nominatim API: https://nominatim.org/release-docs/latest/api/Reverse/
 */
export type NominatimResponse = {
  lat: string
  lon: string
  display_name: string
  address?: {
    city?: string
    town?: string
    county?: string
    state?: string
    suburb?: string
    neighbourhood?: string
    hamlet?: string
    residential?: string
    parish?: string
    city_district?: string
    village?: string
    [key: string]: string | undefined
  }
  [key: string]: any
}
