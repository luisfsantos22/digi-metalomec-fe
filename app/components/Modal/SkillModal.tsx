import { Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import Row from '../Row/Row'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { CreateEmployeeData } from '@/app/types/employee/employee'
import { EmployeeSkill } from '@/app/types/employee/skill'
import FormInput from '../Input/FormInput'
import FormDropdown from '../Dropdown/FormDropdown'
import { SKILL_LEVELS } from '@/app/constants'

export type SkillModalProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<CreateEmployeeData>
  selectedSkill: EmployeeSkill | undefined
  formData?: CreateEmployeeData
  indexNumber?: number
  errors?: FieldErrors<CreateEmployeeData>
}

const SkillModal = (props: SkillModalProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    selectedSkill,
    indexNumber = -1,
    errors,
    formData,
  } = props

  const [tempSkill, setTempSkill] = useState<EmployeeSkill>(
    action === 'add'
      ? {
          id: Math.random().toString(36).substring(2, 15),
          name: '',
          level: 'Beginner',
          description: '',
          acquiredAt: null,
        }
      : {
          id: selectedSkill?.id || Math.random().toString(36).substring(2, 15),
          name: selectedSkill?.name || '',
          level: selectedSkill?.level || 'Beginner',
          description: selectedSkill?.description || '',
          acquiredAt: selectedSkill?.acquiredAt ?? null,
        }
  )

  const createSkill = () => {
    if (action === 'add') {
      setValue('skills', [...(formData?.skills || []), tempSkill])
    } else {
      setValue(`skills.${indexNumber}`, {
        ...selectedSkill,
        id: selectedSkill?.id || '',
        name: tempSkill.name,
        level: tempSkill.level,
        description: tempSkill.description,
        acquiredAt: tempSkill.acquiredAt,
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
          ? 'Adicionar Habilidade Técnica (Skill)'
          : 'Editar Habilidade Técnica (Skill)'
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
            label="Nome"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Nome"
            mandatory
            error={
              errors?.skills?.[indexNumber]?.name
                ? 'Nome é obrigatório'
                : undefined
            }
            query={tempSkill.name || ''}
            setQuery={(value) =>
              setTempSkill((prev) => ({
                ...prev,
                name: typeof value === 'string' ? value : String(value),
              }))
            }
            inputType="text"
            width="lg:w-1/2 w-full"
          />
          <FormDropdown
            label="Nível"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            choices={SKILL_LEVELS.map((level) => ({
              value: level.key,
              label: level.label,
            }))}
            selectedValue={tempSkill.level}
            setSelectedValue={(value) =>
              setTempSkill((prev) => ({
                ...prev,
                level: value as typeof tempSkill.level,
              }))
            }
            error={
              errors?.skills?.[indexNumber]?.level
                ? 'Nível é obrigatório'
                : undefined
            }
            width="lg:w-1/2 w-full"
            placeholder="Selecione o nível"
            mandatory
          />
        </Row>
        <Row>
          <FormInput
            label="Descrição"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Descrição"
            mandatory={false}
            inputType="text"
            query={tempSkill.description || ''}
            setQuery={(value) =>
              setTempSkill((prev) => ({
                ...prev,
                description: typeof value === 'string' ? value : String(value),
              }))
            }
            width="w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Data de Aquisição"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="dd/mm/aaaa"
            mandatory={false}
            inputType="date"
            query={
              tempSkill.acquiredAt
                ? (tempSkill.acquiredAt as unknown as string)
                : ''
            }
            setQuery={(value) =>
              setTempSkill((prev) => ({
                ...prev,
                acquiredAt: value ? (value as unknown as Date) : null,
              }))
            }
            width="lg:w-1/2 w-full"
          />
        </Row>
        <div className="flex justify-end gap-4">
          <SecondaryButton
            text="Cancelar"
            id="cancel-skill-btn"
            onClick={onClose}
          />
          <PrimaryButton
            type="button"
            text={action === 'add' ? 'Adicionar' : 'Editar'}
            id="primary-skill-btn"
            onClick={createSkill}
            disabled={!(tempSkill.name && tempSkill.level)}
            extraStyles="!bg-digiorange hover:!bg-digiorange"
            textDisabled="Preencher todos os campos"
          />
        </div>
      </div>
    </Modal>
  )
}

export default SkillModal
