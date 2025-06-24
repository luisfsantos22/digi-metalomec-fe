'use client'

import { SessionProvider } from 'next-auth/react'
import MainNavbar from '../Navbar/MainNavbar'
import { ReactNode } from 'react'
import { Notifications } from '@mantine/notifications'
import { Providers } from '../providers'

export default function GeneralLayout({
  children,
  session,
}: {
  children: ReactNode
  session: any
}) {
  return (
    <Providers>
      <SessionProvider session={session}>
        <div className="bg-digiblue/20 min-h-screen flex justify-center">
          <Notifications />
          <div className="w-full max-w-[90rem] min-h-screen">
            <MainNavbar />
            <main>{children}</main>
          </div>
        </div>
      </SessionProvider>
    </Providers>
  )
}
