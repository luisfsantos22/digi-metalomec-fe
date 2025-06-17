'use client'

import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'

export default function DashboardContent() {
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  const handleTabChange = (tab: string) => {
    setTabActive(tab)
  }

  return (
    <>
      {tabActive === 'overview' ? (
        <div onClick={() => handleTabChange('overview')}>Overview group</div>
      ) : null}
      {/* Add tab switchers or other UI controls here */}
    </>
  )
}
