type UserCredentials = {
  email: string
  password: string
}

type User = {
  id: string
  username?: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  role: string
  fullName: string
  company: string
  phoneNumber?: string
}

type CreateUserData = {
  username?: string
  email: string
  firstName: string
  lastName: string
  role: string
  company: string
  phoneNumber?: string
}

export type { UserCredentials, User, CreateUserData }
