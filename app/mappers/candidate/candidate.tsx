import { GenericCandidate } from '@/app/types/candidate/candidate'

export const mapGenericCandidate = (data: any): GenericCandidate => ({
  id: data?.id || '',
  internalIdentifier: data?.internal_identifier || undefined,
  availabilityStatus: data?.availability_status || '',
  user: {
    id: data?.user?.id || '',
    firstName: data?.user?.first_name || '',
    lastName: data?.user?.last_name || '',
    email: data?.user?.email || '',
    phoneNumber: data?.user?.phone_number || '',
    company: data?.user?.company || '',
    isActive: false,
    fullName: `${data?.user?.first_name || ''} ${data?.user?.last_name || ''}`,
    username: data?.user?.email ? data?.user?.email.split('@')[0] : '',
    role: data?.user?.role || '',
  },
  jobTitles: data?.job_titles || [],
  updatedAt: data?.updated_at || undefined,
  geographicLocation: data?.geographic_location
    ? {
        city: data.geographic_location.city || '',
        municipality: data.geographic_location.municipality || '',
        locality: data.geographic_location.locality || '',
        parish: data.geographic_location.parish || '',
        latitude: data.geographic_location.latitude || null,
        longitude: data.geographic_location.longitude || null,
        addressFull: data.geographic_location.address_full || null,
      }
    : undefined,
  lastIteraction: data?.last_iteraction || undefined,
})

export const mapGenericCandidateIteraction = (data: any) => ({
  id: data?.id || '',
  candidateId: data?.candidate || '',
  description: data?.description || '',
  createdAt: data?.created_at || undefined,
  updatedAt: data?.updated_at || undefined,
})
