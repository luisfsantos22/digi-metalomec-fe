'use client'

import { Fragment, useState } from 'react'
import { useWindowSize } from '@/utils/hooks'
import { isDesktopSize, classNames } from '@/utils'
import TopMobileNavbar from './TopMobileNavbar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import GenericTooltip from '../Tooltip/GenericTooltip'
import { useSession } from 'next-auth/react'
import Text from '../Text/Text'
import LogoutButton from '../Button/LogoutButton'

const navigationItems = [
  {
    name: 'Reparações',
    href: '/workshop-module/repair',
    icon: '/icons/repair.svg',
    activeIcon: '/icons/repair-red.svg',
  },
  {
    name: 'Fornecedores',
    href: '/workshop-module/suppliers',
    icon: '/icons/supplier.svg',
    activeIcon: '/icons/supplier-red.svg',
  },
  {
    name: 'Clientes',
    href: '/workshop-module/clients',
    icon: '/icons/client.svg',
    activeIcon: '/icons/client-red.svg',
  },
]

export default function LateralNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const screenSize = useWindowSize()
  const isDesktop = isDesktopSize(screenSize)

  return (
    <>
      {isDesktop ? (
        <aside
          className={classNames(
            isCollapsed ? 'w-20' : 'w-56',
            'bg-white border-r border-digibrown transition-all duration-300 h-full flex flex-col'
          )}
        >
          {/* Header with Logo */}
          <div
            className={classNames(
              isCollapsed ? 'justify-center' : 'justify-between',
              'flex  lg:gap-4 gap-2 items-center  p-4 '
            )}
          >
            {!isCollapsed && (
              <div className="flex flex-none items-start relative h-8 w-28">
                <Image
                  src="/icons/logo-navbar.svg"
                  alt="Logo Digiauto"
                  style={{ objectFit: 'contain' }}
                  fill
                  priority
                />
              </div>
            )}
            {isCollapsed ? (
              <div
                onClick={() => setIsCollapsed(false)}
                className="flex flex-none items-center justify-center relative mb-2 h-6 w-6 rounded-lg hover:cursor-pointer hover:bg-digiorange hover:bg-opacity-10"
              >
                <Image
                  src="/icons/double-arrow-right.svg"
                  alt="Arrow right icon"
                  style={{ objectFit: 'contain' }}
                  width={16}
                  height={16}
                />
              </div>
            ) : (
              <div
                onClick={() => setIsCollapsed(true)}
                className="flex flex-none items-center justify-center relative h-6 w-6 rounded-lg hover:cursor-pointer hover:bg-digiorange hover:bg-opacity-10"
              >
                <Image
                  src="/icons/double-arrow-left.svg"
                  alt="Arrow left icon"
                  style={{ objectFit: 'contain' }}
                  width={16}
                  height={16}
                />
              </div>
            )}
          </div>

          <nav className="p-4 flex-grow">
            <ul className="space-y-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <li
                    key={item.href}
                    className={classNames(
                      isActive && ' border-b-2 border-digired'
                    )}
                  >
                    <Link
                      href={item.href}
                      id={`nav-${item.name}`}
                      className={classNames(
                        isCollapsed ? 'justify-center' : 'justify-start',
                        `flex items-center gap-2 p-2 rounded-lg hover:bg-digiorange hover:bg-opacity-10 relative group`
                      )}
                    >
                      <div className="h-6 w-6 relative transition-transform duration-300">
                        <Image
                          src={isActive ? item.activeIcon : item.icon}
                          alt={item.name}
                          fill
                          loading="eager"
                          style={{ objectFit: 'contain' }}
                          className="transition-opacity duration-300"
                        />
                      </div>
                      {!isCollapsed && (
                        <Text
                          text={item.name}
                          styles={classNames(
                            isActive
                              ? 'text-digired1624-semibold'
                              : 'text-digibrown1624-semibold',
                            'line-clamp-1'
                          )}
                        />
                      )}
                      <GenericTooltip
                        anchorSelect={`nav-${item.name}`}
                        text={item.name}
                        hidden={!isCollapsed}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          {/* User Profile Menu */}
          <div className="flex flex-col gap-4 p-4 w-full">
            <div className="flex gap-2 items-center w-full justify-center">
              <div className="flex flex-none items-start h-12 w-12 relative">
                <Image
                  src="/icons/user-default.svg"
                  alt="User"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {!isCollapsed && (
                <Text
                  text={session?.user?.email || ''}
                  styles="text-digiblack1624-semibold line-clamp-1"
                />
              )}
            </div>
            <LogoutButton isCollapsed={isCollapsed} />
          </div>
        </aside>
      ) : (
        <TopMobileNavbar>
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href

            return (
              <Fragment key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 p-2 w-full"
                >
                  <div className="h-6 w-6 relative">
                    <Image
                      src={isActive ? item.activeIcon : item.icon}
                      alt={item.name}
                      fill
                      loading="eager"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <Text
                    text={item.name}
                    styles={classNames(
                      isActive
                        ? 'text-digired1624-semibold'
                        : 'text-digibrown1624-semibold'
                    )}
                  />
                </Link>
                {index < navigationItems.length - 1 && (
                  <div
                    key={`divider-${item.name}`}
                    className="h-px bg-digibrown my-2"
                  />
                )}
              </Fragment>
            )
          })}
        </TopMobileNavbar>
      )}
    </>
  )
}
