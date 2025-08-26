import { EducationalQualification } from '@/app/types/utils/educational-qualification'

export const mapEducationalQualification = (
  data: any
): EducationalQualification => ({
  id: data.id,
  name: data.name,
  level: data.level || '',
})
