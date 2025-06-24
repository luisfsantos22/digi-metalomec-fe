'use client'
import '@mantine/carousel/styles.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Provider } from 'jotai'
import { MantineProvider } from '@mantine/core'

export const Providers = ({ children }) => {
  return (
    <Provider>
      <MantineProvider>{children}</MantineProvider>
    </Provider>
  )
}
