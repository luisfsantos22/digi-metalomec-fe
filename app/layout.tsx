import './css/globals.css'
import type { Metadata } from 'next'
import React from 'react'
import GlobalLoadingWrapper from './components/Wrapper/GlobalLoadingWrapper'
import { Providers } from './components/providers'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Digiauto',
  description: 'O teu assistente digital para o setor automóvel',
  keywords:
    'car;cars;carro;automóveis;veículo;vehicle;assistente;digital;assistente digital',
  authors: [{ name: 'Digiauto', url: 'https://digiauto.pt/' }],
  openGraph: {
    title: 'Digiauto',
    description: 'O teu assistente digital para o setor automóvel',
    url: 'https://digiauto.pt/',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
        <Providers>
          <GlobalLoadingWrapper>{children}</GlobalLoadingWrapper>
        </Providers>
      </body>
    </html>
  )
}
