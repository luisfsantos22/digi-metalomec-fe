'use client'

import { globalLoadingAtom } from '@/app/atoms'
import { useAtom } from 'jotai'
import React from 'react'

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
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
