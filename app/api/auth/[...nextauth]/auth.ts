import CredentialsProvider from 'next-auth/providers/credentials'
import axiosInstance from '@/app/hooks/axiosInstance'
import { translateRole } from '@/utils'
import type { AuthOptions } from 'next-auth'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username and password are required')
        }

        try {
          const { data } = await axiosInstance.post('auth/login', {
            username: credentials.username,
            password: credentials.password,
          })

          if (data && data.token) {
            return {
              id: data.user.uuid,
              username: data.user.username,
              token: data.token,
              role: data.user.role,
              first_name: data.user.firstName,
              last_name: data.user.lastName,
              company_uuid: data.user.companyUuid || '',
            }
          }

          return null
        } catch {
          throw new Error('Invalid username or password')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          role: translateRole(user.role),
          companyUuid: user.company_uuid || '',
          accessToken: user.token,
          refreshToken: user.refresh_token || '',
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
          username: token.username,
          firstName: token.firstName,
          lastName: token.lastName,
          role: token.role,
          companyUuid: token.companyUuid || '',
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    },
  },
}

export { authOptions }
export default authOptions
