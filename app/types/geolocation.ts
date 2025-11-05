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
