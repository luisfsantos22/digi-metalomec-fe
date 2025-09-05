import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      fullName?: string
      role: string
      companyName?: string
      companyId?: string
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
    id: string
    email: string
    first_name?: string
    last_name?: string
    role: string
    access: string
    refresh?: string
    company_name?: string
    company_id?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    firstName?: string
    lastName?: string
    fullName?: string
    role: string
    accessToken: string
    refreshToken: string
    companyName?: string
    companyId?: string
  }
}
