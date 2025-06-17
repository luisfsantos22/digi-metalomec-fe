import { WorkshopStatus } from '../../enum'
import { VehicleWorkshop } from '../vehicle'
import { WorkshopClientObj } from './workshop-client'
import { WorkshopExternalServiceObj } from './workshop-external-services'
import { WorkshopMaterialObj } from './workshop-materials'
import { WorkshopServiceObj } from './workshop-services'
import { WorkshopWorkforceObj } from './workshop-workforces'

type WorkshopObj = {
  uuid: string
  createdAt: string
  updatedAt: string
  vehicle: VehicleWorkshop
  nOr: string
  appointmentDate?: string
  state: WorkshopStatus
  hasRequestedMaterial: boolean
  services: WorkshopServiceObj[]
  materials: WorkshopMaterialObj[]
  externalServices: WorkshopExternalServiceObj[]
  workforces: WorkshopWorkforceObj[]
  client: WorkshopClientObj
}

type WorkshopFormData = {
  vehicleUuid: string
  nOr: string
  appointmentDate: string
  state: WorkshopStatus
  hasRequestedMaterial: boolean
  services: WorkshopServiceObj[]
  materials: WorkshopMaterialObj[]
  externalServices: WorkshopExternalServiceObj[]
  workforces: WorkshopWorkforceObj[]
  client?: WorkshopClientObj
  createdAt: string
}

type WorkshopFilters = {
  nOr?: string
  vehicleName?: string
  licensePlate?: string
  state?: WorkshopStatus
}

export type { WorkshopObj, WorkshopFormData, WorkshopFilters }
