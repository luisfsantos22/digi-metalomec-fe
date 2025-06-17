'use client'

import { SessionProvider } from 'next-auth/react'
import MainNavbar from '../Navbar/MainNavbar'
import { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

export default function GeneralLayout({
  children,
  session,
}: {
  children: ReactNode
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalClasses
        withCssVariables
        withStaticClasses
      >
        <div className="bg-digiblue/20 min-h-screen flex justify-center">
          <Notifications />
          <div className="w-full max-w-[90rem] min-h-screen">
            <MainNavbar />
            <main>{children}</main>
          </div>
        </div>
      </MantineProvider>
    </SessionProvider>
  )
}
