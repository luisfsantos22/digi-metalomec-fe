import { WorkshopExternalServiceObj } from '@/app/types/workshop/workshop-external-services'

const mapWorkshopExternalServices = (data): WorkshopExternalServiceObj[] => {
  if (!data) return []

  return data.map((item: WorkshopExternalServiceObj) => ({
    uuid: item?.uuid ?? '',
    date: item?.date ?? '',
    numInvoice: item?.numInvoice ?? 0,
    description: item?.description ?? '',
    buyPrice: item?.buyPrice ?? 0,
    salePrice: item?.salePrice ?? 0,
    iva: item?.iva ?? 0,
    repairUuid: item?.repairUuid ?? '',
  }))
}

export { mapWorkshopExternalServices }
