type VehicleWorkshop = {
  licensePlate: string
  uuid: string
  brand: string
  model: string
  version?: string
  createdAt?: string
  availability?: 'REPARING' | 'VERIFYING'
}

interface VehicleSearch {
  uuid: string
  licensePlate: string
  brand: string
  model: string
  version?: string
}

export type { VehicleWorkshop, VehicleSearch }
