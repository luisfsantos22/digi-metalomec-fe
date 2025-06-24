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
import { useState } from 'react'
import AddButton from '../Button/AddButton'
import { EXTERNAL_SERVICE_TABLE_LIST } from '@/app/constants'
import TableRow from '../Table/TableRow'
import Price from '../Text/Price'
import DeleteButton from '../Button/DeleteButton'
import ExternalServiceRepairModal from '../Modal/ExternalServiceRepairModal'

type ExternalServicesRepairFormScreenProps = {
  formData: WorkshopFormData
  setValue: UseFormSetValue<WorkshopFormData>
  setAreYouSureModalOpen: (open: boolean) => void
  setSelectedExternalService: (
    material: WorkshopFormData['externalServices'][number] | undefined
  ) => void
  seletectedExternalService?:
    | WorkshopFormData['externalServices'][number]
    | undefined
}

const ExternalServicesRepairFormScreen = (
  props: ExternalServicesRepairFormScreenProps
) => {
  const {
    formData,
    setValue,
    setAreYouSureModalOpen,
    setSelectedExternalService,
    seletectedExternalService,
  } = props
  const { externalServices } = formData

  const [showExternalServiceModal, setShowExternalServiceModal] =
    useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit'>('add')

  const handleDiferentialValue = (salePrice: number, buyPrice: number) => {
    return (salePrice - buyPrice).toFixed(2)
  }

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl lg:max-h-[40rem] max-h-[30rem] overflow-y-auto"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <Text
            text="Serviços Externos Ordenados para a Reparação"
            styles="text-digiblack2025-semibold"
          />
          <AddButton
            id="add-service-btn"
            onClick={() => {
              setAction('add')
              setShowExternalServiceModal(true)
            }}
            tooltipText={'Criar novo serviço externo'}
            size="lg:w-12 lg:h-12 h-10 w-10"
            width={'300'}
            position="top"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {externalServices?.length > 0 && (
            <Table
              striped
              withTableBorder
              highlightOnHoverColor="bg-digiorange/10"
              className="w-full"
            >
              <Table.Thead className="bg-digiorange">
                <Table.Tr>
                  {EXTERNAL_SERVICE_TABLE_LIST.map((text) => (
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
                {externalServices?.map((externalService, index) => (
                  <Table.Tr
                    key={index}
                    onClick={() => {
                      setSelectedExternalService(externalService)
                      setShowExternalServiceModal(true)
                      setAction('edit')
                    }}
                    className={classNames(
                      index % 2 === 0 ? 'bg-white' : 'bg-digiorange/10',
                      'cursor-pointer'
                    )}
                  >
                    <TableRow>
                      <Text
                        text={externalService.numInvoice || '---'}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={externalService.date || '---'}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Price
                        value={externalService.buyPrice || 0}
                        applyColorFormat
                      />
                    </TableRow>
                    <TableRow>
                      <Price
                        value={externalService.salePrice || 0}
                        applyColorFormat
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={
                          externalService.iva
                            ? `${externalService.iva}%`
                            : '---'
                        }
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={externalService.description || '---'}
                        styles="text-digibrown1624-normal line-clamp-1 max-w-[20rem]"
                      />
                    </TableRow>
                    <TableRow>
                      <Price
                        value={handleDiferentialValue(
                          externalService.salePrice || 0,
                          externalService.buyPrice || 0
                        )}
                        applyColorFormat
                      />
                    </TableRow>
                    <TableRow customStyles="!hover:bg-white/0 z-10">
                      <div className="flex justify-start items-center">
                        <DeleteButton
                          id={`delete-${externalService.uuid}`}
                          onClick={() => {
                            setAreYouSureModalOpen(true)
                            setSelectedExternalService(externalService)
                          }}
                          tooltipText="Remover Serviço Externo"
                          hasTooltip
                        />
                      </div>
                    </TableRow>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          <div className="flex  lg:flex-row flex-col gap-4 items-center p-2 rounded-xl justify-center w-full text-digibrown2025-bold bg-digiorange/20">
            <div className="flex items-center gap-2">
              <Text
                text="Total de Despesas:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={externalServices
                  .reduce((acc, externalService) => {
                    return acc + (externalService.buyPrice || 0)
                  }, 0)
                  .toFixed(2)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Text
                text="Total de Vendas:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={externalServices
                  .reduce((acc, externalService) => {
                    return acc + (externalService.salePrice || 0)
                  }, 0)
                  .toFixed(2)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Text
                text="Total de Lucro:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={externalServices
                  .reduce((acc, externalService) => {
                    return (
                      acc +
                      (externalService.salePrice || 0) -
                      (externalService.buyPrice || 0)
                    )
                  }, 0)
                  .toFixed(2)}
                applyColorFormat
              />
            </div>
          </div>
        </div>
      </ContainerCard>
      {showExternalServiceModal && (
        <ExternalServiceRepairModal
          isOpen={showExternalServiceModal}
          onClose={() => setShowExternalServiceModal(false)}
          onConfirm={() => {
            setShowExternalServiceModal(false)
            setSelectedExternalService(undefined)
          }}
          setValue={setValue}
          action={action}
          seletectedExternalService={seletectedExternalService}
          formData={formData}
          indexNumber={
            externalServices.findIndex(
              (externalService) =>
                externalService.uuid === seletectedExternalService?.uuid
            ) || -1
          }
        />
      )}
    </>
  )
}

export default ExternalServicesRepairFormScreen
