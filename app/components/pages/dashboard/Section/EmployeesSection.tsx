import { Pagination, ScrollArea, Table } from '@mantine/core'
import { useState } from 'react'
import ContainerCard from '../../../Card/ContainerCard'
import Row from '../../../Row/Row'
import FormInput from '../../../Input/FormInput'
import FormDropdown from '../../../Dropdown/FormDropdown'
import ClearAllFiltersButton from '../../../Button/ClearAllFiltersButton'
import Text from '../../../Text/Text'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import useCompanyEmployeesQuery from '@/app/hooks/employees/useCompanyEmployeesQuery'
import {
  translateEmployeeAvailabilityStatus,
  translateEmployeeStatus,
} from '@/app/utils'
import Spinner from '@/app/components/Spinner/Spinner'
import { OverlaySpinner } from '@/app/components/Spinner/OverlaySpinner'
import EditButton from '@/app/components/Button/EditButton'
import DeleteButton from '@/app/components/Button/DeleteButton'
import { useRouter } from 'next/navigation'
import { GenericEmployee } from '@/app/types/employee/employee'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import { useSession } from 'next-auth/react'
import { useDeleteEmployee } from '@/app/hooks/employees/useDeleteEmployee'
import Image from 'next/image'
import { classNames } from '@/utils'
import AddButton from '@/app/components/Button/AddButton'
import FormCheckbox from '@/app/components/Form/FormCheckbox'
import { AVAILABILITY_STATUS, EMPLOYEE_STATUS } from '@/app/constants'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'

