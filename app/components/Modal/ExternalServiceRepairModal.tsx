import { Modal } from '@mantine/core'
import React from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from '@/utils'
import Row from '../Row/Row'
import { UseFormSetValue } from 'react-hook-form'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import FormInput from '../Input/FormInput'
import { WorkshopExternalServiceObj } from '@/app/types/workshop/workshop-external-services'

type ExternalServiceRepairModallProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<WorkshopFormData>
  seletectedExternalService: WorkshopExternalServiceObj | undefined
  formData?: WorkshopFormData
  indexNumber?: number
}

const ExternalServiceRepairModal = (
  props: ExternalServiceRepairModallProps
) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    seletectedExternalService,
    indexNumber = -1,
  } = props

  const [tempWorkshopExternalService, setTempWorkshopExternalService] =
    React.useState<WorkshopExternalServiceObj>(
      action === 'add'
        ? {
            uuid: generateUuid(),
            date: '',
            numInvoice: '',
            buyPrice: 0,
            salePrice: 0,
            iva: 0,
            repairUuid: '',
            description: '',
          }
        : {
            uuid: seletectedExternalService?.uuid || generateUuid(),
            date: seletectedExternalService?.date || '',
            numInvoice: seletectedExternalService?.numInvoice || '',
            buyPrice: seletectedExternalService?.buyPrice || 0,
            salePrice: seletectedExternalService?.salePrice || 0,
            iva: seletectedExternalService?.iva || 0,
            repairUuid: seletectedExternalService?.repairUuid || '',
            description: seletectedExternalService?.description || '',
          }
    )

  const createExternalService = () => {
    if (action === 'add') {
      setValue('externalServices', [
        ...(props.formData?.externalServices || []),
        tempWorkshopExternalService,
      ])
    } else {
      setValue(`materials.${indexNumber}`, {
        ...seletectedExternalService,
        date: tempWorkshopExternalService.date,
        numInvoice: tempWorkshopExternalService.numInvoice,
        buyPrice: tempWorkshopExternalService.buyPrice,
        salePrice: tempWorkshopExternalService.salePrice,
        iva: tempWorkshopExternalService.iva,
        repairUuid: tempWorkshopExternalService.repairUuid,
        description: tempWorkshopExternalService.description,
        uuid: seletectedExternalService?.uuid || generateUuid(),
      })
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        action === 'add'
          ? 'Adicionar Serviço Externo'
          : 'Editar Serviço Externo'
      }
      centered
      transitionProps={{ transition: 'fade', duration: 400 }}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
        },
      }}
      size={'xl'}
    >
      <div className="flex flex-col gap-4">
        <Row>
          <FormInput
            label="Nº de Fatura"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Nº de Fatura"
            mandatory
            query={tempWorkshopExternalService.numInvoice || ''}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                numInvoice: value,
              }))
            }
            inputType="text"
            width="lg:w-1/2 w-full"
          />
          <FormInput
            label="Data"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory
            placeholder="Data"
            inputType="date"
            query={tempWorkshopExternalService.date || ''}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                date: value,
              }))
            }
            width="lg:w-1/2 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Preço de Compra"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Preço de Compra"
            mandatory
            inputType="number"
            query={tempWorkshopExternalService.buyPrice || undefined}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                buyPrice: parseFloat(value),
              }))
            }
            width="lg:w-1/3 w-full"
          />
          <FormInput
            label="Preço de Venda"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Preço de Venda"
            mandatory
            inputType="number"
            query={tempWorkshopExternalService.salePrice || undefined}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                salePrice: parseFloat(value),
              }))
            }
            width="lg:w-1/3 w-full"
          />
          <FormInput
            label="IVA"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="IVA"
            mandatory
            inputType="number"
            query={tempWorkshopExternalService.iva || undefined}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                iva: parseFloat(value),
              }))
            }
            width="lg:w-1/3 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Descrição"
            labelStyles="text-digiblack1420-semibold"
            placeholder="Descrição"
            query={tempWorkshopExternalService.description || ''}
            setQuery={(value) =>
              setTempWorkshopExternalService((prev) => ({
                ...prev,
                description: value,
              }))
            }
            width="w-full"
          />
        </Row>
        <div className="flex justify-end gap-4">
          <SecondaryButton
            text="Cancelar"
            id="cancel-btn"
            onClick={onClose}
          />
          <PrimaryButton
            type="button"
            text={action === 'add' ? 'Adicionar' : 'Editar'}
            id="primary-btn"
            onClick={createExternalService}
            disabled={
              !(
                tempWorkshopExternalService.numInvoice &&
                tempWorkshopExternalService.date &&
                tempWorkshopExternalService.buyPrice !== undefined &&
                tempWorkshopExternalService.buyPrice >= 0 &&
                tempWorkshopExternalService.salePrice !== undefined &&
                tempWorkshopExternalService.salePrice >= 0 &&
                tempWorkshopExternalService.iva !== undefined &&
                tempWorkshopExternalService.iva >= 0
              )
            }
            extraStyles="!bg-digiorange hover:!bg-digiorange"
            textDisabled="Preencher todos os campos"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ExternalServiceRepairModal
