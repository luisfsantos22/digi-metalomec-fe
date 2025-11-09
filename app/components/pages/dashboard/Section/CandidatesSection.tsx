import { Pagination, ScrollArea, Table } from '@mantine/core'
import { useState } from 'react'
import ContainerCard from '../../../Card/ContainerCard'
import Row from '../../../Row/Row'
import FormInput from '../../../Input/FormInput'
import ClearAllFiltersButton from '../../../Button/ClearAllFiltersButton'
import Text from '../../../Text/Text'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import { formatDate, translateEmployeeAvailabilityStatus } from '@/app/utils'
import Spinner from '@/app/components/Spinner/Spinner'
import { OverlaySpinner } from '@/app/components/Spinner/OverlaySpinner'
import EditButton from '@/app/components/Button/EditButton'
import DeleteButton from '@/app/components/Button/DeleteButton'
import { useRouter } from 'next/navigation'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import { useSession } from 'next-auth/react'
import { useDeleteEmployee } from '@/app/hooks/employees/useDeleteEmployee'
import { classNames } from 'utils'
import AddButton from '@/app/components/Button/AddButton'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import useCompanyCandidatesQuery from '@/app/hooks/candidates/useCompanyCandidatesQuery'
const IntlTelInput = dynamic(() => import('intl-tel-input/reactWithUtils'), {
  ssr: false,
})
import 'intl-tel-input/styles'
import dynamic from 'next/dynamic'
import { GenericCandidate } from '@/app/types/candidate/candidate'
import GenericTooltip from '@/app/components/Tooltip/GenericTooltip'
import LocationRadiusSearch from '@/app/components/Input/LocationRadiusSearch'
import LocationSearchBadge from '@/app/components/Badge/LocationSearchBadge'

