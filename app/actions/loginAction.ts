'use server'

import { getServerSession } from 'next-auth/next'
import authOptions from '../api/auth/[...nextauth]/auth'

export const loginAction = async () => {
  const session = await getServerSession(authOptions)
  if (session) {
    return { user: session.user }
  } else {
    throw new Error('Authentication failed')
  }
}
