import ClearAllFiltersButton from '@/app/components/Button/ClearAllFiltersButton'
import FormDropdown from '@/app/components/Dropdown/FormDropdown'
import FormInput from '@/app/components/Input/FormInput'
import Row from '@/app/components/Row/Row'
import { WorkshopFilters } from '@/app/types/workshop/workshop'
import { isMobileSize } from '@/utils'
import { useWindowSize } from '@/utils/hooks'
import React, { useState } from 'react'

type RepairFiltersProps = {
  filters: WorkshopFilters
  setFilters: (filters: WorkshopFilters) => void
  stateRepairOptions: {
    label: string
    value: string
  }[]
}

export default function RepairFilters(props: RepairFiltersProps) {
  const { filters, setFilters, stateRepairOptions } = props
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const screenSize = useWindowSize()
  const isMobile = isMobileSize(screenSize)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full bg-white p-4 rounded-xl">
      <p
        className="lg:hidden w-full text-center text-digiorange1624-semibold"
        onClick={toggleCollapse}
      >
        {isCollapsed ? 'Ver Filtros' : 'Esconder Filtros'}
      </p>
      {(!isMobile || !isCollapsed) && (
        <Row>
          <FormInput
            placeholder="nOr"
            query={filters.nOr || ''}
            setQuery={(value) => {
              handleFilterChange({
                target: { name: 'nOr', value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            inputType="text"
            width="lg:w-1/6 w-full"
            clearable
          />
          <FormInput
            placeholder="Marca e/ou Modelo"
            query={filters.vehicleName || ''}
            setQuery={(value) => {
              handleFilterChange({
                target: { name: 'vehicleName', value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            inputType="text"
            width="lg:w-1/6 w-full"
            clearable
          />
          <FormInput
            placeholder="Matrícula"
            query={filters.licensePlate || ''}
            setQuery={(value) => {
              handleFilterChange({
                target: { name: 'licensePlate', value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            inputType="text"
            width="lg:w-1/6 w-full"
            clearable
          />
          <FormDropdown
            choices={stateRepairOptions.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            placeholder="Estado da reparação..."
            selectedValue={filters.state || ''}
            setSelectedValue={(value) => {
              handleFilterChange({
                target: { name: 'state', value },
              } as React.ChangeEvent<HTMLInputElement>)
            }}
            width="lg:w-1/6 w-full"
          />
          <ClearAllFiltersButton
            onClick={() => {
              setFilters({
                nOr: '',
                vehicleName: '',
                licensePlate: '',
                state: undefined,
              })
            }}
            width="lg:w-auto w-full lg:justify-start justify-center"
            id="clear-filters-btn"
          />
        </Row>
      )}
    </div>
  )
}
