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
}

type CreateCandidateData = {
  user: CreateUserData
  jobTitles: GenericJobTitle[]
  availabilityStatus: string
  geographicAvailability: string
  internalIdentifier?: number
}

export type { GenericCandidate, CreateCandidateData }
