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
  is_active: boolean
  role: string
  fullName: string
  companyName: string
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
