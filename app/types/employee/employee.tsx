import { CreateUserData, User } from '../user'
import { UserLanguage } from '../utils/Language'
import { EmployeeSkill } from './skill'

type EmergencyContact = {
  name: string
  phone: string
  relationship: string
}

type Certification = {
  id: string
  name: string
  issuer: string
  issueDate: Date
  description?: string
  validityPeriod?: number | null // in years
}

type EmployeeCertification = Certification & {
  issuedAt?: Date | null
  expiresAt?: Date | null
  certificateUrl?: string | null
}

type Performance = {
  period: string
  rating: number
  comments: string
}

type Employee = {
  id: string
  user: User
  company: string
  jobTitles: string[]
  department?: string
  departmentName?: string
  nationalId?: string
  nif?: string
  socialSecurityNumber?: string
  collaborationStartDate?: Date
  gender?: string
  maritalStatus?: string
  transportAvailable?: boolean
  geographicAvailability?: string
  preferredWorkLocation?: string
  emergencyContact?: EmergencyContact
  educationQualification?: string
  languages?: UserLanguage[]
  photoUrl?: string
  currentLocation?: string
  needsHousing?: boolean
  housingProvided?: boolean
  availabilityStatus: string
  status: string
  workPermitExpiry?: Date | null
  medicalCertificationExpiry?: Date | null
  skills?: string[]
  certifications?: Certification[]
  performances?: Performance[]
  createdAt: Date
  updatedAt: Date
  address?: string
  postal_code?: string
  city: string
  district?: string
  country: string
}

type GenericEmployee = {
  id: string
  user: User
  company: string
  jobTitles: string[]
  collaborationStartDate: Date
  photoUrl?: string
  performanceRating?: number
  status: string
  availabilityStatus: string
}

type CreateEmployeeData = {
  user: CreateUserData
  company?: string
  jobTitles: string[]
  department?: string
  departmentName?: string
  nationalId?: string
  nif?: string
  socialSecurityNumber?: string
  collaborationStartDate?: Date
  gender?: string
  maritalStatus?: string
  transportAvailable?: boolean
  geographicAvailability?: string
  preferredWorkLocation?: string
  emergencyContact?: EmergencyContact
  educationQualification?: string
  languages?: UserLanguage[]
  photoUrl?: string
  currentLocation?: string
  needsHousing?: boolean
  housingProvided?: boolean
  availabilityStatus: string
  status: string
  workPermitExpiry?: Date | null
  medicalCertificationExpiry?: Date | null
  skills?: EmployeeSkill[]
  certifications?: EmployeeCertification[]
  address?: string
  postal_code?: string
  city: string
  district?: string
  country: string
}

export type { GenericEmployee, Employee, CreateEmployeeData }
