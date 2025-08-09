import { GenericEmployee } from '@/app/types/employee/employee'

export const mapGenericEmployee = (data: any): GenericEmployee => ({
  id: data.id,
  user: {
    id: data.user.uuid,
    firstName: data.user.first_name,
    lastName: data.user.last_name,
    username: data.user.username,
    is_active: data.user.is_active,
    fullName: `${data.user.first_name} ${data.user.last_name}`,
    email: data.user.email,
    role: data.user.role,
    companyName: data.user.company_name || '',
  },
  company: data.company,
  jobTitles: data.job_titles || [],
  collaborationStartDate: data.collaboration_start_date,
  photoUrl: data.photoUrl || '',
  performanceRating: data.performance_rating_overall || 0,
  availabilityStatus: data.availability_status || '',
  status: data.status || '',
})