const CandidatesSection = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  // States for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [jobTitleFilter, setJobTitleFilter] = useState<string | undefined>(
    undefined
  )
  const [phoneFilter, setPhoneFilter] = useState('')

  // Location-based search states
  const [useLocationSearch, setUseLocationSearch] = useState(false)
  const [locationPlace, setLocationPlace] = useState('')
  const [locationRadius, setLocationRadius] = useState<number | null>(null)

  // State for modal and selected employee
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [scrolled, setScrolled] = useState(false)

  // Store page state per search mode to preserve pagination when switching
  const [normalSearchPage, setNormalSearchPage] = useState(1)
  const [locationSearchPage, setLocationSearchPage] = useState(1)

  // Store filters per search mode
  const [normalSearchFilters, setNormalSearchFilters] = useState({
    searchQuery: '',
    jobTitleFilter: undefined as string | undefined,
    phoneFilter: '',
  })
  const [locationSearchFilters, setLocationSearchFilters] = useState({
    locationPlace: '',
    locationRadius: null as number | null,
  })

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] =
    useState<boolean>(false)
  const [selectedCandidate, setSelectedCandidate] =
    useState<GenericCandidate | null>(null)
  // State to force refresh
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [searchLocationQuery, setSearchLocationQuery] = useState('')

  // Single useQuery for both regular and location-based search
  const { candidates, loading, error, count } = useCompanyCandidatesQuery(
    activePage,
    searchQuery,
    jobTitleFilter,
    phoneFilter,
    refreshFlag,
    locationPlace,
    locationRadius
  )

  // Employee deletion function
  const { deleteEmployee } = useDeleteEmployee()

  // Handle page change - updates both active page and mode-specific page
  const handlePageChange = (page: number) => {
    setActivePage(page)
    if (useLocationSearch) {
      setLocationSearchPage(page)
    } else {
      setNormalSearchPage(page)
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    if (useLocationSearch) {
      setLocationPlace('')
      setLocationRadius(null)
      setLocationSearchPage(1)
      setActivePage(1)
      setSearchLocationQuery('')
      setLocationSearchFilters({
        locationPlace: '',
        locationRadius: null,
      })
    } else {
      setJobTitleFilter('')
      setSearchQuery('')
      setPhoneFilter('')
      setNormalSearchPage(1)
      setActivePage(1)
      setNormalSearchFilters({
        searchQuery: '',
        jobTitleFilter: undefined,
        phoneFilter: '',
      })
    }
  }

  // Toggle search mode - preserves state per mode
  const handleToggleSearchMode = () => {
    if (useLocationSearch) {
      // Switching from location to normal search
      // Save current location search state
      setLocationSearchPage(activePage)
      setLocationSearchFilters({
        locationPlace,
        locationRadius,
      })

      // Restore normal search state
      setSearchQuery(normalSearchFilters.searchQuery)
      setJobTitleFilter(normalSearchFilters.jobTitleFilter)
      setPhoneFilter(normalSearchFilters.phoneFilter)
      setActivePage(normalSearchPage)
    } else {
      // Switching from normal to location search
      // Save current normal search state
      setNormalSearchPage(activePage)
      setNormalSearchFilters({
        searchQuery,
        jobTitleFilter,
        phoneFilter,
      })

      // Restore location search state
      setLocationPlace(locationSearchFilters.locationPlace)
      setLocationRadius(locationSearchFilters.locationRadius)
      setActivePage(locationSearchPage)
    }

    setUseLocationSearch(!useLocationSearch)
  }

  const handleDelete = async (id: string, token: string) => {
    await deleteEmployee(id, token)
    setAreYouSureToDeleteOpen(false)
    setSelectedCandidate(null)
    setRefreshFlag((prev) => !prev) // toggle to force refresh
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-0 w-full">
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Text
              text="Candidatos"
              header="h1"
              styles="text-digibrown3240-bold"
            />
          </div>
          <Text
            text="Gerencie os candidatos da sua empresa, adicione novos e visualize informações detalhadas."
            styles="text-digiblack1624-normal"
          />
          {useLocationSearch && locationPlace && locationRadius && (
            <LocationSearchBadge
              locationPlace={locationPlace}
              locationRadius={locationRadius}
            />
          )}
        </div>
        <Row>
          <div className="flex xl:flex-row flex-col xl:justify-between gap-2 w-full">
            {/* Search Mode Toggle */}
            <SecondaryButton
              id="toggle-search-mode-button"
              text={
                useLocationSearch
                  ? 'Pesquisa Normal'
                  : 'Pesquisa por Localização'
              }
              type="button"
              onClick={handleToggleSearchMode}
              extraStyles="flex flex-none"
            />
            {/* Filters button */}
            {!useLocationSearch && (
              <SecondaryButton
                id="candidate-filters-button"
                text={filtersOpen ? 'Fechar filtros' : 'Abrir filtros'}
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                extraStyles="flex flex-none"
              />
            )}
            {useLocationSearch && (
              <ClearAllFiltersButton
                onClick={handleClearFilters}
                id="clear-location-filters"
                label="Limpar Filtros"
                width="w-auto"
              />
            )}
          </div>
        </Row>

        <Row>
          {useLocationSearch ? (
            /* Location-based Search */
            <LocationRadiusSearch
              place={locationPlace}
              setPlace={setLocationPlace}
              radius={locationRadius}
              setRadius={setLocationRadius}
              helperText="Pesquise candidatos próximos a uma localização específica. Ex: Matosinhos com raio de 20km"
              searchQuery={searchLocationQuery}
              setSearchQuery={setSearchLocationQuery}
            />
          ) : (
            /* Regular Search Bar */
            <FormInput
              query={searchQuery}
              setQuery={(e) => setSearchQuery(e ? String(e) : '')}
              placeholder="Pesquisar candidatos..."
              clearable
              inputType="text"
            />
          )}
        </Row>

        {filtersOpen && !useLocationSearch && (
          <Row>
            <FormInput
              placeholder="Cargo"
              query={jobTitleFilter}
              setQuery={(e) => setJobTitleFilter(e ? String(e) : '')}
              label="Cargo"
              clearable
            />
            <FormInput
              label="Telemóvel"
              query={phoneFilter}
              setQuery={(e) => setPhoneFilter(e ? String(e) : '')}
              placeholder="Pesquisar telemóvel..."
              clearable
            />

            <ClearAllFiltersButton
              onClick={handleClearFilters}
              id="clear-candidate-filters"
              disabled={
                !searchQuery && !jobTitleFilter && phoneFilter.length === 0
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
          <div className="flex flex-col gap-4 items-center justify-center">
            <Text
              text="Nenhum candidato encontrado"
              styles="text-digiblack1624-semibold text-center"
            />
            <AddButton
              id="add-candidate-button"
              tooltipText="Adicionar um novo candidato"
              onClick={() => {
                setTabActive('candidates')
                router.push('/candidate/add')
              }}
              size="w-20 h-20 lg:w-30 lg:h-30"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full overflow-y-auto">
            <div className="flex justify-between items-center">
              <Text
                text={
                  <span>
                    Total de Candidatos: <strong>{count}</strong>
                  </span>
                }
                styles="text-digiblack2025-normal"
              />
              <AddButton
                id="add-candidate-button"
                tooltipText="Adicionar um novo candidato"
                onClick={() => {
                  setTabActive('candidates')
                  router.push('/candidate/add')
                }}
                size="w-10 h-10 lg:w-12 lg:h-12"
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
                      Identificador
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Nome
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Cargo
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Última Alteração
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Disponibilidade
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Nº de Telemóvel
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Disp. Geográfica
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Última Iteração
                    </Table.Th>
                    <Table.Th className="text-digiwhite1624-bold">
                      Ações
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {candidates.map((candidate) => (
                    <Table.Tr
                      onClick={() =>
                        router.push(`/candidate/details/${candidate.id}/`)
                      }
                      key={candidate.id}
                      className="hover:cursor-pointer hover:!bg-digiblue-hover-options"
                    >
                      <Table.Td>
                        <Text
                          text={
                            candidate.internalIdentifier as unknown as string
                          }
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={candidate.user.fullName}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={candidate.jobTitles[0]?.name || 'N/A'}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={formatDate(candidate.updatedAt)}
                          styles="text-digiblack1624-normal"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={translateEmployeeAvailabilityStatus(
                            candidate.availabilityStatus
                          )}
                          styles={classNames(
                            'text-digiblack1624-normal',
                            candidate.availabilityStatus === 'Available'
                              ? '!text-digigreen'
                              : candidate.availabilityStatus === 'Unavailable'
                                ? '!text-digired'
                                : '!text-gray-400'
                          )}
                        />
                      </Table.Td>
                      <Table.Td>
                        <IntlTelInput
                          initialValue={candidate.user.phoneNumber || ''}
                          inputProps={{
                            placeholder: 'Por Preencher...',
                            className:
                              'text-digiblack1624-normal w-40 !pr-0 hover:cursor-pointer',
                          }}
                          initOptions={{
                            allowDropdown: false,
                            separateDialCode: true,
                          }}
                          disabled
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          text={
                            candidate.geographicLocation?.addressFull || 'N/A'
                          }
                          styles={
                            classNames(
                              'text-digiblack1624-normal',
                              !candidate.geographicLocation?.addressFull &&
                                'text-digired'
                            ) as string
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text
                          styles="text-digiblack1624-normal max-w-[200px] line-clamp-1"
                          text={candidate.lastIteraction || 'N/A'}
                          id={`last-interaction-${candidate.id}`}
                        />
                        <GenericTooltip
                          text={candidate.lastIteraction || undefined}
                          anchorSelect={`last-interaction-${candidate.id}`}
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className="flex gap-4 justify-start items-center">
                          <EditButton
                            id={`edit-${candidate.id}`}
                            onClick={() => {
                              router.push(`/candidate/edit?id=${candidate.id}`)
                            }}
                            tooltipText="Editar Candidato"
                            hasTooltip
                          />
                          <DeleteButton
                            id={`delete-${candidate.id}`}
                            onClick={() => {
                              setAreYouSureToDeleteOpen(true)
                              setSelectedCandidate(candidate)
                            }}
                            tooltipText="Remover Candidato"
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
                )} de ${count} candidatos`}
                styles="text-digiblack1212-semibold"
              />
              {/* Pagination */}
              <Pagination
                total={Math.ceil(count / 10)} // Assuming 10 items per page
                value={activePage}
                onChange={handlePageChange}
                radius="xl"
                color="#478ac9"
                className="flex justify-center lg:justify-end"
              />
            </div>
          </div>
        )}
      </ContainerCard>
      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Candidato"
          message={`Tem a certeza que deseja remover o candidato selecionado (${selectedCandidate?.user?.fullName})?`}
          onConfirm={() => {
            if (selectedCandidate?.id && accessToken) {
              handleDelete(selectedCandidate.id, accessToken)
            }
          }}
          onClose={() => {
            setAreYouSureToDeleteOpen(false)
            setSelectedCandidate(null)
          }}
          primaryBtnText="Remover"
        />
      )}
    </div>
  )
}

export default CandidatesSection
