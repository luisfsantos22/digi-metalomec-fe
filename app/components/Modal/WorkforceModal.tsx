import { Modal } from '@mantine/core'
import React from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from '@/utils'
import Row from '../Row/Row'
import FormDropdown from '../Dropdown/FormDropdown'
import { UseFormSetValue } from 'react-hook-form'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { SimpleUser } from '@/app/types/user/user'
import { WorkshopWorkforceObj } from '@/app/types/workshop/workshop-workforces'
import FormInput from '../Input/FormInput'

type WorkforceModalProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<WorkshopFormData>
  workers: SimpleUser[]
  seletectedWorkforce: WorkshopWorkforceObj | undefined
  formData?: WorkshopFormData
  indexNumber?: number
}

const WorkforceModal = (props: WorkforceModalProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    workers,
    seletectedWorkforce,
    indexNumber = -1,
  } = props

  const [tempWorkforce, setTempWorkforce] =
    React.useState<WorkshopWorkforceObj>(
      action === 'add'
        ? {
            uuid: generateUuid(),
            workerUuid: '',
            date: '',
            numHours: 0,
            hourPrice: 0,
          }
        : {
            uuid: seletectedWorkforce?.uuid || generateUuid(),
            workerUuid: seletectedWorkforce?.workerUuid || '',
            date: seletectedWorkforce?.date || '',
            numHours: seletectedWorkforce?.numHours || 0,
            hourPrice: seletectedWorkforce?.hourPrice || 0,
          }
    )

  const hasWorkersOptions = workers?.map((worker) => ({
    label: worker.email,
    value: worker.uuid,
  }))

  const createWorkforce = () => {
    if (action === 'add') {
      setValue('workforces', [
        ...(props.formData?.workforces || []),
        tempWorkforce,
      ])
    } else {
      setValue(`workforces.${indexNumber}`, {
        ...seletectedWorkforce,
        workerUuid: tempWorkforce.workerUuid,
        date: tempWorkforce.date,
        numHours: tempWorkforce.numHours,
        hourPrice: tempWorkforce.hourPrice,
        uuid: tempWorkforce.uuid,
      })
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? "Adicionar Mão d'Obra" : "Editar Mão d'Obra"}
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
            choices={hasWorkersOptions || []}
            placeholder="Escolha o mecânico"
            selectedValue={tempWorkforce.workerUuid}
            setSelectedValue={(value) =>
              setTempWorkforce((prev) => ({
                ...prev,
                workerUuid: value,
              }))
            }
            label="Mecânico Responsável"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory
            width="lg:w-1/2 w-full"
          />
          <FormInput
            query={tempWorkforce.date}
            setQuery={(e) =>
              setTempWorkforce((prev) => ({
                ...prev,
                date: e,
              }))
            }
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory={true}
            label="Data da Mão d'Obra"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/2 w-full"
          />
        </Row>
        <Row>
          <FormInput
            query={tempWorkforce.numHours?.toString() || ''}
            setQuery={(e) =>
              action === 'add'
                ? setTempWorkforce((prev) => ({
                    ...prev,
                    numHours: parseInt(e),
                  }))
                : setValue(`workforces.${indexNumber}.numHours`, parseInt(e), {
                    shouldValidate: true,
                  })
            }
            placeholder="Número de Horas"
            inputType="number"
            mandatory={true}
            label="Número de Horas"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/2 w-full"
          />
          <FormInput
            query={tempWorkforce.hourPrice?.toString() || ''}
            setQuery={(e) =>
              setTempWorkforce((prev) => ({
                ...prev,
                hourPrice: parseFloat(e),
              }))
            }
            placeholder="Preço à Hora"
            inputType="number"
            mandatory={true}
            label="Preço à Hora"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/2 w-full"
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
                tempWorkforce.workerUuid &&
                tempWorkforce.date &&
                tempWorkforce.numHours !== undefined &&
                tempWorkforce.numHours > 0 &&
                tempWorkforce.hourPrice !== undefined &&
                tempWorkforce.hourPrice > 0
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

export default WorkforceModal
