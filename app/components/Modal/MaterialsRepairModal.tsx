import { Modal } from '@mantine/core'
import React from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from '@/utils'
import Row from '../Row/Row'
import { UseFormSetValue } from 'react-hook-form'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import FormInput from '../Input/FormInput'
import { WorkshopMaterialObj } from '@/app/types/workshop/workshop-materials'

type MaterialRepairModallProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<WorkshopFormData>
  selectedMaterial: WorkshopMaterialObj | undefined
  formData?: WorkshopFormData
  indexNumber?: number
}

const MaterialRepairModal = (props: MaterialRepairModallProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    selectedMaterial,
    indexNumber = -1,
  } = props

  const [tempWorkshopMaterial, setTempWorkshopMaterial] =
    React.useState<WorkshopMaterialObj>(
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
            uuid: selectedMaterial?.uuid || generateUuid(),
            date: selectedMaterial?.date || '',
            numInvoice: selectedMaterial?.numInvoice || '',
            buyPrice: selectedMaterial?.buyPrice || 0,
            salePrice: selectedMaterial?.salePrice || 0,
            iva: selectedMaterial?.iva || 0,
            repairUuid: selectedMaterial?.repairUuid || '',
            description: selectedMaterial?.description || '',
          }
    )

  const createWorkforce = () => {
    if (action === 'add') {
      setValue('materials', [
        ...(props.formData?.materials || []),
        tempWorkshopMaterial,
      ])
    } else {
      setValue(`materials.${indexNumber}`, {
        ...selectedMaterial,
        date: tempWorkshopMaterial.date,
        numInvoice: tempWorkshopMaterial.numInvoice,
        buyPrice: tempWorkshopMaterial.buyPrice,
        salePrice: tempWorkshopMaterial.salePrice,
        iva: tempWorkshopMaterial.iva,
        repairUuid: tempWorkshopMaterial.repairUuid,
        description: tempWorkshopMaterial.description,
        uuid: selectedMaterial?.uuid || generateUuid(),
      })
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Material' : 'Editar Material'}
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
            query={tempWorkshopMaterial.numInvoice || ''}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            query={tempWorkshopMaterial.date || ''}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            query={tempWorkshopMaterial.buyPrice || undefined}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            query={tempWorkshopMaterial.salePrice || undefined}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            query={tempWorkshopMaterial.iva || undefined}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            query={tempWorkshopMaterial.description || ''}
            setQuery={(value) =>
              setTempWorkshopMaterial((prev) => ({
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
            onClick={createWorkforce}
            disabled={
              !(
                tempWorkshopMaterial.numInvoice &&
                tempWorkshopMaterial.date &&
                tempWorkshopMaterial.buyPrice !== undefined &&
                tempWorkshopMaterial.buyPrice >= 0 &&
                tempWorkshopMaterial.salePrice !== undefined &&
                tempWorkshopMaterial.salePrice >= 0 &&
                tempWorkshopMaterial.iva !== undefined &&
                tempWorkshopMaterial.iva >= 0
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

export default MaterialRepairModal
