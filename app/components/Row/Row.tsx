'use client'

import { ReactNode } from 'react'
import AddButton from '../Button/AddButton'
import { classNames } from '@/utils'

export default function Row({
  title,
  withAddButton = false,
  action,
  tooltipText,
  id,
  children,
  extraStyles = '',
}: {
  title?: string
  withAddButton?: boolean
  action?: () => void
  tooltipText?: string
  id?: string
  extraStyles?: string
  children: ReactNode
}) {
  return (
    <div className={classNames(extraStyles, 'flex flex-col gap-2')}>
      <div className="flex items-center justify-between w-full">
        {title && <h3 className="text-digiblack1825-semibold">{title}</h3>}
        {withAddButton && (
          <AddButton
            id={id ?? ''}
            onClick={action ?? (() => {})}
            position="right"
            size="w-10 h-10"
            tooltipText={tooltipText}
          />
        )}
      </div>
      <div className="flex lg:flex-row flex-col lg:justify-between items-center w-full gap-10">
        {children}
      </div>
    </div>
  )
}
