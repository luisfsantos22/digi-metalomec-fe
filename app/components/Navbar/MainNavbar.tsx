'use client'

import Image from 'next/image'
import ContainerCard from '../Card/ContainerCard'
import { redirect } from 'next/navigation'
import SecondaryButton from '../Button/SecondaryButton'
import { useRef, useState } from 'react'
import Text from '../Text/Text'
import { signOut, useSession } from 'next-auth/react'
import GenericTooltip from '../Tooltip/GenericTooltip'
import { useIsTruncated, useWindowSize } from '@/utils/hooks'
import { Divider, Menu } from '@mantine/core'
import { classNames, isDesktopSize } from '@/utils'
import NavbarMobileButton from '../Button/NavbarMobileButton'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
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

  const isDesktop = isDesktopSize(screenSize)

  const dropdownRef = useOutsideClick(() => setOpened(false))

  return (
    <div className="flex lg:flex-row flex-col lg:gap-8 gap-4 items-center justify-between lg:py-8 p-4 lg:p-0 bg-none lg:h-48 w-full">
      <ContainerCard
        onClick={() => redirect('/workshop-module/repair')}
        styles="hover:cursor-pointer hover:bg-digigold w-full lg:w-auto flex justify-between"
      >
        <div className="flex flex-none h-14 w-[8.125rem] items-start relative">
          <Image
            src={'/icons/logo-navbar.svg'}
            alt={'Logo Image'}
            style={{ objectFit: 'contain' }}
            fill
            priority
          />
        </div>
        {!isDesktop && (
          <div
            className="flex flex-none h-8 w-8 items-center justify-center self-center relative mr-2"
            onClick={() => setOpenDivMobile(!openDivMobile)}
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
              id="overview"
              text="Visão Geral"
              onClick={() => setTabActive('overview')}
              active={tabActive === 'overview'}
              withImage
              imageSrc={
                tabActive === 'overview'
                  ? '/icons/bubble_chart_white.svg'
                  : '/icons/bubble_chart.svg'
              }
            />
            <SecondaryButton
              id="sales"
              text="Vendas"
              onClick={() => setTabActive('sales')}
              active={tabActive === 'sales'}
              withImage
              imageSrc={
                tabActive === 'sales'
                  ? '/icons/bar_chart_white.svg'
                  : '/icons/bar_chart.svg'
              }
              disabled={true}
            />
            <SecondaryButton
              id="vehicles"
              text="Veículos"
              onClick={() => setTabActive('vehicles')}
              active={tabActive === 'vehicles'}
              withImage
              imageSrc={
                tabActive === 'vehicles'
                  ? '/icons/local_car_wash_white.svg'
                  : '/icons/local_car_wash.svg'
              }
              disabled={true}
            />
            <SecondaryButton
              id="clients"
              text="Clientes"
              onClick={() => setTabActive('clients')}
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
              id="analytics"
              text="Analytics"
              onClick={() => setTabActive('analytics')}
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
              id="workshop"
              text="Oficina"
              onClick={() => {
                setTabActive('workshop')
                redirect('/workshop-module/repair')
              }}
              active={tabActive === 'workshop'}
              withImage
              imageSrc={
                tabActive === 'workshop'
                  ? '/icons/workshop_white.svg'
                  : '/icons/workshop.svg'
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
          <ContainerCard styles="max-w-[15rem]">
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
                    text={session?.user?.username ?? ''}
                    styles="text-digiblack1624-semibold line-clamp-1"
                    id={'username'}
                    ref={textRef}
                  />
                  <GenericTooltip
                    anchorSelect="username"
                    text={session?.user?.username ?? ''}
                    hidden={!isTruncated}
                    withArrow={false}
                  />
                  <Text
                    text={session?.user?.role ?? ''}
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
                    className="hover:cursor-pointer hover:bg-digigold hover:rounded-full"
                    fill
                  />
                </div>
              </div>
            </Menu.Target>
            <Menu.Dropdown ref={dropdownRef}>
              <Menu.Item disabled>Perfil</Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={() => signOut()}>Terminar sessão</Menu.Item>
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
            id="overview"
            text="Visão Geral"
            isActive={tabActive === 'overview'}
            type="button"
            onClick={() => {
              setTabActive('overview')
              redirect('/workshop-module/repair')
            }}
          />
          <Divider />
          <NavbarMobileButton
            id="sales"
            text="Vendas"
            isActive={tabActive === 'sales'}
            type="button"
            onClick={() => setTabActive('sales')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="vehicles"
            text="Veículos"
            isActive={tabActive === 'vehicles'}
            type="button"
            onClick={() => setTabActive('vehicles')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="clients"
            text="Clientes"
            isActive={tabActive === 'clients'}
            type="button"
            onClick={() => setTabActive('clients')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="analytics"
            text="Analytics"
            isActive={tabActive === 'analytics'}
            type="button"
            onClick={() => setTabActive('analytics')}
            disabled
          />
          <Divider />
          <NavbarMobileButton
            id="workshop"
            text="Oficina"
            isActive={tabActive === 'workshop'}
            type="button"
            onClick={() => setTabActive('workshop')}
          />
        </div>
      )}
    </div>
  )
}
