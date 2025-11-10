import {
  GeographicLocationInput,
  GeographicLocationOutput,
  NominatimResponse,
} from '@/app/types/geolocation'

/**
 * Maps frontend camelCase geographic location data to API snake_case format
 */
export const mapGeographicLocationToApi = (data: GeographicLocationInput) => ({
  city: data.city,
  municipality: data.municipality,
  locality: data.locality,
  parish: data.parish,
  latitude: data.latitude,
  longitude: data.longitude,
  address_full: data.addressFull,
})

/**
 * Maps API snake_case geographic location data to frontend camelCase format
 */
export const mapGeographicLocationFromApi = (
  data: any
): GeographicLocationOutput => ({
  id: data.id,
  city: data.city,
  municipality: data.municipality,
  locality: data.locality,
  parish: data.parish,
  latitude: data.latitude,
  longitude: data.longitude,
  addressFull: data.address_full,
})

/**
 * Maps Nominatim reverse geocoding response to geographic location fields
 * Uses heuristics to extract city/municipality/locality/parish from OSM address components
 */
export const mapNominatimToGeographicLocation = (
  nominatimResponse: NominatimResponse
): Partial<GeographicLocationInput> => {
  const { address = {}, display_name = '', lat, lon } = nominatimResponse

  // Heuristics to map OSM address components to our geographic fields
  const city = address.city || address.town || address.county || ''
  const municipality = address.county || address.state || ''
  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.hamlet ||
    address.residential ||
    ''
  const parish =
    address.parish || address.city_district || address.village || ''

  return {
    city,
    municipality,
    locality,
    parish,
    latitude: lat ? (isNaN(parseFloat(lat)) ? null : parseFloat(lat)) : null,
    longitude: lon ? (isNaN(parseFloat(lon)) ? null : parseFloat(lon)) : null,
    addressFull: display_name,
  }
}
