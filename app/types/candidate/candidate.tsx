import { CreateUserData, UpdateUserData, User } from '../user'
import { GenericJobTitle } from '../utils/job-title'
import {
  GeographicLocationInput,
  GeographicLocationOutput,
} from '../geolocation'

type GenericCandidate = {
  id: string
  internalIdentifier?: number
  user: User
  jobTitles: GenericJobTitle[]
  updatedAt: Date
  availabilityStatus: string
  geographicLocation?: GeographicLocationOutput
  lastIteraction?: string
  nationality?: string
}

type UpdateCandidateData = {
  user: UpdateUserData
  jobTitles: GenericJobTitle[]
  availabilityStatus: string
  geographicLocation?: GeographicLocationInput
  internalIdentifier?: number
  nationality?: string
}

type CreateCandidateData = {
  user: CreateUserData
  jobTitles: GenericJobTitle[]
  availabilityStatus: string
  geographicLocation?: GeographicLocationInput
  internalIdentifier?: number
  nationality?: string
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
  UpdateCandidateData,
}
