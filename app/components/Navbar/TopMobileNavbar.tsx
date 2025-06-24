'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useState } from 'react'
import LogoutButton from '../Button/LogoutButton'
import Text from '../Text/Text'

interface TopMobileNavbarProps {
  children: React.ReactNode
}

export default function TopMobileNavbar({ children }: TopMobileNavbarProps) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-none h-8 w-28 items-start relative">
          <Image
            src="/icons/logo-navbar.svg"
            alt="Logo Digiauto"
            style={{ objectFit: 'contain' }}
            fill
            priority
          />
        </div>
        <div
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
          className="flex flex-none h-8 w-8 items-center justify-center self-center relative"
        >
          <Image
            src="/icons/menu-burger.svg"
            alt="Menu"
            style={{ objectFit: 'contain' }}
            fill
          />
        </div>
      </div>

      {openMobileMenu && (
        <div className="bg-white absolute p-4 w-full h-full z-50 rounded-xl transition-all duration-500 ease-in-out">
          {children}
          <div className="h-px bg-digibrown my-2" />
          <div className="flex items-center gap-2 p-2">
            <div className="h-10 w-10 relative">
              <Image
                src="/icons/user-default.svg"
                alt="User"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <Text
              text={session?.user?.email || ''}
              styles="text-digiblack1624-semibold"
            />
          </div>
          <div className="h-px bg-digibrown my-2" />
          <LogoutButton isCollapsed={false} />
        </div>
      )}
    </div>
  )
}
