'use client'

import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import MetricsSection from './Section/MetricsSection'
import ChartsSection from './Section/ChartsSection'
import EmployeesSection from './Section/EmployeesSection'
import CandidatesSection from './Section/CandidatesSection'

export default function DashboardContent() {
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  return tabActive === 'home' ? (
    <div className="flex flex-col gap-4 w-full p-4 lg:p-0">
      <MetricsSection />

      {/* <ChartsSection /> */}
    </div>
  ) : tabActive === 'employees' ? (
    <EmployeesSection />
  ) : tabActive === 'candidates' ? (
    <CandidatesSection />
  ) : null
}
