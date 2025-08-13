'use client'

import { ReactNode } from 'react'

export default function Row({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      {title && <h3 className="text-digiblack1825-semibold">{title}</h3>}
      <div className="flex lg:flex-row flex-col lg:justify-between items-center w-full gap-10">
        {children}
      </div>
    </div>
  )
}
