'use client'

import React, { useState, useEffect, useRef } from 'react'
import FormInput from '../Input/FormInput'
import SearchInput from '../Input/SearchInput'
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  UseFormWatch,
} from 'react-hook-form'
import { mapNominatimToGeographicLocation } from '@/app/mappers/geolocation/geolocation'
import { NominatimResponse } from '@/app/types/geolocation'

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
  // Optional watch function from react-hook-form to keep displayed values in sync
  watch?: UseFormWatch<any>
}

type SearchResult = NominatimResponse & {
  place_id: string
}

export default function GeographicLocationInput({
  register,
  setValue,
  errors,
  initial,
  watch,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const skipSearchRef = useRef(false)

  // Use watch if provided so disabled inputs display current form values
  const watchedCity =
    (typeof watch === 'function' && watch('geographicLocation.city')) ||
    undefined
  const watchedMunicipality =
    (typeof watch === 'function' && watch('geographicLocation.municipality')) ||
    undefined
  const watchedLocality =
    (typeof watch === 'function' && watch('geographicLocation.locality')) ||
    undefined
  const watchedParish =
    (typeof watch === 'function' && watch('geographicLocation.parish')) ||
    undefined

  // Initialize searchQuery and selectedLocation from initial?.addressFull on mount
  useEffect(() => {
    if (initial?.addressFull) {
      setSearchQuery(initial.addressFull)
      setSelectedLocation(initial.addressFull)
    }
  }, [initial?.addressFull])

  // Debounced search function
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
        // Search for locations in Portugal using Nominatim
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

        // Remove duplicates based on place_id
        const uniqueResults = data.filter(
          (result: SearchResult, index: number, self: SearchResult[]) =>
            index === self.findIndex((r) => r.place_id === result.place_id)
        )

        setSearchResults(uniqueResults)
        setIsDropdownOpen(uniqueResults.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 1000) // Debounce 1000ms

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
    setSelectedLocation(result.display_name)
    setIsDropdownOpen(false)
  }

  const handleClearFields = () => {
    setValue('geographicLocation.city', '')
    setValue('geographicLocation.municipality', '')
    setValue('geographicLocation.locality', '')
    setValue('geographicLocation.parish', '')
    setValue('geographicLocation.latitude', null)
    setValue('geographicLocation.longitude', null)
    setValue('geographicLocation.addressFull', '')
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Location Search Input */}
      <SearchInput
        query={searchQuery}
        setQuery={setSearchQuery}
        placeholder="Pesquise por cidade, concelho ou localidade..."
        label="Pesquisar Localização"
        labelStyles="text-digiblack1420-semibold"
        mandatory={true}
        data={searchResults}
        dataIsLoading={isSearching}
        value={selectedLocation}
        setValue={setSelectedLocation}
        source="Location"
        setIsDropdownOpen={setIsDropdownOpen}
        isDropdownOpen={isDropdownOpen}
        showCreateOption={false}
        renderItem={(result: SearchResult) => (
          <div className="text-sm font-medium text-gray-900">
            {result.display_name}
          </div>
        )}
        onItemSelect={handleSelectLocation}
        helperText="Pesquise por uma localização acima para preencher automaticamente os campos de localização."
        clearAdditionalFields={handleClearFields}
      />

      <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
        <FormInput
          query={watchedCity ?? initial?.city ?? ''}
          setQuery={(e) => setValue('geographicLocation.city', e as string)}
          placeholder="Cidade"
          inputType="text"
          label="Cidade"
          {...register('geographicLocation.city')}
          disabled
          labelStyles="text-digiblack1420-semibold"
        />
        <FormInput
          query={watchedMunicipality ?? initial?.municipality ?? ''}
          setQuery={(e) =>
            setValue('geographicLocation.municipality', e as string)
          }
          placeholder="Concelho"
          inputType="text"
          label="Concelho / Município"
          {...register('geographicLocation.municipality')}
          disabled
          labelStyles="text-digiblack1420-semibold"
        />
        <FormInput
          query={watchedLocality ?? initial?.locality ?? ''}
          setQuery={(e) => setValue('geographicLocation.locality', e as string)}
          placeholder="Freguesia / Localidade"
          inputType="text"
          label="Localidade"
          {...register('geographicLocation.locality')}
          disabled
          labelStyles="text-digiblack1420-semibold"
        />
        <FormInput
          query={watchedParish ?? initial?.parish ?? ''}
          setQuery={(e) => setValue('geographicLocation.parish', e as string)}
          placeholder="Freguesia"
          inputType="text"
          label="Freguesia"
          {...register('geographicLocation.parish')}
          disabled
          labelStyles="text-digiblack1420-semibold"
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
