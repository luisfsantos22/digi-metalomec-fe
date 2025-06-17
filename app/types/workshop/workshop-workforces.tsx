type WorkshopWorkforceObj = {
  uuid: string
  date: string
  numHours: number | undefined
  hourPrice: number | undefined
  workerUuid: string
  repairUuid?: string
}

export type { WorkshopWorkforceObj }
