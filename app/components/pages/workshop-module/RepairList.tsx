'use client'

import { useDeleteRepair } from '@/app/hooks/workshop/useDeleteRepair'
import { useRepairsWorkshop } from '@/app/hooks/workshop/useRepairsWorkshop'
import { WorkshopFilters, WorkshopObj } from '@/app/types/workshop/workshop'
import {
  classNames,
  isDesktopSize,
  translateRepairStateValue,
  translateVehicleValue,
} from '@/utils'
import { useWindowSize } from '@/utils/hooks'
import { Alert, ScrollArea, Table } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddButton from '../../Button/AddButton'
import DeleteButton from '../../Button/DeleteButton'
import EditButton from '../../Button/EditButton'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import Spinner from '../../Spinner/Spinner'
import TableRow from '../../Table/TableRow'
import Text from '../../Text/Text'
import RepairFilters from './RepairFilters'

export default function RepairList() {
  const { data: session } = useSession()
  const screenSize = useWindowSize()
  const isDesktop = isDesktopSize(screenSize)
  const router = useRouter()
  const accessToken = session?.accessToken

  const [refreshKey, setRefreshKey] = useState(0)
  const [stateRepairOptions, setStateRepairOptions] = useState<
    Array<{ label: string; value: string }>
  >([])
  const [filters, setFilters] = useState<WorkshopFilters>({
    nOr: undefined,
    vehicleName: undefined,
    licensePlate: undefined,
    state: undefined,
  })

  const { workshopItems, loading, error } = useRepairsWorkshop(
    accessToken,
    refreshKey,
    filters
  )
  const { deleteRepair } = useDeleteRepair()

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] =
    useState<boolean>(false)
  const [selectedRepair, setSelectedRepair] = useState<WorkshopObj | null>(null)

  useEffect(() => {
    if (workshopItems && stateRepairOptions.length === 0) {
      const states = workshopItems.map((item) => item.state)
      const uniqueStates = Array.from(new Set(states))
      setStateRepairOptions(
        uniqueStates.map((state) => ({
          label: translateRepairStateValue(state),
          value: state,
        }))
      )
    }
  }, [workshopItems])

  if (error) {
    return (
      <div className="p-4">
        <Alert
          color="red"
          title="Error"
        >
          {error}
        </Alert>
      </div>
    )
  }

  //queries
  const handleDelete = async (uuid: string, token: string) => {
    await deleteRepair(uuid, token)
    setAreYouSureToDeleteOpen(false)
    setSelectedRepair(null)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mt-4">
        <RepairFilters
          stateRepairOptions={stateRepairOptions}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="flex justify-between items-center w-full">
        <Text
          text={`Lista de Reparações (${workshopItems?.length})`}
          header="h2"
          styles={classNames(
            isDesktop
              ? 'text-digiblack2832-semibold'
              : 'text-digiblack2025-semibold'
          )}
        />
        {workshopItems?.length > 0 && (
          <AddButton
            id="add-workshop-btn"
            onClick={() => {
              router.push('/workshop-module/repair/create')
            }}
            tooltipText={'Criar nova reparação'}
            size="lg:w-20 lg:h-20 h-10 w-10"
            widthTooltip={'300'}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : workshopItems?.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center p-4 h-full">
          <Text
            text="Nenhuma reparação encontrada."
            styles={classNames(
              isDesktop
                ? 'text-digired2025-semibold'
                : 'text-digired1624-semibold'
            )}
          />
          <AddButton
            id="add-workshop-btn"
            onClick={() => {
              router.push('/workshop-module/repair/create')
            }}
            tooltipText={'Criar nova reparação'}
            widthTooltip="300"
          />
        </div>
      ) : (
        <ScrollArea>
          <Table
            striped
            withTableBorder
            highlightOnHoverColor="bg-digiorange/10"
          >
            <Table.Thead className="bg-digiorange">
              <Table.Tr>
                {/* {WORKSHOP_TABLE_DASHBOARD_LIST.map((text) => (
                  <Table.Th
                    className="text-digibrown1624-bold"
                    key={text}
                  >
                    {text}
                  </Table.Th>
                ))} */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {workshopItems.map((item) => (
                <Table.Tr
                  key={item.uuid}
                  onClick={() =>
                    router.push(
                      `/workshop-module/repair/edit?uuid=${item.uuid}`
                    )
                  }
                  className="hover:cursor-pointer hover:!bg-digiorange/20"
                >
                  <TableRow>
                    <Text
                      text={item.nOr}
                      styles="text-digibrown1624-normal"
                    />
                  </TableRow>
                  <TableRow>
                    <Text
                      text={translateVehicleValue(item.vehicle, false)}
                      styles="text-digibrown1624-normal"
                    />
                  </TableRow>
                  <TableRow>
                    <Text
                      text={item.createdAt}
                      styles="text-digibrown1624-normal"
                    />
                  </TableRow>
                  <TableRow>
                    <Text
                      text={translateRepairStateValue(item.state)}
                      styles="text-digibrown1624-normal"
                    />
                  </TableRow>
                  <TableRow>
                    <Text
                      text={item.hasRequestedMaterial ? 'Sim' : 'Não'}
                      styles="text-digibrown1624-normal"
                    />
                  </TableRow>
                  <TableRow customStyles="!hover:bg-white/0 z-10">
                    <div className="flex gap-4 justify-start items-center">
                      <EditButton
                        id={`edit-${item.uuid}`}
                        onClick={() => {
                          router.push(
                            `/workshop-module/repair/edit?uuid=${item.uuid}`
                          )
                        }}
                        tooltipText="Editar Reparação"
                        hasTooltip
                      />
                      <DeleteButton
                        id={`delete-${item.uuid}`}
                        onClick={() => {
                          setAreYouSureToDeleteOpen(true)
                          setSelectedRepair(item)
                        }}
                        tooltipText="Remover Reparação"
                        hasTooltip
                      />
                    </div>
                  </TableRow>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Reparação"
          message={`Tem a certeza que deseja remover a reparação selecionada (${selectedRepair?.nOr})?`}
          onConfirm={() => {
            if (selectedRepair?.uuid && accessToken) {
              handleDelete(selectedRepair.uuid, accessToken)
            }
          }}
          onClose={() => {
            setAreYouSureToDeleteOpen(false)
            setSelectedRepair(null)
          }}
          primaryBtnText="Remover"
        />
      )}
    </div>
  )
}
