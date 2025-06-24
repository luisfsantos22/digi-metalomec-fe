import authOptions from '@/app/api/auth/[...nextauth]/auth'
import { Divider } from '@mantine/core'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import React from 'react'
import LateralNavbar from '../components/Navbar/LateralNavbar'
import Text from '../components/Text/Text'
import Providers from './providers'

export default async function WorkshopModuleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Providers session={session}>
      <div className="bg-digiblue/20 min-h-screen flex justify-center">
        <div className="w-full lg:max-w-[90rem] min-h-screen flex lg:flex-row flex-col">
          <LateralNavbar />
          <div className="flex flex-col gap-2 w-full lg:p-4 p-2 ">
            <Text
              header="h1"
              text="Módulo de Oficina"
              styles="lg:text-[40px] text-[32px] leading-[40px] font-bold text-digiorange lg:text-left text-center"
            />
            <Divider size="sm" />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </Providers>
  )
}
