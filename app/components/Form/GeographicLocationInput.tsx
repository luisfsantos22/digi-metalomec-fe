'use client'

import React, { useState, useEffect, useRef } from 'react'
import FormInput from '../Input/FormInput'
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form'
import { mapNominatimToGeographicLocation } from '@/app/mappers/geolocation/geolocation'

type Props = {
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  errors?: FieldErrors<any>
  initial?: {
    city?: string
    municipality?: string
    locality?: string
    parish?: string
    latitude?: number | null
    longitude?: number | null
    addressFull?: string | null
  }
}

type SearchResult = {
  place_id: string
  display_name: string
  lat: string
  lon: string
  address: any
}

export default function GeographicLocationInput({
  register,
  setValue,
  errors,
  initial,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const skipSearchRef = useRef(false)

  // Debounced search function
  useEffect(() => {
    // Don't search if we just selected a location
    if (skipSearchRef.current) {
      skipSearchRef.current = false

      return
    }

    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([])
      setShowDropdown(false)

      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        // Search for locations in Portugal using Nominatim
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )},Portugal&addressdetails=1&limit=5`
        const response = await fetch(url)
        const data = await response.json()

        console.log('Nominatim search results:', data)

        // Remove duplicates based on place_id
        const uniqueResults = data.filter(
          (result: SearchResult, index: number, self: SearchResult[]) =>
            index === self.findIndex((r) => r.place_id === result.place_id)
        )

        setSearchResults(uniqueResults)
        setShowDropdown(uniqueResults.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500) // Debounce 500ms

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectLocation = (result: SearchResult) => {
    // Map the Nominatim result to our geographic location format
    const geographicLocation = mapNominatimToGeographicLocation(result)

    // Set all form values
    setValue('geographicLocation.city', geographicLocation.city || '')
    setValue(
      'geographicLocation.municipality',
      geographicLocation.municipality || ''
    )
    setValue('geographicLocation.locality', geographicLocation.locality || '')
    setValue('geographicLocation.parish', geographicLocation.parish || '')
    setValue('geographicLocation.latitude', geographicLocation.latitude)
    setValue('geographicLocation.longitude', geographicLocation.longitude)
    setValue(
      'geographicLocation.addressFull',
      geographicLocation.addressFull || ''
    )

    // Update search query with the display name and close dropdown
    skipSearchRef.current = true
    setSearchQuery(result.display_name)
    setShowDropdown(false)
  }

  return (
    <div className="w-full">
      {/* Location Search Input */}
      <div className="mb-4 relative">
        <label className="text-digiblack1420-semibold mb-2 block">
          Pesquisar Localização
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquise por cidade, concelho ou localidade..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-11 text-gray-400">
            Pesquisando...
          </div>
        )}

        {/* Dropdown with search results */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">
                  {result.display_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
        <FormInput
          query={initial?.city ?? ''}
          setQuery={(e) => setValue('geographicLocation.city', e as string)}
          placeholder="Cidade"
          inputType="text"
          label="Cidade"
          {...register('geographicLocation.city')}
        />
        <FormInput
          query={initial?.municipality ?? ''}
          setQuery={(e) =>
            setValue('geographicLocation.municipality', e as string)
          }
          placeholder="Concelho"
          inputType="text"
          label="Concelho / Município"
          {...register('geographicLocation.municipality')}
        />
        <FormInput
          query={initial?.locality ?? ''}
          setQuery={(e) => setValue('geographicLocation.locality', e as string)}
          placeholder="Freguesia / Localidade"
          inputType="text"
          label="Localidade"
          {...register('geographicLocation.locality')}
        />
        <FormInput
          query={initial?.parish ?? ''}
          setQuery={(e) => setValue('geographicLocation.parish', e as string)}
          placeholder="Freguesia"
          inputType="text"
          label="Freguesia"
          {...register('geographicLocation.parish')}
        />
      </div>

      {/* Hidden fields for coords and address */}
      <input
        type="hidden"
        {...register('geographicLocation.latitude')}
      />
      <input
        type="hidden"
        {...register('geographicLocation.longitude')}
      />
      <input
        type="hidden"
        {...register('geographicLocation.addressFull')}
      />
    </div>
  )
}
