'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  latitude?: number | null
  longitude?: number | null
  onPositionChange: (lat: number, lng: number) => void
  onAddress?: (address: string, components?: any) => void
}

const LazyLeafletMap = ({
  latitude,
  longitude,
  onPositionChange,
  onAddress,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [MapComponent, setMapComponent] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let mounted = true

    const loadMap = async () => {
      try {
        const { MapContainer, TileLayer, Marker, useMapEvents, Popup } =
          await import('react-leaflet')
        const L = await import('leaflet')
        // CSS is imported in GeographicLocationMap.tsx instead

        const MapImpl = () => {
          const [marker, setMarker] = useState<{
            lat: number
            lng: number
          } | null>(
            latitude && longitude ? { lat: latitude, lng: longitude } : null
          )

          useEffect(() => {
            if (latitude && longitude)
              setMarker({ lat: latitude, lng: longitude })
          }, [latitude, longitude])

          const createDivIcon = () =>
            L.divIcon({
              className: 'custom-leaflet-marker',
              html: '<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 2px rgba(37,99,235,0.2)"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            })

          const MapEvents = ({
            setMarker,
          }: {
            setMarker: (lat: number, lng: number) => void
          }) => {
            useMapEvents({
              click(e) {
                setMarker(e.latlng.lat, e.latlng.lng)
              },
            })

            return null
          }

          const reverseGeocode = async (lat: number, lng: number) => {
            try {
              const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
              const res = await fetch(url, {
                headers: {
                  'User-Agent': 'DigiMetalomec/1.0',
                },
              })
              if (!res.ok) return null

              try {
                return await res.json()
              } catch {
                // Handle JSON parsing errors
                return null
              }
            } catch {
              return null
            }
          }

          const setMarkerAndNotify = async (lat: number, lng: number) => {
            setMarker({ lat, lng })
            onPositionChange(lat, lng)
            const rev = await reverseGeocode(lat, lng)
            if (rev) {
              const address = rev.display_name
              const components = rev.address || {}
              onAddress?.(address, components)
            }
          }

          const center: [number, number] = marker
            ? [marker.lat, marker.lng]
            : [38.736946, -9.142685]

          return (
            <div className="w-full h-64 rounded overflow-hidden">
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                whenReady={() => {
                  // Ensure map is ready before interactions
                  setTimeout(() => {
                    window.dispatchEvent(new Event('resize'))
                  }, 100)
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents setMarker={setMarkerAndNotify} />
                {marker && (
                  <Marker
                    position={[marker.lat, marker.lng]}
                    icon={createDivIcon()}
                    draggable={true}
                    eventHandlers={{
                      dragend: (e) => {
                        const latlng = (e.target as any).getLatLng()
                        setMarkerAndNotify(latlng.lat, latlng.lng)
                      },
                    }}
                  >
                    <Popup>
                      Arraste o marcador ou clique no mapa para selecionar a
                      localização.
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          )
        }

        if (mounted) {
          setMapComponent(() => MapImpl)
          setIsLoaded(true)
        }
      } catch (error) {
        console.error('Failed to load map:', error)
      }
    }

    loadMap()

    return () => {
      mounted = false
    }
  }, [latitude, longitude, onPositionChange, onAddress])

  if (!isLoaded || !MapComponent) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded flex items-center justify-center">
        Carregando mapa...
      </div>
    )
  }

  return <MapComponent />
}

export default LazyLeafletMap
