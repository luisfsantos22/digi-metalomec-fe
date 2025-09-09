import { Modal } from '@mantine/core'
import React from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from 'utils'
import Row from '../Row/Row'
import { UseFormSetValue } from 'react-hook-form'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import FormInput from '../Input/FormInput'
import { WorkshopServiceObj } from '@/app/types/workshop/workshop-services'
import FormDropdown from '../Dropdown/FormDropdown'
import { REPAIR_SERVICE_TYPES } from '@/app/constants'

type ServicesRepairModallProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<WorkshopFormData>
  selectedService: WorkshopServiceObj | undefined
  formData?: WorkshopFormData
  indexNumber?: number
}

const ServicesRepairModal = (props: ServicesRepairModallProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    selectedService,
    indexNumber = -1,
  } = props

  const [tempWorkshopService, setTempWorkshopService] =
    React.useState<WorkshopServiceObj>(
      action === 'add'
        ? {
            uuid: generateUuid(),
            date: '',
            description: '',
            repairUuid: '',
            typeService: '',
          }
        : {
            uuid: selectedService?.uuid || generateUuid(),
            date: selectedService?.date || '',
            description: selectedService?.description || '',
            repairUuid: selectedService?.repairUuid || '',
            typeService: selectedService?.typeService || '',
          }
    )

  const createService = () => {
    if (action === 'add') {
      setValue('services', [
        ...(props.formData?.services || []),
        tempWorkshopService,
      ])
    } else {
      setValue(`services.${indexNumber}`, {
        ...selectedService,
        date: tempWorkshopService.date,
        repairUuid: tempWorkshopService.repairUuid,
        description: tempWorkshopService.description,
        typeService: tempWorkshopService.typeService,
        uuid: selectedService?.uuid || generateUuid(),
      })
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Serviço' : 'Editar Serviço'}
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
          <FormDropdown
            choices={REPAIR_SERVICE_TYPES || []}
            placeholder="Tipo de Serviço"
            selectedValue={tempWorkshopService.typeService || ''}
            setSelectedValue={(value) => {
              setTempWorkshopService((prev) => ({
                ...prev,
                typeService: value,
              }))
            }}
            label="Tipo de Serviço"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory
            width="lg:w-1/2 w-full"
          />
          <FormInput
            query={tempWorkshopService.date || ''}
            setQuery={(e) =>
              setTempWorkshopService((prev) => ({
                ...prev,
                date: e,
              }))
            }
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory={true}
            label="Data do Serviço"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/2 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Descrição"
            labelStyles="text-digiblack1420-semibold"
            placeholder="Descrição"
            query={tempWorkshopService.description || ''}
            setQuery={(value) => {
              setTempWorkshopService((prev) => ({
                ...prev,
                description: value,
              }))
            }}
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
            onClick={createService}
            disabled={
              !(
                tempWorkshopService.date &&
                tempWorkshopService.description &&
                tempWorkshopService.typeService
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

export default ServicesRepairModal
