import { CreateUserData, User } from '../user'
import { GenericJobTitle } from '../utils/job-title'

type GenericCandidate = {
  id: string
  internalIdentifier?: number
  user: User
  jobTitles: GenericJobTitle[]
  updatedAt: Date
  availabilityStatus: string
  geographicAvailability: string
  lastIteraction?: string
}

type CreateCandidateData = {
  user: CreateUserData
  jobTitles: GenericJobTitle[]
  availabilityStatus: string
  geographicAvailability: string
  internalIdentifier?: number
}

type CandidateIteraction = {
  id: string
  employee: string
  description: string
  createdAt: Date
  updatedAt: Date
}

type CreateCandidateIteraction = {
  employee: string
  description: string
}

export type {
  GenericCandidate,
  CreateCandidateData,
  CreateCandidateIteraction,
  CandidateIteraction,
}
