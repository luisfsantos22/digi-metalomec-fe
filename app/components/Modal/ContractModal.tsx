'use client'

import { EmployeeDocument } from '@/app/types/employee/document'
import { Modal } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import Row from '../Row/Row'
import FormInput from '../Input/FormInput'
import { useEditContract } from '@/app/hooks/employees/documents/useEditContract'
import { useSession } from 'next-auth/react'
import { ContractData } from '@/app/types/utils/contract'

type ContractModalProps = {
  isOpen: boolean
  action: 'add' | 'edit'
  contract: EmployeeDocument | null
  employeeId: string
  onClose: () => void
  onConfirm: (data?: EmployeeDocument) => void
}

const ContractModal = ({
  isOpen,
  action,
  contract,
  employeeId,
  onClose,
  onConfirm,
}: ContractModalProps) => {
  const { data: authSession } = useSession()
  const sessionAccessToken = authSession?.accessToken || ''
  const { editContract: sendEditContractRequest, loading: isEditingContract } =
    useEditContract()

  const [draftContract, setDraftContract] = useState({
    title: contract?.title || '',
    expiryDate: contract?.expiryDate || null,
    notes: contract?.notes || '',
  })

  // Update state when contract prop changes
  useEffect(() => {
    if (contract) {
      setDraftContract({
        title: contract.title || '',
        expiryDate: contract.expiryDate || null,
        notes: contract.notes || '',
      })
    }
  }, [contract])

  const handleSave = async () => {
    if (!contract?.id || !employeeId || !sessionAccessToken) return
    if (!draftContract.title.trim()) return

    const contractData: ContractData = {
      title: draftContract.title.trim(),
      expiryDate: draftContract.expiryDate,
      notes: draftContract.notes?.trim() || undefined,
    }

    const result = await sendEditContractRequest(
      contract.id,
      employeeId,
      contractData,
      sessionAccessToken
    )

    if (result) {
      onConfirm()
      onClose()
    }
  }

  if (!isOpen || !contract) {
    return null
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Contrato' : 'Editar Contrato'}
      centered
      size="xl"
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
    >
      <div className="flex flex-col gap-4">
        <Row>
          <FormInput
            label="Título"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Título do Contrato"
            mandatory
            query={draftContract.title}
            setQuery={(value) =>
              setDraftContract((prev) => ({
                ...prev,
                title: typeof value === 'string' ? value : String(value),
              }))
            }
            inputType="text"
            width="w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Data de Expiração"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="dd/mm/aaaa"
            mandatory={false}
            query={draftContract.expiryDate as unknown as string}
            setQuery={(value) =>
              setDraftContract((prev) => ({
                ...prev,
                expiryDate: value as unknown as string | null,
              }))
            }
            inputType="date"
            width="w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Notas"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Notas adicionais"
            mandatory={false}
            inputType="text"
            query={draftContract.notes || ''}
            setQuery={(value) =>
              setDraftContract((prev) => ({
                ...prev,
                notes: value as string,
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
            text={
              isEditingContract
                ? 'A guardar...'
                : action === 'add'
                  ? 'Adicionar'
                  : 'Editar'
            }
            id="primary-btn"
            onClick={handleSave}
            disabled={!draftContract.title.trim() || isEditingContract}
            extraStyles="!bg-digiorange hover:!bg-digiorange"
            textDisabled="Preencher todos os campos"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ContractModal
