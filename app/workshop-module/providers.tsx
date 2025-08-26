'use client'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/app/css/globals.css'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <Notifications />
        {children}
      </MantineProvider>
    </SessionProvider>
  )
}
