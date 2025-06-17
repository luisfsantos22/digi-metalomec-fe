import { WorkshopMaterialObj } from '@/app/types/workshop/workshop-materials'

const mapWorkshopMaterials = (data): WorkshopMaterialObj[] => {
  if (!data) return []

  return data.map((item: WorkshopMaterialObj) => ({
    uuid: item?.uuid ?? '',
    date: item?.date ?? '',
    description: item?.description ?? 0,
    repairUuid: item?.repairUuid ?? '',
    numInvoice: item?.numInvoice ?? '',
    buyPrice: item?.buyPrice ?? undefined,
    salePrice: item?.salePrice ?? undefined,
    iva: item?.iva ?? undefined,
  }))
}

export { mapWorkshopMaterials }
