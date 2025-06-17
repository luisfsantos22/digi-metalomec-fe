type WorkshopExternalServiceObj = {
  uuid: string
  date: string
  numInvoice: string
  description: string
  buyPrice: number | undefined
  salePrice: number | undefined
  iva: number | undefined
  repairUuid?: string
}

export type { WorkshopExternalServiceObj }
