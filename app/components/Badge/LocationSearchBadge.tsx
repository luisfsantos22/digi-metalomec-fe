type LocationSearchBadgeProps = {
  locationPlace: string
  locationRadius: number
}

const LocationSearchBadge = ({
  locationPlace,
  locationRadius,
}: LocationSearchBadgeProps) => {
  return (
    <span className="bg-digiblue w-full xl:w-fit text-white px-3 py-1 rounded-full text-xs font-semibold">
      📍 Pesquisa por raio: {locationPlace} ({locationRadius}km)
    </span>
  )
}

export default LocationSearchBadge
