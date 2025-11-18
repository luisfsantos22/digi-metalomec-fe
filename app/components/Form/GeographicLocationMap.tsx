'use client'

import React from 'react'
import LazyLeafletMap from './LazyLeafletMap'
import 'leaflet/dist/leaflet.css'

type Props = {
  latitude?: number | null
  longitude?: number | null
  onPositionChange: (lat: number, lng: number) => void
  onAddress?: (address: string, components?: any) => void
}

export default function GeographicLocationMap({
  latitude,
  longitude,
  onPositionChange,
  onAddress,
}: Props) {
  return (
    <div className="w-full h-64 rounded overflow-hidden">
      <LazyLeafletMap
        latitude={latitude}
        longitude={longitude}
        onPositionChange={onPositionChange}
        onAddress={onAddress}
      />
    </div>
  )
}
