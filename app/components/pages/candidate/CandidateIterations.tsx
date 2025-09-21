import Label from '../../Label/Label'
import Row from '../../Row/Row'
import EditButton from '../../Button/EditButton'
import DeleteButton from '../../Button/DeleteButton'
import Separator from '../../Separator/Separator'
import Text from '../../Text/Text'
import AddButton from '../../Button/AddButton'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import { CandidateIteraction } from '@/app/types/candidate/candidate'
import Spinner from '../../Spinner/Spinner'
import useCandidateIteractionsQuery from '@/app/hooks/candidates/iteractions/useCandidateIteractionsQuery'
import useCreateCandidateIteraction from '@/app/hooks/candidates/iteractions/useCreateCandidateIteraction'
import { useEditCandidateIteraction } from '@/app/hooks/candidates/iteractions/useEditCandidateIteraction'
import { useDeleteCandidateIteraction } from '@/app/hooks/candidates/iteractions/useDeleteCandidateIteraction'
import { formatDate } from '../../../utils'
import IteractionModal from '../../Modal/IteractionModal'

type CandidateiteractionsProps = {
  candidateId: string
  setActivationTrigger?: React.Dispatch<React.SetStateAction<number>>
}

export default function Candidateiteractions(props: CandidateiteractionsProps) {
  const { candidateId, setActivationTrigger } = props
  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleIteractionModal, setOpenHandleIteractionModal] =
    useState(false)
  const [iteractionToEdit, setiteractionToEdit] =
    useState<CandidateIteraction | null>(null)
  const [iteractionToDelete, setiteractionToDelete] =
    useState<CandidateIteraction | null>(null)
  const [refreshFlag, setRefreshFlag] = useState(false)

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleIteractionModal(true)
  }

  const handleOpenEditModal = (iteraction: CandidateIteraction) => {
    setActionModal('edit')
    setiteractionToEdit(iteraction)
    setOpenHandleIteractionModal(true)
  }

  const handleOpenAreYouSureModal = (iteraction: CandidateIteraction) => {
    setiteractionToDelete(iteraction)
    setAreYouSureToDeleteOpen(true)
  }

  const { loading, error, iteractions } = useCandidateIteractionsQuery(
    candidateId,
    null,
    refreshFlag
  )

  const { createCandidateIteraction } = useCreateCandidateIteraction()
  const { editCandidateIteraction } = useEditCandidateIteraction()
  const { deleteCandidateIteraction } = useDeleteCandidateIteraction()

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : error ? (
        <Text
          text={`Erro: ${error}`}
          styles="text-red-500 text-center"
        />
      ) : !iteractions || iteractions.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center">
          <Text
            header="h2"
            styles="text-digired2025-semibold text-center"
            text="Nenhuma iteração encontrada"
          />
          <AddButton
            id="add-iteraction"
            onClick={handleOpenAddModal}
            tooltipText="Adicionar Iteração"
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
                  Total de Iterações:{' '}
                  <strong>{iteractions?.length || 0}</strong>
                  <span className="text-digiblack1212-semibold">
                    {' '}
                    (Lista de Iterações associadas a este colaborador)
                  </span>
                </span>
              }
            />
            <AddButton
              id="add-iteraction"
              onClick={handleOpenAddModal}
              tooltipText="Adicionar Iteração"
              size="h-10 w-10"
              widthTooltip="300"
            />
          </div>

          <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
            {iteractions?.map((iteraction, index) => (
              <div
                key={iteraction?.id}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-row items-start lg:items-center justify-between gap-2">
                  <Row extraStyles="flex-1">
                    <Label
                      label="Data da Iteração"
                      value={formatDate(iteraction?.createdAt) || undefined}
                    />
                    <Label
                      label="Descrição"
                      value={iteraction?.description || undefined}
                    />
                  </Row>
                  <div className="flex flex-row gap-2 pt-2 lg:pt-0">
                    <EditButton
                      id={`edit-cert-${iteraction?.id}`}
                      onClick={() => handleOpenEditModal(iteraction)}
                      tooltipText="Editar Iteração"
                      hasTooltip={true}
                    />
                    <DeleteButton
                      id={`delete-cert-${iteraction?.id}`}
                      onClick={() => handleOpenAreYouSureModal(iteraction)}
                      tooltipText="Remover Iteração"
                      hasTooltip={true}
                    />
                  </div>
                </div>
                {index < iteractions.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      )}
      {openHandleIteractionModal && (
        <IteractionModal
          isOpen={openHandleIteractionModal}
          action={actionModal}
          onClose={() => setOpenHandleIteractionModal(false)}
          onConfirm={async (data) => {
            if (data) {
              let result: string | null = null
              if (actionModal === 'edit') {
                result = await editCandidateIteraction(
                  iteractionToEdit?.id,
                  data
                )
              } else {
                result = await createCandidateIteraction(data)
              }
              if (result && setActivationTrigger) {
                setActivationTrigger((prev) => prev + 1)
                setOpenHandleIteractionModal(false)
                setRefreshFlag((prev) => !prev)
              }
            }
          }}
          selectedIteraction={iteractionToEdit ?? undefined}
          userId={candidateId}
        />
      )}
      {areYouSureToDeleteOpen && iteractionToDelete && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          onClose={() => setAreYouSureToDeleteOpen(false)}
          onConfirm={async () => {
            if (iteractionToDelete && setActivationTrigger) {
              const result = await deleteCandidateIteraction(
                iteractionToDelete.id,
                accessToken
              )
              if (result) {
                setActivationTrigger((prev) => prev + 1)
                setAreYouSureToDeleteOpen(false)
                setRefreshFlag((prev) => !prev)
              }
            }
          }}
          message="Tem certeza que deseja remover esta iteração?"
          title="Remover Iteração"
          primaryBtnText="Remover"
        />
      )}
    </>
  )
}
