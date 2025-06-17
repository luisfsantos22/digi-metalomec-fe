type WorkshopMaterialObj = {
  uuid: string
  description?: string
  date: string
  numInvoice: string
  buyPrice: number | undefined
  salePrice: number | undefined
  iva: number | undefined
  repairUuid?: string
}

export type { WorkshopMaterialObj }
