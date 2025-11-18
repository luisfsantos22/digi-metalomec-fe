'use client'

import useGetEmployeeContracts from '@/app/hooks/employees/documents/useGetEmployeeContracts'
import { Employee } from '@/app/types/employee/employee'
import Spinner from '../../Spinner/Spinner'
import Text from '../../Text/Text'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { EmployeeContract } from '@/app/types/utils/contract'
import Collapsible from '../../Collapsible/Collapsible'
import Row from '../../Row/Row'
import Label from '../../Label/Label'
import AddButton from '../../Button/AddButton'
import { formatDate, formatFileSize } from '@/app/utils'
import DeleteButton from '../../Button/DeleteButton'
import Separator from '../../Separator/Separator'
import DisplayDocumentButton from '../../Button/DisplayDocumentButton'
import useGetEmployeeDocument from '@/app/hooks/employees/documents/useGetDocument'
import useDownloadDocument from '@/app/hooks/employees/documents/useDownloadDocument'
import { useDeleteContract } from '@/app/hooks/employees/documents/useDeleteContract'
import DownloadDocumentButton from '../../Button/DownloadDocumentButton'
import GenericTooltip from '../../Tooltip/GenericTooltip'
import { useWindowSize } from '@/utils/hooks'
import { classNames, isDesktopSize } from 'utils'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import DocumentUploadModal from '../../Modal/DocumentUploadModal'
import DocumentPreviewModal from '../../Modal/DocumentPreviewModal'

type ContractEmployeeProps = {
  employee: Employee | null
}

