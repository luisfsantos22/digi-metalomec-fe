import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Text from '../Text/Text'
import { Table } from '@mantine/core'
import { REPAIR_SERVICE_TYPES, SERVICE_TABLE_LIST } from '@/app/constants'
import { useState } from 'react'
import AddButton from '../Button/AddButton'
import ServicesRepairModal from '../Modal/ServicesRepairModal'
import TableRow from '../Table/TableRow'
import DeleteButton from '../Button/DeleteButton'

type ServicesRepairFormScreenProps = {
  formData: WorkshopFormData
  setValue: UseFormSetValue<WorkshopFormData>
  setAreYouSureModalOpen: (open: boolean) => void
  setSelectedService: (
    service: WorkshopFormData['services'][number] | undefined
  ) => void
  selectedService?: WorkshopFormData['services'][number] | undefined
}

const ServicesRepairFormScreen = (props: ServicesRepairFormScreenProps) => {
  const {
    formData,
    setValue,
    setAreYouSureModalOpen,
    setSelectedService,
    selectedService,
  } = props
  const { services } = formData

  const [showServiceModal, setShowServiceModal] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit'>('add')

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl lg:max-h-[40rem] max-h-[32rem] overflow-y-auto"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <Text
            text="Serviços Ordenados para a Reparação"
            styles="text-digiblack2025-semibold"
          />
          <AddButton
            id="add-service-btn"
            onClick={() => {
              setAction('add')
              setShowServiceModal(true)
            }}
            tooltipText={'Criar novo serviço'}
            size="lg:w-12 lg:h-12 h-10 w-10"
            width={'300'}
            position="top"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {services.length > 0 && (
            <Table
              striped
              withTableBorder
              highlightOnHoverColor="bg-digigold-hover/10"
              className="w-full"
            >
              <Table.Thead className="bg-digigold">
                <Table.Tr>
                  {SERVICE_TABLE_LIST.map((text) => (
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
                {services.map((service, index) => (
                  <Table.Tr
                    key={index}
                    onClick={() => {
                      setAction('edit')
                      setSelectedService(service)
                      setShowServiceModal(true)
                    }}
                    className="hover:cursor-pointer hover:!bg-digigold-hover/20"
                  >
                    <TableRow>
                      <Text
                        text={
                          REPAIR_SERVICE_TYPES.find(
                            (type) => type.value === service.typeService
                          )?.label || '---'
                        }
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={service.date || '---'}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={service.description || '---'}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow customStyles="!hover:bg-white/0 z-10">
                      <div className="flex justify-start items-center">
                        <DeleteButton
                          id={`delete-${service.uuid}`}
                          onClick={() => {
                            setAreYouSureModalOpen(true)
                            setSelectedService(service)
                          }}
                          tooltipText="Remover Serviço"
                          hasTooltip
                        />
                      </div>
                    </TableRow>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
      </ContainerCard>
      {showServiceModal && (
        <ServicesRepairModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onConfirm={() => {
            setShowServiceModal(false)
            setSelectedService(undefined)
          }}
          setValue={setValue}
          action={action}
          selectedService={selectedService}
          formData={formData}
          indexNumber={
            services.findIndex(
              (service) => service.uuid === selectedService?.uuid
            ) || -1
          }
        />
      )}
    </>
  )
}

export default ServicesRepairFormScreen
