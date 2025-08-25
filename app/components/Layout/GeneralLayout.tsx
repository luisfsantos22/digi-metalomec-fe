import MainNavbar from '../Navbar/MainNavbar'
import { ReactNode } from 'react'
import { Providers } from '../providers'

export default function GeneralLayout({
  children,
  session,
}: {
  children: ReactNode
  session: any
}) {
  return (
    <Providers session={session}>
      <div className="bg-digiblue-hover-options min-h-screen flex justify-center">
        <div className="w-full max-w-[90rem] min-h-screen">
          <MainNavbar />
          <main>{children}</main>
        </div>
      </div>
    </Providers>
  )
}
