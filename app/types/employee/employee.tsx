import { CreateUserData, User } from '../user'
import { Language, UserLanguage } from '@/app/types/utils/language'
import { EmployeeSkill } from './skill'
import { GenericJobTitle } from '../utils/job-title'
import { EducationalQualification } from '../utils/educational-qualification'

type EmergencyContact = {
  name?: string
  phone?: string
  relationship?: string
}

type Certification = {
  id?: string
  name: string
  issuer: string
  description?: string
}

type EmployeeCertification = Certification & {
  issuedAt?: Date | null
  expiresAt?: Date | null
  certificateUrl?: string | null
  validForDays?: number | null
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
  jobTitles: GenericJobTitle[]
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
  educationQualification?: EducationalQualification
  languages?: Language[]
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
  performances?: Performance[]
  createdAt: Date
  updatedAt: Date
  address?: string
  postalCode?: string
  city: string
  district?: string
  country: string
  dateOfBirth?: Date
}

type GenericEmployee = {
  id: string
  user: User
  company: string
  jobTitles: GenericJobTitle[]
  collaborationStartDate: Date
  photoUrl?: string
  performanceRating?: number
  status: string
  availabilityStatus: string
}

type CreateEmployeeData = {
  user: CreateUserData
  jobTitles: GenericJobTitle[]
  department?: string
  departmentName?: string
  nationalId?: string
  nif?: string
  socialSecurityNumber?: string
  collaborationStartDate?: string
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
  postalCode?: string
  city: string
  district?: string
  country: string
  dateOfBirth?: Date
  phoneNumber?: string
}

export type {
  GenericEmployee,
  EmployeeCertification,
  Employee,
  CreateEmployeeData,
  Certification,
}
