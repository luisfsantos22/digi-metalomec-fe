'use client'

import { EmployeeDocument } from '@/app/types/employee/document'
import { Modal } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import Row from '../Row/Row'
import FormInput from '../Input/FormInput'
import { useEditDocument } from '@/app/hooks/employees/documents/useEditDocument'
import { useSession } from 'next-auth/react'
import { DocumentData } from '@/app/types/utils/document'

type DocumentModalProps = {
  isOpen: boolean
  action: 'add' | 'edit'
  document: EmployeeDocument | null
  employeeId: string
  onClose: () => void
  onConfirm: (data?: EmployeeDocument) => void
}

const DocumentModal = ({
  isOpen,
  action,
  document,
  employeeId,
  onClose,
  onConfirm,
}: DocumentModalProps) => {
  const { data: authSession } = useSession()
  const sessionAccessToken = authSession?.accessToken || ''
  const { editDocument: sendEditDocumentRequest, loading: isEditingDocument } =
    useEditDocument()

  const [draftDocument, setDraftDocument] = useState({
    title: document?.title || '',
    expiryDate: document?.expiryDate || null,
    notes: document?.notes || '',
  })

  // Update state when document prop changes
  useEffect(() => {
    if (document) {
      setDraftDocument({
        title: document.title || '',
        expiryDate: document.expiryDate || null,
        notes: document.notes || '',
      })
    }
  }, [document])

  const handleSave = async () => {
    if (!document?.id || !employeeId || !sessionAccessToken) return
    if (!draftDocument.title.trim()) return

    const documentData: DocumentData = {
      title: draftDocument.title.trim(),
      expiryDate: draftDocument.expiryDate,
      notes: draftDocument.notes?.trim() || undefined,
    }

    const result = await sendEditDocumentRequest(
      document.id,
      employeeId,
      documentData,
      sessionAccessToken
    )

    if (result) {
      onConfirm()
      onClose()
    }
  }

  if (!isOpen || !document) {
    return null
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={action === 'add' ? 'Adicionar Documento' : 'Editar Documento'}
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
            placeholder="Título do Documento"
            mandatory
            query={draftDocument.title}
            setQuery={(value) =>
              setDraftDocument((prev) => ({
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
            query={draftDocument.expiryDate as unknown as string}
            setQuery={(value) =>
              setDraftDocument((prev) => ({
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
            query={draftDocument.notes || ''}
            setQuery={(value) =>
              setDraftDocument((prev) => ({
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
              isEditingDocument
                ? 'A guardar...'
                : action === 'add'
                  ? 'Adicionar'
                  : 'Editar'
            }
            id="primary-btn"
            onClick={handleSave}
            disabled={!draftDocument.title.trim() || isEditingDocument}
            extraStyles="!bg-digiorange hover:!bg-digiorange"
            textDisabled="Preencher todos os campos"
          />
        </div>
      </div>
    </Modal>
  )
}

export default DocumentModal
