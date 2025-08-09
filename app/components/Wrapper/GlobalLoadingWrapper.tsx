'use client'

import { globalLoadingAtom } from '@/app/atoms'
import { useAtom } from 'jotai'
import React from 'react'
import { OverlaySpinner } from '../Spinner/OverlaySpinner'

export default function GlobalLoadingWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading] = useAtom(globalLoadingAtom)

  return (
    <div className="relative">
      {/* Main content */}
      {children}

      {/* Loading overlay */}
      {isLoading && <OverlaySpinner />}
    </div>
  )
}
