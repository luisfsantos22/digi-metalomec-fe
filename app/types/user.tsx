type UserCredentials = {
  email: string
  password: string
}

type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  role: string
  fullName: string
  companyName: string
  phoneNumber?: string
}

type CreateUserData = {
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  companyName: string
}

export type { UserCredentials, User, CreateUserData }
