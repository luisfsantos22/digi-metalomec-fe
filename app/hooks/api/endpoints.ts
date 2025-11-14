import { SimpleUser } from '@/app/types/user/user'
import { get } from 'axios'

export const AUTH_ENDPOINTS = {
  login: 'api/v1/users/login/',
  refreshToken: 'api/v1/users/refresh/',
  logout: 'api/v1/users/logout/',
  ping: 'api/v1/users/auth/ping/',
} as const

export const USER_ENDPOINTS = {
  getCurrentUser: 'api/v1/users/me/',
  updateProfile: 'api/v1/users/profile/',
} as const

export const CANDIDATE_ENDPOINTS = {
  candidates: 'api/v1/employees/candidates/',
  getCandidateById: (id: string) => `api/v1/employees/candidates/${id}/`,
  getCandidatesPage: (page: number) =>
    `api/v1/employees/candidates/?page=${page}`,
  getCandidateForActivation: (id: string) =>
    `api/v1/employees/candidates/${id}/activation/`,
  getCandidatesIteractions: (candidateId?: string) =>
    `api/v1/employees/iteractions/${candidateId ? `?employee=${candidateId}` : ''}`,
  getCandidatesIteractionsPage: (candidateId: string, page: number) =>
    `api/v1/employees/iteractions/?page=${page}&employee=${candidateId}`,
  getCandidateIteractionById: (id: string) =>
    `api/v1/employees/iteractions/${id}/`,
  searchByLocation: 'api/v1/employees/candidates/search-by-location/',
}

export const EMPLOYEE_DOCUMENTS_ENDPOINTS = {
  documents: 'api/v1/employees/employee-documents/',
  getDocumentById: (id: string) => `api/v1/employees/employee-documents/${id}/`,
  getDocumentsByEmployeeId: (employeeId: string) =>
    `api/v1/employees/employee-documents/by-employee/${employeeId}/`,
  downloadDocumentFile: (id: string) =>
    `api/v1/employees/employee-documents/${id}/download/`,
  getEmployeeContracts: (employeeId: string, documentType: string) =>
    `api/v1/employees/employee-documents/by-employee/${employeeId}/?document_type=${documentType}`,
}

export const EMPLOYEE_ENDPOINTS = {
  employees: 'api/v1/employees/employees/',
  getEmployeesPage: (page: number) =>
    `api/v1/employees/employees/?page=${page}`,
  getEmployeeById: (id: string) => `api/v1/employees/employees/${id}/`,
  getEmployeeForActivation: (id: string) =>
    `api/v1/employees/employees/${id}/activation/`,
  jobTitles: 'api/v1/employees/job-titles/',
  certifications: 'api/v1/employees/certifications/',
  employeeCertification: 'api/v1/employees/employee-certifications/',
  getCertificationEmployeeById: (id: string) =>
    `api/v1/employees/employee-certifications/${id}/`,
  getCertificationById: (id: string) =>
    `api/v1/employees/certifications/${id}/`,
  skills: 'api/v1/employees/skills/',
  skillEmployee: 'api/v1/employees/employee-skills/',
  getSkillEmployeeById: (id: string) =>
    `api/v1/employees/employee-skills/${id}/`,
  getSkillById: (id: string) => `api/v1/employees/skills/${id}/`,
  getEducationalQualifications: 'api/v1/employees/educational-qualifications/',
}

// Types for API responses
export interface AuthResponse {
  access: string
  refresh: string
  user: {
    uuid: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export interface UserResponse extends SimpleUser {}

// Types for the endpoints
export type ApiEndpoints = {
  auth: typeof AUTH_ENDPOINTS
  user: typeof USER_ENDPOINTS
}

// Type for parameters
export interface LoginParams {
  email: string
  password: string
}

export interface UpdateProfileParams {
  fullName?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}
