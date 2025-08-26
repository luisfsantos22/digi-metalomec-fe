'use client'

import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/app/css/globals.css'
import { Provider } from 'jotai'
import { MantineProvider } from '@mantine/core'
import { SessionProvider } from 'next-auth/react'
import { Notifications } from '@mantine/notifications'

export const Providers = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <Provider>
        <MantineProvider
          theme={{
            colors: {
              customBlue: [
                '#e1e8f4', // 0 - lightest
                '#c3d2e9', // 1
                '#a5bbe0', // 2
                '#87a5d6', // 3
                '#6990cc', // 4
                '#478ac9', // 5 - base
                '#3a6fb0', // 6
                '#2d558e', // 7
                '#203b6c', // 8
                '#12214b', // 9 - darkest
              ],
            },
          }}
        >
          <Notifications />
          {children}
        </MantineProvider>
      </Provider>
    </SessionProvider>
  )
}
