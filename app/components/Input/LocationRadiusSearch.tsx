'use client'

import React, { useState, useEffect, useRef } from 'react'
import FormInput from './FormInput'
import SearchInput from './SearchInput'
import Text from '../Text/Text'

type LocationRadiusSearchProps = {
  place: string
  setPlace: (value: string) => void
  radius: number | null
  setRadius: (value: number | null) => void
  error?: string
  disabled?: boolean
  placePlaceholder?: string
  radiusPlaceholder?: string
  placeLabel?: string
  radiusLabel?: string
  helperText?: string
  searchQuery: string
  setSearchQuery: (value: string) => void
}

type NominatimResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: any
}

const LocationRadiusSearch: React.FC<LocationRadiusSearchProps> = ({
  place,
  setPlace,
  radius,
  setRadius,
  error,
  disabled = false,
  placePlaceholder = 'Ex: Matosinhos, Porto, Lisboa...',
  radiusPlaceholder = 'Ex: 20',
  placeLabel = 'Localização',
  radiusLabel = 'Raio (km)',
  helperText,
  searchQuery,
  setSearchQuery,
}) => {
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const skipSearchRef = useRef(false)

  // Debounced search for Nominatim
  useEffect(() => {
    // Don't search if we just selected a location
    if (skipSearchRef.current) {
      skipSearchRef.current = false

      return
    }

    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([])
      setIsDropdownOpen(false)

      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )},Portugal&addressdetails=1&limit=5`
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'DigiMetalomec/1.0',
          },
        })

        if (!response.ok) {
          throw new Error('Geocoding failed')
        }

        const data = await response.json()

        setSearchResults(data || [])
        setIsDropdownOpen(data && data.length > 0)
      } catch (err) {
        console.error('Nominatim search error:', err)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectLocation = (result: NominatimResult) => {
    setPlace(result.display_name)
    setSelectedLocation(result.display_name)
    skipSearchRef.current = true
    setSearchQuery(result.display_name)
    setIsDropdownOpen(false)
    setSearchResults([])
  }
  const handleRadiusChange = (value: string | number | Date | undefined) => {
    if (value === '' || value === null || value === undefined) {
      setRadius(null)

      return
    }

    const numValue =
      typeof value === 'string'
        ? parseFloat(value)
        : typeof value === 'number'
          ? value
          : null

    if (numValue !== null && !isNaN(numValue) && numValue > 0) {
      setRadius(numValue)
    } else {
      setRadius(null)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex-col lg:flex-row gap-4 flex">
        <div className="flex-1">
          <SearchInput
            query={searchQuery}
            setQuery={setSearchQuery}
            placeholder={placePlaceholder}
            label={placeLabel}
            labelStyles="text-digiblack1420-semibold"
            data={searchResults}
            dataIsLoading={isSearching}
            value={selectedLocation}
            setValue={setSelectedLocation}
            source="Location"
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
            showCreateOption={false}
            disabled={disabled}
            renderItem={(result: NominatimResult) => (
              <div className="text-sm font-medium text-gray-900">
                {result.display_name}
              </div>
            )}
            onItemSelect={handleSelectLocation}
          />
        </div>
        <div className="lg:w-1/3 w-full">
          <FormInput
            query={radius?.toString() || ''}
            setQuery={handleRadiusChange}
            placeholder={radiusPlaceholder}
            label={radiusLabel}
            inputType="number"
            disabled={disabled}
            clearable
            labelStyles="text-digiblack1420-semibold"
          />
        </div>
      </div>
      {helperText && (
        <Text
          text={helperText}
          styles="text-digibrown1212-normal mt-1"
        />
      )}
      {error && (
        <Text
          text={error}
          styles="text-digired1212-semibold mt-1"
        />
      )}
    </div>
  )
}

export default LocationRadiusSearch
