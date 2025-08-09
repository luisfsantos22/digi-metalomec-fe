import { GenericJobTitle } from '@/app/types/utils/job-title'

export const mapGenericJobTitle = (data: any): GenericJobTitle => ({
  id: data.id,
  name: data.name,
  description: data.description || '',
})
