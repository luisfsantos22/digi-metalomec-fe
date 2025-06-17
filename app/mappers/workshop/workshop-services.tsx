import { WorkshopServiceObj } from '@/app/types/workshop/workshop-services'

const mapWorkshopServices = (data): WorkshopServiceObj[] => {
  if (!data) return []

  return data.map((item) => ({
    uuid: item?.uuid ?? '',
    date: item?.date ?? '',
    description: item?.description ?? '',
    repairUuid: item?.repairUuid ?? '',
    typeService: item?.typeService ?? undefined,
  }))
}

export { mapWorkshopServices }
