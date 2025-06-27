'use client'

import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import MetricsSection from './Section/MetricsSection'
import ChartsSection from './Section/ChartsSection'
import EmployeesSection from './Section/EmployeesSection'

export default function DashboardContent() {
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  return tabActive === 'home' ? (
    <div className="flex flex-col gap-4 w-full">
      <MetricsSection />

      <ChartsSection />
    </div>
  ) : tabActive === 'employees' ? (
    <EmployeesSection />
  ) : null
}
