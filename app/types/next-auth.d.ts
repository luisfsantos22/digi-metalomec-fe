import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      firstName?: string
      lastName?: string
      role: string
      companyUuid?: string
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
    id: string
    username: string
    first_name?: string
    last_name?: string
    role: string
    token: string
    refresh_token?: string
    company_uuid?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username: string
    firstName?: string
    lastName?: string
    role: string
    companyUuid?: string
    accessToken: string
    refreshToken: string
  }
}
