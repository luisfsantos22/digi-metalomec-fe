'use client'

import Image from 'next/image'
import ContainerCard from '../Card/ContainerCard'
import SecondaryButton from '../Button/SecondaryButton'
import { useRef, useState, useEffect } from 'react'
import Text from '../Text/Text'
import { signOut, useSession } from 'next-auth/react'
import GenericTooltip from '../Tooltip/GenericTooltip'
import { useIsTruncated, useWindowSize } from '@/utils/hooks'
import { Divider, Menu } from '@mantine/core'
import { classNames, isDesktopSize, translateRole } from 'utils'
import NavbarMobileButton from '../Button/NavbarMobileButton'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import { useSearchParams, useRouter } from 'next/navigation'
import useOutsideClick from '@/app/hooks/utils/useOutsideClick'

export default function MainNavbar() {
  const textRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isTruncated = useIsTruncated(textRef)
  const screenSize = useWindowSize()

  const { data: session } = useSession()

  const [opened, setOpened] = useState(false)
  const [openDivMobile, setOpenDivMobile] = useState(false)

  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Sync tabActive with module param in URL
  useEffect(() => {
    const moduleParam = searchParams.get('module')
    if (moduleParam && tabActive !== moduleParam) {
      setTabActive(moduleParam)
    }
  }, [searchParams, setTabActive])

  // Helper to update both tab and URL
  const handleTabChange = (tab: string) => {
    setTabActive(tab)
    router.push(`/dashboard?module=${tab}`)
    if (!isDesktopSize(screenSize)) {
      setOpenDivMobile(false)
    }
  }

  const isDesktop = isDesktopSize(screenSize)

  const dropdownRef = useOutsideClick(() => setOpened(false))

  return (
    <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 items-center justify-between lg:py-8 p-4 lg:p-0 bg-none lg:h-48 w-full">
      <ContainerCard
        onClick={() => handleTabChange('home')}
        styles="hover:cursor-pointer hover:bg-digiblue-hover/20 w-full lg:w-auto flex justify-between"
      >
        <div className="flex flex-col gap-1 items-center">
          <Text
            text={session?.user?.companyName ?? ''}
            styles="text-digiblack1624-bold"
            id={'navbar-title'}
          />
          <div className="flex gap-2 justify-start lg:justify-center items-center w-full">
            <Text
              text={'by'}
              styles="text-digiblack1212-semibold"
              id={'navbar-subtitle'}
            />
            <div className="flex flex-none h-6 w-[5rem] relative">
              <Image
                src={'/icons/logo-navbar.svg'}
                alt={'Logo Image'}
                style={{ objectFit: 'contain' }}
                fill
                priority
              />
            </div>
          </div>
        </div>
        {!isDesktop && (
          <div
            className="flex flex-none h-8 w-8 items-center justify-center self-center relative mr-2"
            onClick={(e) => {
              e.stopPropagation()
              setOpenDivMobile(!openDivMobile)
            }}
          >
            <Image
              src={'/icons/menu-burger.svg'}
              alt={'Burger Menu Image'}
              style={{ objectFit: 'contain' }}
              fill
            />
          </div>
        )}
      </ContainerCard>
      {isDesktop && (
        <ContainerCard>
          <div className="flex h-14 items-start gap-4 justify-between relative w-full">
            <SecondaryButton
              id="home"
              text="Visão Geral"
              size="large"
              onClick={() => handleTabChange('home')}
              active={tabActive === 'home'}
              withImage
              imageSrc={
                tabActive === 'home'
                  ? '/icons/bubble_chart_white.svg'
                  : '/icons/bubble_chart.svg'
              }
            />
            <SecondaryButton
              id="analytics"
              text="Analytics"
              onClick={() => handleTabChange('analytics')}
              active={tabActive === 'analytics'}
              withImage
              imageSrc={
                tabActive === 'analytics'
                  ? '/icons/insights_white.svg'
                  : '/icons/insights.svg'
              }
              disabled={true}
            />
            <SecondaryButton
              id="candidates"
              text="Candidatos"
              onClick={() => handleTabChange('candidates')}
              active={tabActive === 'candidates'}
              withImage
              imageSrc={
                tabActive === 'candidates'
                  ? '/icons/candidate_white.svg'
                  : '/icons/candidate.svg'
              }
            />
            <SecondaryButton
              id="clients"
              text="Clientes"
              onClick={() => handleTabChange('clients')}
              active={tabActive === 'clients'}
              withImage
              imageSrc={
                tabActive === 'clients'
                  ? '/icons/supervised_user_circle_white.svg'
                  : '/icons/supervised_user_circle.svg'
              }
              disabled={true}
            />
            <SecondaryButton
              id="employees"
              text="Colaboradores"
              onClick={() => handleTabChange('employees')}
              active={tabActive === 'employees'}
              withImage
              imageSrc={
                tabActive === 'employees'
                  ? '/icons/employee-white.svg'
                  : '/icons/employee.svg'
              }
            />
          </div>
        </ContainerCard>
      )}
      {isDesktop && (
        <Menu
          shadow="md"
          width={200}
          position="bottom-end"
          opened={opened}
        >
          <ContainerCard styles="max-w-[18.75rem]">
            <Menu.Target>
              <div className="flex h-14 items-center gap-3 justify-between relative w-full">
                <div className="flex flex-none h-10 w-10 rounded-full relative ">
                  <Image
                    src={'/icons/user-default.svg'}
                    alt={'Imagem de perfil do utilizador'}
                    style={{ objectFit: 'contain' }}
                    fill
                  />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 items-start">
                  <Text
                    text={session?.user?.fullName ?? ''}
                    styles="text-digiblack1624-semibold line-clamp-1"
                    id={'email'}
                    ref={textRef}
                  />
                  <GenericTooltip
                    anchorSelect="email"
                    text={session?.user?.fullName ?? ''}
                    hidden={!isTruncated}
                    withArrow={false}
                  />
                  <Text
                    text={translateRole(session?.user?.role) ?? ''}
                    styles="text-digiblack1420-normal"
                  />
                </div>

                <div
                  className="flex flex-none h-6 w-6 rounded-full relative"
                  onClick={() => setOpened(!opened)}
                >
                  <Image
                    src={
                      opened ? '/icons/arrow_up.svg' : '/icons/arrow_down.svg'
                    }
                    alt={'Arrow de dropdown'}
                    style={{ objectFit: 'contain' }}
                    className="hover:cursor-pointer hover:bg-digiblue-hover/20 hover:rounded-full"
                    fill
                  />
                </div>
              </div>
            </Menu.Target>
            <Menu.Dropdown ref={dropdownRef}>
              <Menu.Item
                bg={'digiblue-hover/20'}
                disabled
              >
                Perfil
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={() => signOut()}
              >
                Terminar sessão
              </Menu.Item>
            </Menu.Dropdown>
          </ContainerCard>
        </Menu>
      )}
      {/* Mobile options */}
      {!isDesktop && openDivMobile && (
        <div
          className={classNames(
            openDivMobile ? 'opacity-100 max-h-full' : 'max-h-0 opacity-0',
            'bg-white p-4 w-full rounded-xl transition-all duration-500 ease-in-out overflow-hidden'
          )}
          style={{
            minHeight: openDivMobile
              ? `${contentRef.current?.scrollHeight}px`
              : '0px',
          }}
          ref={contentRef}
        >
          <NavbarMobileButton
            id="home"
            text="Visão Geral"
            isActive={tabActive === 'home'}
            type="button"
            onClick={() => handleTabChange('home')}
          />
          <Divider />
          <NavbarMobileButton
            id="analytics"
            text="Analytics"
            isActive={tabActive === 'analytics'}
            type="button"
            onClick={() => handleTabChange('analytics')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="clients"
            text="Clientes"
            isActive={tabActive === 'clients'}
            type="button"
            onClick={() => handleTabChange('clients')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="employees"
            text="Colaboradores"
            isActive={tabActive === 'employees'}
            type="button"
            onClick={() => handleTabChange('employees')}
          />
          <Divider />
          <div className="mt-8">
            <NavbarMobileButton
              id="signout"
              text="Terminar Sessão"
              isActive={false}
              type="button"
              onClick={() => signOut()}
              secondary
            />
          </div>
        </div>
      )}
    </div>
  )
}
