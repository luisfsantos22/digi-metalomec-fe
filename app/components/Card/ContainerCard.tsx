import { classNames } from '@/utils'
import React from 'react'
import { Tabs } from '@mantine/core'
import { TabItem } from '@/app/types/utils/tab'
import classes from '@/app/css/mantine-tabs.module.css'

type ContainerCardProps = {
  bg?: string
  padding?: string
  children: React.ReactNode
  onClick?: () => void
  styles?: string
  withTabs?: boolean
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (index: string) => void
}

export default function ContainerCard(props: ContainerCardProps) {
  const {
    bg = 'bg-white',
    padding = 'p-[0.625rem]',
    children,
    onClick,
    styles = '',
    withTabs = false,
    tabs = [],
    activeTab = '',
    onTabChange,
  } = props

  const initialTab = activeTab ?? tabs[0]?.value ?? ''

  return (
    <div
      onClick={onClick}
      className={classNames(bg, padding, styles, 'rounded-xl')}
    >
      {withTabs && tabs.length > 0 ? (
        <div className="flex flex-col gap-4">
          <Tabs
            value={initialTab}
            onChange={(val) => val && onTabChange?.(val)}
            color="customBlue"
            classNames={classes}
          >
            <Tabs.List>
              {tabs.map((tab, idx) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled || false}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Panel
                key={tab.value}
                value={tab.value}
              >
                {initialTab === tab.value && children}
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
