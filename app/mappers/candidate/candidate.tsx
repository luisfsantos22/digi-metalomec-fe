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
  geographicAvailability: data?.geographic_availability || '',
})
