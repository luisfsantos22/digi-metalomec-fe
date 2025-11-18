'use client'

import { EmployeeDocument } from '@/app/types/employee/document'
import { Modal } from '@mantine/core'
import React from 'react'

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
      <div className="flex flex-col gap-4"></div>
    </Modal>
  )
}

export default ContractModal
