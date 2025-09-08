import './css/globals.css'
import React from 'react'
import GlobalLoadingWrapper from './components/Wrapper/GlobalLoadingWrapper'
import { Providers } from './components/providers'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body className="font-inter antialiased">
        <Providers session={session}>
          <GlobalLoadingWrapper>{children}</GlobalLoadingWrapper>
        </Providers>
      </body>
    </html>
  )
}