export default function ContractEmployee(props: ContractEmployeeProps) {
  const { employee } = props

  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''
  const screenSize = useWindowSize()
  const isDesktop = isDesktopSize(screenSize)

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleContractModal, setOpenHandleContractModal] = useState(false)
  const [contractToEdit, setContractToEdit] = useState<EmployeeContract | null>(
    null
  )
  const [contractToDelete, setContractToDelete] =
    useState<EmployeeContract | null>(null)
  const [contractToPreview, setContractToPreview] =
    useState<EmployeeContract | null>(null)
  const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null)
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [contractDocumentId, setContractDocumentId] = useState<string>('')
  const [activationTrigger, setActivationTrigger] = useState(0)

  const { contracts, error, loading, count } = useGetEmployeeContracts(
    employee?.id || '',
    [activationTrigger]
  )

  const {
    document: documentFile,
    error: documentError,
    loading: documentLoading,
  } = useGetEmployeeDocument(contractDocumentId)

  const { downloadDocument } = useDownloadDocument()
  const { deleteContract } = useDeleteContract()

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleContractModal(true)
  }

  const handleOpenEditModal = (contract: EmployeeContract) => {
    setActionModal('edit')
    setContractToEdit(contract)
    setOpenHandleContractModal(true)
  }

  const handleDeleteContract = async () => {
    if (!contractToDelete) return

    const result = await deleteContract(contractToDelete.id, accessToken)
    if (result) {
      setActivationTrigger((prev) => prev + 1)
      setAreYouSureToDeleteOpen(false)
    }
  }

  const handleOpenAreYouSureModal = (contract: EmployeeContract) => {
    setContractToDelete(contract)
    setAreYouSureToDeleteOpen(true)
  }

  const handleDownloadContract = (contract: EmployeeContract) => {
    downloadDocument(contract?.id || '', contract?.fileName || 'document')
  }

  const handleDisplayContract = async (contract: EmployeeContract) => {
    setContractToPreview(contract)
    setContractDocumentId(contract?.id || '')
    setOpenPreviewModal(true)
  }

  useEffect(() => {
    if (
      documentFile?.downloadUrl &&
      contractDocumentId &&
      contractToPreview &&
      openPreviewModal
    ) {
      setPreviewFileUrl(documentFile.downloadUrl)
      setContractDocumentId('') // Reset to prevent reopening
    }
  }, [documentFile, contractDocumentId, contractToPreview, openPreviewModal])

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          {contracts.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full gap-4">
                <Text
                  header="h2"
                  styles="text-digiblack2025-normal lg:text-left text-center"
                  text={
                    <span>
                      Total de Contratos: <strong>{count || 0}</strong>
                      <span className="text-digiblack1212-semibold">
                        {' '}
                        (Lista de Contratos já associados a este colaborador)
                      </span>
                    </span>
                  }
                />
                <AddButton
                  id="add-contract"
                  onClick={handleOpenAddModal}
                  tooltipText="Adicionar Contrato"
                  size="h-10 w-10"
                  widthTooltip="300"
                />
              </div>

              <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
                {contracts?.map((contract, index) => (
                  <div
                    key={contract?.id}
                    className="flex flex-col gap-4"
                  >
                    <div
                      className={classNames(
                        !contract?.expiryDate &&
                          index === 0 &&
                          'bg-digiblue/20 border border-digiblue border-dashed',
                        ' rounded-2xl '
                      )}
                    >
                      <Collapsible
                        header={
                          <div className="flex flex-col xl:flex-row items-start lg:items-center justify-between gap-2 px-2">
                            <Row extraStyles="flex-1 w-full">
                              <Label
                                label="Título"
                                value={contract?.title || undefined}
                              />
                              <Label
                                label="Ficheiro"
                                value={contract?.fileName || undefined}
                                extraContent={
                                  <div className="flex gap-2">
                                    <DownloadDocumentButton
                                      fileType={
                                        (contract?.fileType as
                                          | 'pdf'
                                          | 'png'
                                          | 'jpg'
                                          | 'jpeg') || 'pdf'
                                      }
                                      tooltipText="Download Contrato"
                                      hasTooltip
                                      id={`download-contract-${contract?.id}`}
                                      onClick={() =>
                                        handleDownloadContract(contract)
                                      }
                                    />
                                    <DisplayDocumentButton
                                      fileType={
                                        (contract?.fileType as
                                          | 'pdf'
                                          | 'png'
                                          | 'jpg'
                                          | 'jpeg') || 'pdf'
                                      }
                                      tooltipText="Visualizar Contrato"
                                      hasTooltip
                                      id={`display-contract-${contract?.id}`}
                                      onClick={() =>
                                        handleDisplayContract(contract)
                                      }
                                    />
                                  </div>
                                }
                              />
                              <Label
                                label="Criado Em"
                                value={
                                  contract?.createdAt
                                    ? formatDate(contract.createdAt)
                                    : undefined
                                }
                              />
                              <Label
                                label="Expira Em"
                                value={
                                  contract?.expiryDate
                                    ? formatDate(
                                        contract.expiryDate as unknown as Date
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
                                  id={`delete-contract-${contract?.id}`}
                                  onClick={() =>
                                    handleOpenAreYouSureModal(contract)
                                  }
                                  tooltipText="Remover Contrato"
                                  hasTooltip={true}
                                />
                              </div>
                            )}
                          </div>
                        }
                        buttonId={`toggle-contract-${contract?.id}`}
                        fullWidth
                      >
                        <Row extraStyles="px-2">
                          <Label
                            label="Tipo de Ficheiro"
                            value={contract?.fileType || undefined}
                          />
                          <Label
                            label="Tamanho do Ficheiro"
                            value={formatFileSize(contract?.fileSize)}
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
                            id={`delete-contract-${contract?.id}`}
                            onClick={() => handleOpenAreYouSureModal(contract)}
                            tooltipText="Remover Contrato"
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
                text="Nenhum contrato encontrado"
              />
              <AddButton
                id="add-contract"
                onClick={handleOpenAddModal}
                tooltipText="Adicionar Contrato"
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
          title="Remover Contrato"
          message="Tem a certeza que deseja remover este contrato? Esta ação não pode ser desfeita."
          onConfirm={handleDeleteContract}
          primaryBtnText="Remover"
          onClose={() => setAreYouSureToDeleteOpen(false)}
        />
      )}
      {openHandleContractModal && (
        <DocumentUploadModal
          isOpen={openHandleContractModal}
          onClose={() => setOpenHandleContractModal(false)}
          onSuccess={() => {
            setActivationTrigger((prev) => prev + 1)
          }}
          employeeId={employee?.id || ''}
          documentType="contract"
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
