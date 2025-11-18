'use client'

import React, { useEffect, useState } from 'react'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import Collapsible from '../../Collapsible/Collapsible'
import DeleteButton from '../../Button/DeleteButton'
import Separator from '../../Separator/Separator'
import Text from '../../Text/Text'
import AddButton from '../../Button/AddButton'
import DocumentUploadModal from '../../Modal/DocumentUploadModal'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import { useSession } from 'next-auth/react'
import { useDeleteDocument } from '@/app/hooks/employees/documents/useDeleteDocument'
import { formatDate, formatFileSize } from '@/app/utils'
import { Employee } from '@/app/types/employee/employee'
import { useWindowSize } from '@/utils/hooks'
import { isDesktopSize } from 'utils'
import useGetEmployeeDocuments from '@/app/hooks/employees/documents/useGetEmployeeDocuments'
import useGetEmployeeDocument from '@/app/hooks/employees/documents/useGetDocument'
import useDownloadDocument from '@/app/hooks/employees/documents/useDownloadDocument'
import Spinner from '../../Spinner/Spinner'
import DownloadDocumentButton from '../../Button/DownloadDocumentButton'
import DisplayDocumentButton from '../../Button/DisplayDocumentButton'
import GenericTooltip from '../../Tooltip/GenericTooltip'
import DocumentPreviewModal from '../../Modal/DocumentPreviewModal'
import { EmployeeDocument } from '@/app/types/employee/document'

type DocumentsEmployeeProps = {
  employee: Employee | null
}

