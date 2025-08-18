import { Modal } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { generateUuid } from '@/utils'
import Row from '../Row/Row'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import FormInput from '../Input/FormInput'
import {
  CreateEmployeeData,
  EmployeeCertification,
} from '@/app/types/employee/employee'

type CertificationModalProps = {
  action: 'add' | 'edit'
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setValue: UseFormSetValue<CreateEmployeeData>
  seletectedCertification: EmployeeCertification | undefined
  formData?: CreateEmployeeData
  indexNumber?: number
  errors?: FieldErrors<CreateEmployeeData>
}

const CertificationModal = (props: CertificationModalProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    setValue,
    action,
    seletectedCertification,
    indexNumber = -1,
    errors,
  } = props

  const [tempEmployeeCertification, setTempEmployeeCertification] =
    useState<EmployeeCertification>(
      action === 'add'
        ? {
            id: generateUuid(),
            name: '',
            issuer: '',
            issueDate: new Date(),
            description: '',
            validityPeriod: null,
            issuedAt: null,
            expiresAt: null,
            certificateUrl: '',
          }
        : {
            id: seletectedCertification?.id || generateUuid(),
            name: seletectedCertification?.name || '',
            issuer: seletectedCertification?.issuer || '',
            issueDate: seletectedCertification?.issueDate || new Date(),
            description: seletectedCertification?.description || '',
            validityPeriod: seletectedCertification?.validityPeriod || null,
            issuedAt: seletectedCertification?.issuedAt ?? null,
            expiresAt: seletectedCertification?.expiresAt ?? null,
            certificateUrl: seletectedCertification?.certificateUrl || '',
          }
    )

  useEffect(() => {
    if (
      tempEmployeeCertification.expiresAt !== undefined &&
      tempEmployeeCertification.expiresAt !== null &&
      tempEmployeeCertification.issueDate !== undefined &&
      tempEmployeeCertification.issueDate !== null
    ) {
      const expiresAtDate = new Date(tempEmployeeCertification.expiresAt)
      const issueDateDate = new Date(tempEmployeeCertification.issueDate)
      if (!isNaN(expiresAtDate.getTime()) && !isNaN(issueDateDate.getTime())) {
        const validityPeriod = Math.ceil(
          (expiresAtDate.getTime() - issueDateDate.getTime()) /
            (1000 * 3600 * 24)
        )
        setTempEmployeeCertification((prev) => ({
          ...prev,
          validityPeriod,
        }))
      }
    }
  }, [tempEmployeeCertification.issueDate, tempEmployeeCertification.expiresAt])

  const createCertificate = () => {
    if (action === 'add') {
      setValue('certifications', [
        ...(props.formData?.certifications || []),
        tempEmployeeCertification,
      ])
    } else {
      setValue(`certifications.${indexNumber}`, {
        ...seletectedCertification,
        description: tempEmployeeCertification.description,
        id: seletectedCertification?.id || generateUuid(),
        name: tempEmployeeCertification.name,
        issuer: tempEmployeeCertification.issuer,
        issueDate: tempEmployeeCertification.issueDate,
        validityPeriod: tempEmployeeCertification.validityPeriod,
        issuedAt: tempEmployeeCertification.issuedAt,
        expiresAt: tempEmployeeCertification.expiresAt,
        certificateUrl: tempEmployeeCertification.certificateUrl,
      })
    }
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Certificado' : 'Editar Certificado'}
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
              errors?.certifications?.[indexNumber]?.name
                ? 'Nome é obrigatório'
                : undefined
            }
            query={tempEmployeeCertification.name || ''}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                name: typeof value === 'string' ? value : String(value),
              }))
            }
            inputType="text"
            width="lg:w-1/2 w-full"
          />
          <FormInput
            label="Emissor"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Emissor"
            mandatory
            error={
              errors?.certifications?.[indexNumber]?.issuer
                ? 'Emissor é obrigatório'
                : undefined
            }
            query={tempEmployeeCertification.issuer || ''}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                issuer: typeof value === 'string' ? value : String(value),
              }))
            }
            inputType="text"
            width="lg:w-1/2 w-full"
          />
          <FormInput
            label="Data de Emissão"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            error={
              errors?.certifications?.[indexNumber]?.issueDate
                ? 'Data de Emissão é obrigatória'
                : undefined
            }
            placeholder="dd/mm/aaaa"
            mandatory
            query={tempEmployeeCertification.issueDate as unknown as string}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                issueDate: value as unknown as Date,
              }))
            }
            inputType="date"
            width="lg:w-1/2 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Data de Validade"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Data de Validade"
            mandatory
            error={
              errors?.certifications?.[indexNumber]?.expiresAt
                ? 'Data de Validade é obrigatória'
                : undefined
            }
            inputType="date"
            query={tempEmployeeCertification.expiresAt as unknown as string}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                expiresAt: value as unknown as Date,
              }))
            }
            width="lg:w-1/2 w-full"
          />

          <FormInput
            label="Período de Validade (dias)"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Calculado automaticamente"
            mandatory={false}
            disabled
            inputType="number"
            query={tempEmployeeCertification.validityPeriod || undefined}
            setQuery={() => {}}
            width="lg:w-1/3 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Descrição"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory={false}
            placeholder="Descrição"
            inputType="text"
            query={tempEmployeeCertification.description || ''}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                description: value as string,
              }))
            }
            width="w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Certificado URL"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Certificado URL"
            mandatory={false}
            inputType="text"
            query={tempEmployeeCertification.certificateUrl || undefined}
            setQuery={(value) =>
              setTempEmployeeCertification((prev) => ({
                ...prev,
                certificateUrl: value as string,
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
            onClick={createCertificate}
            disabled={
              !(
                tempEmployeeCertification.name &&
                tempEmployeeCertification.issuer &&
                tempEmployeeCertification.issueDate &&
                tempEmployeeCertification.expiresAt
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

export default CertificationModal