const EmployeesSection = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  // States for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [jobTitleFilter, setJobTitleFilter] = useState<string | undefined>(
    undefined
  )
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  )

  // State for modal and selected employee
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [scrolled, setScrolled] = useState(false)

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] =
    useState<boolean>(false)
  const [selectedEmployee, setSelectedEmployee] =
    useState<GenericEmployee | null>(null)
  // State to force refresh
  const [refreshFlag, setRefreshFlag] = useState(false)

  // useQueries
  const { employees, loading, error, count } = useCompanyEmployeesQuery(
    activePage,
    searchQuery,
    jobTitleFilter,
    availabilityFilter,
    statusFilter,
    refreshFlag // add refreshFlag as a dependency
  )

  // Employee deletion function
  const { deleteEmployee } = useDeleteEmployee()

  // Clear all filters
  const handleClearFilters = () => {
    setAvailabilityFilter([])
    setJobTitleFilter('')
    setSearchQuery('')
    setStatusFilter('')
    setActivePage(1)
  }

  const handleDelete = async (id: string, token: string) => {
    await deleteEmployee(id, token)
    setAreYouSureToDeleteOpen(false)
    setSelectedEmployee(null)
    setRefreshFlag((prev) => !prev) // toggle to force refresh
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-0 w-full">
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl"
      >
        <div className="flex flex-col gap-2">
          <Text
            text="Colaboradores"
            header="h1"
            styles="text-digibrown3240-bold"
          />
          <Text
            text="Gerencie os colaboradores da sua empresa, adicione novos e visualize informações detalhadas."
            styles="text-digiblack1624-normal"
          />
        </div>
        <Row>
          {/* Search Bar */}
          <FormInput
            query={searchQuery}
            setQuery={(e) => setSearchQuery(e ? String(e) : '')}
            placeholder="Pesquisar colaboradores..."
            clearable
            inputType="text"
          />
          {/* Filters button */}
          <SecondaryButton
            id="employee-filters-button"
            text={filtersOpen ? 'Fechar filtros' : 'Abrir filtros'}
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            extraStyles="flex flex-none"
          />
        </Row>

        {filtersOpen && (
          <Row>
            <FormInput
              placeholder="Cargo"
              query={jobTitleFilter}
              setQuery={(e) => setJobTitleFilter(e ? String(e) : '')}
              label="Cargo"
              clearable
            />
            <FormDropdown
              label="Estado de Colaboração"
              choices={EMPLOYEE_STATUS}
              setSelectedValue={(value) => setStatusFilter(value as string)}
              selectedValue={statusFilter}
              placeholder="Selecione o estado"
            />
            <FormCheckbox
              label="Disponibilidade"
              options={AVAILABILITY_STATUS}
              selectedValues={availabilityFilter}
              setSelectedValues={(values) =>
                setAvailabilityFilter(values.map(String))
              }
            />

            <ClearAllFiltersButton
              onClick={handleClearFilters}
              id="clear-employee-filters"
              disabled={
                !searchQuery &&
                !jobTitleFilter &&
                availabilityFilter.length === 0 &&
                !statusFilter
              }
            />
          </Row>
        )}
      </ContainerCard>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl"
      >
        {/* Table */}
        {loading && activePage === 1 ? (
          <div className="flex justify-center items-center p-4 h-full ">
            <Spinner />
          </div>
        ) : error ? (
          <Text
            text={`Erro: ${error}`}
            styles="text-red-500 text-center"
          />
        ) : count === 0 ? (
          <Text
            text="Nenhum colaborador encontrado"
            styles="text-digiblack1624-semibold text-center"
          />
        ) : (
          <div className="flex flex-col gap-4 w-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <Text
                text={
                  <span>
                    Total de Colaboradores: <strong>{count}</strong>
                  </span>
                }
                styles="text-digiblack2025-normal"
              />
              <AddButton
                id="add-employee-button"
                tooltipText="Adicionar um novo colaborador"
                onClick={() => {
                  setTabActive('employees')
                  router.push('/employee/add')
                }}
                size="w-10 h-10 xl:w-12 xl:h-12"
              />
            </div>
            {loading && activePage > 1 && <OverlaySpinner />}
            <ScrollArea
              h={600}
              onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
              <Table
                striped
                withTableBorder
                highlightOnHoverColor="bg-digiorange/10"
                verticalSpacing="sm"
              >
                <Table.Thead className="sticky bg-digiblue">
                  <Table.Tr>
                    <Table.Th className="text-digiwhite1624-bold">
                      Foto
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Nome
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Estado
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Cargo
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Disponibilidade
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Tipo de Colaboração
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Performance
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Ações
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {employees.map((employee) => (
                    <Table.Tr
                      onClick={() =>
                        router.push(`/employee/details?id=${employee.id}`)
                      }
                      key={employee.id}
                      className="hover:cursor-pointer hover:!bg-digiblue-hover-options"
                    >
                      <Table.Td>
                        <div className="flex flex-none h-10 w-10 items-start relative">
                          <Image
                            src={employee.photoUrl || '/icons/user-man.svg'}
                            alt="Employee Profile"
                            style={{ objectFit: 'contain' }}
                            fill
                            priority
                          />
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={employee.user.fullName}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={employee.user?.isActive ? 'Ativo' : 'Inativo'}
                          styles={classNames(
                            'text-digiblack1624-normal',
                            employee.user?.isActive
                              ? '!text-digigreen'
                              : '!text-digired'
                          )}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={employee.jobTitles[0]?.name || 'N/A'}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={translateEmployeeAvailabilityStatus(
                            employee.availabilityStatus
                          )}
                          styles={classNames(
                            'text-digiblack1624-normal',
                            employee.availabilityStatus === 'Available'
                              ? 'text-digigreen'
                              : employee.availabilityStatus === 'Unavailable'
                                ? 'text-digired'
                                : null
                          )}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={translateEmployeeStatus(employee.status)}
                          styles="text-digiblack1624-semibold"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={employee.performanceRating?.toString() || 'N/A'}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className="flex gap-4 justify-start items-center">
                          <EditButton
                            id={`edit-${employee.id}`}
                            onClick={() => {
                              router.push(`/employee/edit?id=${employee.id}`)
                            }}
                            tooltipText="Editar Colaborador"
                            hasTooltip
                          />
                          <DeleteButton
                            id={`delete-${employee.id}`}
                            onClick={() => {
                              setAreYouSureToDeleteOpen(true)
                              setSelectedEmployee(employee)
                            }}
                            tooltipText="Remover Colaborador"
                            hasTooltip
                          />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
            <div className="flex justify-between items-center">
              <Text
                text={`De ${(activePage - 1) * 10 + 1} até ${Math.min(
                  activePage * 10,
                  count
                )} de ${count} colaboradores`}
                styles="text-digiblack1212-semibold"
              />
              {/* Pagination */}
              <Pagination
                total={Math.ceil(count / 10)} // Assuming 10 items per page
                value={activePage}
                onChange={setActivePage}
                radius="xl"
                color="#478ac9"
                className="flex justify-center xl:justify-end"
              />
            </div>
          </div>
        )}
      </ContainerCard>
      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Colaborador"
          message={`Tem a certeza que deseja remover o colaborador selecionado (${selectedEmployee?.user?.fullName})?`}
          onConfirm={() => {
            if (selectedEmployee?.id && accessToken) {
              handleDelete(selectedEmployee.id, accessToken)
            }
          }}
          onClose={() => {
            setAreYouSureToDeleteOpen(false)
            setSelectedEmployee(null)
          }}
          primaryBtnText="Remover"
        />
      )}
    </div>
  )
}

export default EmployeesSection