export default function DocumentsEmployee(props: DocumentsEmployeeProps) {
  const { employee } = props

  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''
  const screenSize = useWindowSize()
  const isDesktop = isDesktopSize(screenSize)

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleDocumentModal, setOpenHandleDocumentModal] = useState(false)
  const [documentToEdit, setDocumentToEdit] = useState<EmployeeDocument | null>(
    null
  )
  const [documentToDelete, setDocumentToDelete] =
    useState<EmployeeDocument | null>(null)
  const [documentToPreview, setDocumentToPreview] =
    useState<EmployeeDocument | null>(null)
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [documentId, setDocumentId] = useState<string>('')
  const [activationTrigger, setActivationTrigger] = useState(0)

  const { documents, error, loading, count } = useGetEmployeeDocuments(
    employee?.id || '',
    [activationTrigger]
  )

  const {
    document: documentFile,
    error: documentError,
    loading: documentLoading,
  } = useGetEmployeeDocument(documentId)

  const { downloadDocument } = useDownloadDocument()
  const { deleteDocument } = useDeleteDocument()

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleDocumentModal(true)
  }

  const handleOpenEditModal = (document: EmployeeDocument) => {
    setActionModal('edit')
    setDocumentToEdit(document)
    setOpenHandleDocumentModal(true)
  }

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return

    const result = await deleteDocument(documentToDelete.id, accessToken)
    if (result) {
      setActivationTrigger((prev) => prev + 1)
      setAreYouSureToDeleteOpen(false)
    }
  }

  const handleOpenAreYouSureModal = (document: EmployeeDocument) => {
    setDocumentToDelete(document)
    setAreYouSureToDeleteOpen(true)
  }

  const handleDownloadDocument = (document: EmployeeDocument) => {
    downloadDocument(document?.id || '', document?.fileName || 'document')
  }

  const handleDisplayDocument = async (document: EmployeeDocument) => {
    setDocumentToPreview(document)
    setDocumentId(document?.id || '')
    setOpenPreviewModal(true)
  }

  useEffect(() => {
    if (
      documentFile?.downloadUrl &&
      documentId &&
      documentToPreview &&
      openPreviewModal
    ) {
      setPreviewFileUrl(documentFile.downloadUrl)
      setDocumentId('') // Reset to prevent reopening
    }
  }, [documentFile, documentId, documentToPreview, openPreviewModal])

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          {documents.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full gap-4">
                <Text
                  header="h2"
                  styles="text-digiblack2025-normal lg:text-left text-center"
                  text={
                    <span>
                      Total de Documentos: <strong>{count || 0}</strong>
                      <span className="text-digiblack1212-semibold">
                        {' '}
                        (Lista de Documentos já associados a este colaborador)
                      </span>
                    </span>
                  }
                />
                <AddButton
                  id="add-document"
                  onClick={handleOpenAddModal}
                  tooltipText="Adicionar Documento"
                  size="h-10 w-10"
                  widthTooltip="300"
                />
              </div>

              <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
                {documents?.map((document, index) => (
                  <div
                    key={document?.id}
                    className="flex flex-col gap-4"
                  >
                    <div className=" rounded-2xl ">
                      <Collapsible
                        header={
                          <div className="flex flex-col xl:flex-row items-start lg:items-center justify-between gap-2 px-2">
                            <Row extraStyles="flex-1 w-full">
                              <Label
                                label="Título"
                                value={document?.title || undefined}
                              />
                              <Label
                                label="Ficheiro"
                                value={document?.fileName || undefined}
                                extraContent={
                                  <div className="flex gap-2">
                                    <DownloadDocumentButton
                                      fileType={
                                        (document?.fileType as
                                          | 'pdf'
                                          | 'png'
                                          | 'jpg'
                                          | 'jpeg') || 'pdf'
                                      }
                                      tooltipText="Download Documento"
                                      hasTooltip
                                      id={`download-document-${document?.id}`}
                                      onClick={() =>
                                        handleDownloadDocument(document)
                                      }
                                    />
                                    <DisplayDocumentButton
                                      fileType={
                                        (document?.fileType as
                                          | 'pdf'
                                          | 'png'
                                          | 'jpg'
                                          | 'jpeg') || 'pdf'
                                      }
                                      tooltipText="Visualizar Documento"
                                      hasTooltip
                                      id={`display-document-${document?.id}`}
                                      onClick={() =>
                                        handleDisplayDocument(document)
                                      }
                                    />
                                  </div>
                                }
                              />
                              <Label
                                label="Criado Em"
                                value={
                                  document?.createdAt
                                    ? formatDate(document.createdAt)
                                    : undefined
                                }
                              />
                              <Label
                                label="Expira Em"
                                value={
                                  document?.expiryDate
                                    ? formatDate(
                                        document.expiryDate as unknown as Date
                                      )
                                    : undefined
                                }
                                placeholder="Por definir"
                              />
                            </Row>
                            {isDesktop && (
                              <div className="flex flex-row gap-2 pt-2 lg:pt-0 justify-end">
                                {/* <EditButton
                                  id={`edit-contract-${contract?.id}`}
                                  onClick={() => handleOpenEditModal(contract)}
                                  tooltipText="Editar Contrato"
                                  hasTooltip={true}
                                /> */}
                                <DeleteButton
                                  id={`delete-document-${document?.id}`}
                                  onClick={() =>
                                    handleOpenAreYouSureModal(document)
                                  }
                                  tooltipText="Remover Documento"
                                  hasTooltip={true}
                                />
                              </div>
                            )}
                          </div>
                        }
                        buttonId={`toggle-document-${document?.id}`}
                        fullWidth
                      >
                        <Row extraStyles="px-2">
                          <Label
                            label="Tipo de Ficheiro"
                            value={document?.fileType || undefined}
                          />
                          <Label
                            label="Tamanho do Ficheiro"
                            value={formatFileSize(document?.fileSize)}
                          />
                        </Row>
                      </Collapsible>
                      {!isDesktop && (
                        <div className="flex flex-row gap-2 pb-2 w-full justify-center">
                          {/* <EditButton
                            id={`edit-contract-${contract?.id}`}
                            onClick={() => handleOpenEditModal(contract)}
                            tooltipText="Editar Contrato"
                            hasTooltip={true}
                          /> */}
                          <DeleteButton
                            id={`delete-document-${document?.id}`}
                            onClick={() => handleOpenAreYouSureModal(document)}
                            tooltipText="Remover Documento"
                            hasTooltip={true}
                          />
                        </div>
                      )}
                    </div>
                    {index < count - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center">
              <Text
                header="h2"
                styles="text-digired2025-semibold text-center"
                text="Nenhum documento encontrado"
              />
              <AddButton
                id="add-document"
                onClick={handleOpenAddModal}
                tooltipText="Adicionar Documento"
                size="h-20 w-20"
                widthTooltip="300"
              />
            </div>
          )}
        </div>
      )}
      <GenericTooltip
        id="download-tooltip"
        withArrow={false}
      />
      <GenericTooltip
        id="display-tooltip"
        withArrow={false}
      />
      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Documento"
          message="Tem a certeza que deseja remover este documento? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteDocument}
          primaryBtnText="Remover"
          onClose={() => setAreYouSureToDeleteOpen(false)}
        />
      )}
      {openHandleDocumentModal && (
        <DocumentUploadModal
          isOpen={openHandleDocumentModal}
          onClose={() => setOpenHandleDocumentModal(false)}
          onSuccess={() => {
            setActivationTrigger((prev) => prev + 1)
          }}
          employeeId={employee?.id || ''}
          documentType="other"
        />
      )}
      {/* Preview Modal */}
      {openPreviewModal && documentFile && (
        <DocumentPreviewModal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          document={documentFile}
          isLoading={documentLoading}
          isError={!!documentError}
        />
      )}
    </div>
  )
}
