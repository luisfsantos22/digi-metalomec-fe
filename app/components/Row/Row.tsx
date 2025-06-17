'use client'

import { ReactNode } from 'react'

export default function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex lg:flex-row flex-col lg:justify-between items-center w-full gap-10">
      {children}
    </div>
  )
}
