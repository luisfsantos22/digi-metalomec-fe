import CredentialsProvider from 'next-auth/providers/credentials'
import axiosInstance from '@/app/hooks/axiosInstance'
import { AUTH_ENDPOINTS } from '@/app/hooks/api/endpoints'
import type { AuthOptions } from 'next-auth'
import jwt from 'jsonwebtoken'

const authOptions: AuthOptions = {
  debug: true,
  // Configure auth pages
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  // Configure auth providers
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const { data } = await axiosInstance.post(AUTH_ENDPOINTS.login, {
            email: credentials.email,
            password: credentials.password,
          })

          if (data && data.access && data.refresh) {
            const token = data.access
            const userData = jwt.decode(token)

            return {
              id: userData.user_id,
              email: userData.user.email,
              access: token,
              role: userData.user.groups[0] || '',
              first_name: userData.user.first_name,
              last_name: userData.user.last_name,
              refresh: data.refresh,
              company_name: userData.user.company_name || '',
              company_id: userData.user.company_id || '',
            }
          }

          throw new Error('Invalid response from server')
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error)
          if (error.response?.status === 401) {
            throw new Error('Credenciais inválidas')
          }
          throw new Error(
            error.response?.data?.detail || 'An error occurred during login'
          )
        }
      },
    }),
  ],
  // Set secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          fullName: `${user.first_name} ${user.last_name}`,
          role: user.role,
          accessToken: user.access,
          refreshToken: user.refresh || '',
          companyName: user.company_name || '',
          companyId: user.company_id || '',
        }
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          firstName: token.firstName,
          lastName: token.lastName,
          fullName: token.fullName,
          role: token.role,
          companyName: token.companyName || '',
          companyId: token.companyId || '',
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    },
  },
}

export { authOptions }
export default authOptions
