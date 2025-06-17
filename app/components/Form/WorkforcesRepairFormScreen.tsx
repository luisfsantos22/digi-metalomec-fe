import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Text from '../Text/Text'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import PrimaryButton from '../Button/PrimaryButton'
import { Divider, Table } from '@mantine/core'
import { classNames, generateUuid } from '@/utils'
import Image from 'next/image'
import GenericTooltip from '../Tooltip/GenericTooltip'
import { SimpleUser } from '@/app/types/user/user'
import FormDropdown from '../Dropdown/FormDropdown'
import { WORKFORCE_TABLE_LIST } from '@/app/constants'
import TableRow from '../Table/TableRow'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import Price from '../Text/Price'
import AddButton from '../Button/AddButton'
import WorkforceModal from '../Modal/WorkforceModal'
import { WorkshopWorkforceObj } from '@/app/types/workshop/workshop-workforces'
import EditButton from '../Button/EditButton'
import DeleteButton from '../Button/DeleteButton'

type WorkforcesRepairFormScreenProps = {
  formData: WorkshopFormData
  setValue: UseFormSetValue<WorkshopFormData>
  setAreYouSureModalOpen: (open: boolean) => void
  setSelectedWorkforce: (
    workforce: WorkshopFormData['workforces'][number] | undefined
  ) => void
  workers: SimpleUser[]
  selectedWorkforce: WorkshopWorkforceObj | undefined
}

const WorkforcesRepairFormScreen = (props: WorkforcesRepairFormScreenProps) => {
  const {
    formData,
    setValue,
    setAreYouSureModalOpen,
    setSelectedWorkforce,
    workers,
    selectedWorkforce,
  } = props
  const { workforces } = formData

  const [showWorkforceModal, setShowWorkforceModal] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit'>('add')

  const handleTotalPrice = (hourPrice?: number, numHours?: number) => {
    if (hourPrice && numHours) {
      return (hourPrice * numHours).toFixed(2)
    }

    return '0.00'
  }

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl max-h-[40rem] overflow-y-auto"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <Text
            text="Mão d'Obra da Reparação"
            styles="text-digiblack2025-semibold"
          />
          <AddButton
            id="add-workforce-btn"
            onClick={() => {
              setAction('add')
              setShowWorkforceModal(true)
            }}
            tooltipText={'Criar nova mão de obra'}
            size="lg:w-12 lg:h-12 h-10 w-10"
            width={'300'}
            position="top"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {workforces?.length > 0 && (
            <Table
              striped
              withTableBorder
              highlightOnHoverColor="bg-digigold-hover/10"
              className="w-full"
            >
              <Table.Thead className="bg-digigold">
                <Table.Tr>
                  {WORKFORCE_TABLE_LIST.map((text) => (
                    <Table.Th
                      className="text-digibrown1624-bold"
                      key={text}
                    >
                      {text}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {workforces.map((workforce, index) => (
                  <Table.Tr
                    key={index}
                    onClick={() => {
                      setAction('edit')
                      setSelectedWorkforce(workforce)
                      setShowWorkforceModal(true)
                    }}
                    className="hover:cursor-pointer hover:!bg-digigold-hover/20"
                  >
                    <TableRow>
                      <Text
                        text={
                          workers?.find(
                            (worker) => worker.uuid === workforce.workerUuid
                          )?.username || 'Desconhecido'
                        }
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={workforce.date}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={workforce.numHours?.toString() || ''}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Price value={workforce.hourPrice?.toString() || ''} />
                    </TableRow>
                    <TableRow>
                      <Price
                        value={handleTotalPrice(
                          workforce.hourPrice,
                          workforce.numHours
                        )}
                      />
                    </TableRow>
                    <TableRow customStyles="!hover:bg-white/0 z-10">
                      <div className="flex justify-start items-center">
                        <DeleteButton
                          id={`delete-${workforce.uuid}`}
                          onClick={() => {
                            setAreYouSureModalOpen(true)
                            setSelectedWorkforce(workforce)
                          }}
                          tooltipText="Remover Mão de Obra"
                          hasTooltip
                        />
                      </div>
                    </TableRow>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          <div className="flex gap-2 items-center p-2 rounded-xl justify-center w-full text-digibrown2025-bold bg-digigold/20">
            <Text
              text="Valor Total Gasto em Mão de Obra:"
              styles="text-digibrown2025-semibold"
            />
            <Price
              value={workforces
                .reduce(
                  (total, workforce) =>
                    total +
                    (workforce.hourPrice || 0) * (workforce.numHours || 0),
                  0
                )
                .toFixed(2)}
            />
          </div>
        </div>
      </ContainerCard>
      {showWorkforceModal && (
        <WorkforceModal
          isOpen={showWorkforceModal}
          onClose={() => setShowWorkforceModal(false)}
          onConfirm={() => {
            setShowWorkforceModal(false)
            setSelectedWorkforce(undefined)
          }}
          setValue={setValue}
          workers={workers}
          action={action}
          seletectedWorkforce={selectedWorkforce}
          formData={formData}
          indexNumber={
            workforces.findIndex(
              (workforce) => workforce.uuid === selectedWorkforce?.uuid
            ) || -1
          }
        />
      )}
    </>
  )
}

export default WorkforcesRepairFormScreen
