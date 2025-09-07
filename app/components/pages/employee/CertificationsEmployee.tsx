import { EmployeeCertification } from '@/app/types/employee/employee'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import Collapsible from '../../Collapsible/Collapsible'
import EditButton from '../../Button/EditButton'
import DeleteButton from '../../Button/DeleteButton'
import { formatDate } from '@/app/utils'
import Separator from '../../Separator/Separator'
import Text from '../../Text/Text'
import AddButton from '../../Button/AddButton'
import useCreateCertification from '@/app/hooks/employees/certification/useCreateCertification'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import CertificationModal from '../../Modal/CertificationModal'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import { useEditCertification } from '@/app/hooks/employees/certification/useEditCertification'
import { useDeleteCertification } from '@/app/hooks/employees/certification/useDeleteCertification'

type CertificationsEmployeeProps = {
  employeeId: string | undefined
  certifications: EmployeeCertification[] | undefined
  setActivationTrigger?: React.Dispatch<React.SetStateAction<number>>
}

export default function CertificationsEmployee(
  props: CertificationsEmployeeProps
) {
  const { employeeId, certifications, setActivationTrigger } = props
  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleCertificationModal, setOpenHandleCertificationModal] =
    useState(false)
  const [certificationToEdit, setCertificationToEdit] =
    useState<EmployeeCertification | null>(null)
  const [certificationToDelete, setCertificationToDelete] =
    useState<EmployeeCertification | null>(null)

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleCertificationModal(true)
  }

  const handleOpenEditModal = (certification: EmployeeCertification) => {
    setActionModal('edit')
    setCertificationToEdit(certification)
    setOpenHandleCertificationModal(true)
  }

  const handleOpenAreYouSureModal = (certification: EmployeeCertification) => {
    setCertificationToDelete(certification)
    setAreYouSureToDeleteOpen(true)
  }

  const { createEmployeeCertification } = useCreateCertification()
  const { editCertification } = useEditCertification()
  const { deleteCertification } = useDeleteCertification()

  return (
    <>
      {!certifications || certifications.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center">
          <Text
            header="h2"
            styles="text-digired2025-semibold text-center"
            text="Nenhuma certificação encontrada"
          />
          <AddButton
            id="add-certification"
            onClick={handleOpenAddModal}
            tooltipText="Adicionar Certificação"
            size="h-20 w-20"
            widthTooltip="300"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center w-full gap-4">
            <Text
              header="h2"
              styles="text-digiblack2025-normal lg:text-left text-center"
              text={
                <span>
                  Total de Certificações:{' '}
                  <strong>{certifications?.length || 0}</strong>
                  <span className="text-digiblack1212-semibold">
                    {' '}
                    (Lista de Certificações associadas a este colaborador)
                  </span>
                </span>
              }
            />
            <AddButton
              id="add-certification"
              onClick={handleOpenAddModal}
              tooltipText="Adicionar Certificação"
              size="h-10 w-10"
              widthTooltip="300"
            />
          </div>

          <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
            {certifications?.map((certification, index) => (
              <div
                key={certification?.id}
                className="flex flex-col gap-4"
              >
                <Collapsible
                  header={
                    <div className="flex flex-row items-start lg:items-center justify-between gap-2">
                      <Row extraStyles="flex-1">
                        <Label
                          label="Nome da Certificação"
                          value={certification?.name || undefined}
                        />
                        <Label
                          label="Emitido Por"
                          value={certification?.issuer || undefined}
                        />
                        <Label
                          label="Data de Emissão"
                          value={
                            certification?.issuedAt
                              ? formatDate(certification?.issuedAt)
                              : undefined
                          }
                        />
                        <Label
                          label="Data de Validade"
                          value={
                            certification?.expiresAt
                              ? formatDate(certification?.expiresAt)
                              : undefined
                          }
                        />
                        <Label
                          label="Valido por (dias)"
                          value={
                            certification?.validForDays?.toString() || undefined
                          }
                        />
                      </Row>
                      <div className="flex flex-row gap-2 pt-2 lg:pt-0">
                        <EditButton
                          id={`edit-cert-${certification?.id}`}
                          onClick={() => handleOpenEditModal(certification)}
                          tooltipText="Editar Certificação"
                          hasTooltip={true}
                        />
                        <DeleteButton
                          id={`delete-cert-${certification?.id}`}
                          onClick={() =>
                            handleOpenAreYouSureModal(certification)
                          }
                          tooltipText="Remover Certificação"
                          hasTooltip={true}
                        />
                      </div>
                    </div>
                  }
                  buttonId={`toggle-cert-${certification?.id}`}
                  fullWidth
                >
                  <Row>
                    <Label
                      label="Descrição"
                      value={certification?.description || undefined}
                    />
                  </Row>
                  <Row>
                    <Label
                      label="URL"
                      value={certification?.certificateUrl || undefined}
                    />
                  </Row>
                </Collapsible>
                {index < certifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      )}
      {openHandleCertificationModal && (
        <CertificationModal
          isOpen={openHandleCertificationModal}
          action={actionModal}
          onClose={() => setOpenHandleCertificationModal(false)}
          onConfirm={async (data) => {
            if (data) {
              let result: EmployeeCertification | null = null
              if (actionModal === 'edit') {
                result = await editCertification(
                  certificationToEdit?.id,
                  employeeId ?? '',
                  data,
                  accessToken
                )
              } else {
                result = await createEmployeeCertification(
                  employeeId ?? '',
                  data
                )
              }
              if (result?.id && setActivationTrigger) {
                setActivationTrigger((prev) => prev + 1)
                setOpenHandleCertificationModal(false)
              }
            }
          }}
          seletectedCertification={certificationToEdit ?? undefined}
          parent="certification"
        />
      )}
      {areYouSureToDeleteOpen && certificationToDelete && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          onClose={() => setAreYouSureToDeleteOpen(false)}
          onConfirm={async () => {
            if (certificationToDelete && setActivationTrigger) {
              const result = await deleteCertification(
                certificationToDelete.certificationId,
                accessToken
              )
              if (result) {
                setActivationTrigger((prev) => prev + 1)
              }
            }
          }}
          message="Tem certeza que deseja remover esta certificação?"
          title="Remover Certificação"
          primaryBtnText="Remover"
        />
      )}
    </>
  )
}
