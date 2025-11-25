import { Modal } from '@mantine/core'
import React, { useState } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from 'utils'
import Row from '../Row/Row'
import FormInput from '../Input/FormInput'
import { CandidateIteraction } from '@/app/types/candidate/candidate'

type IteractionModalProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: (data?: CandidateIteraction) => void
  selectedIteraction: CandidateIteraction | undefined
  userId: string
}

const IteractionModal = (props: IteractionModalProps) => {
  const { isOpen, onClose, onConfirm, action, selectedIteraction, userId } =
    props

  const [descriptionError, setDescriptionError] = useState<string | undefined>(
    undefined
  )

  const [tempCandidateIteraction, setTempCandidateIteraction] =
    useState<CandidateIteraction>(
      action === 'add'
        ? {
            id: generateUuid(),
            description: '',
            employee: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        : {
            id: selectedIteraction?.id || generateUuid(),
            description: selectedIteraction?.description || '',
            employee: selectedIteraction?.employee || userId,
            createdAt: selectedIteraction?.createdAt || new Date(),
            updatedAt: selectedIteraction?.updatedAt || new Date(),
          }
    )

  const handleIteraction = () => {
    if (!tempCandidateIteraction.description) {
      setDescriptionError('Descrição é obrigatória')

      return
    }
    if (action === 'add') {
      onConfirm(tempCandidateIteraction)
    } else {
      onConfirm({
        ...selectedIteraction,
        description: tempCandidateIteraction.description,
        id: selectedIteraction?.id || generateUuid(),
        updatedAt: tempCandidateIteraction?.updatedAt || new Date(),
        employee: tempCandidateIteraction?.employee || userId,
        createdAt: tempCandidateIteraction?.createdAt || new Date(),
      })
    }
    onConfirm()
  }

  if (!isOpen) {
    return null
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Iteração' : 'Editar Iteração'}
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
            label="Descrição"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Descrição"
            mandatory
            error={descriptionError ? 'Descrição é obrigatória' : undefined}
            query={tempCandidateIteraction.description || ''}
            setQuery={(value) =>
              setTempCandidateIteraction((prev) => ({
                ...prev,
                description: typeof value === 'string' ? value : String(value),
              }))
            }
            inputType="text"
            width="w-full"
          />
        </Row>
        <Row>
          <FormInput
            query={tempCandidateIteraction.createdAt as unknown as string}
            setQuery={(e) =>
              setTempCandidateIteraction((prev) => ({
                ...prev,
                createdAt: e as unknown as Date,
              }))
            }
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory
            label="Data da Iteração"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/3 w-full"
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
            onClick={handleIteraction}
            disabled={!tempCandidateIteraction.description}
            extraStyles="!bg-digiorange hover:!bg-digiorange"
            textDisabled="Preencher todos os campos"
          />
        </div>
      </div>
    </Modal>
  )
}

export default IteractionModal
