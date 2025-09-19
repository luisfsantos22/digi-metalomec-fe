'use client'

import { Session } from 'next-auth'
import { redirect, useRouter } from 'next/navigation'
import Spinner from '../../Spinner/Spinner'
import useGetEmployee from '@/app/hooks/employees/useGetEmployee'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import { useEffect, useState } from 'react'
import Text from '../../Text/Text'
import BackButton from '../../Button/BackButton'
import EditButton from '../../Button/EditButton'
import DeleteButton from '../../Button/DeleteButton'
import AreYouSureModal from '../../Modal/AreYouSureModal'
import { useDeleteEmployee } from '@/app/hooks/employees/useDeleteEmployee'
import ContainerCard from '../../Card/ContainerCard'
import PrimaryButton from '../../Button/PrimaryButton'
import { useActivationEmployee } from '@/app/hooks/employees/useActivationEmployee'
import GeneralInfoCandidate from './GeneralInfoCandidate'
import useGetCandidate from '@/app/hooks/candidates/useGetCandidate'

type DetailsCandidateProps = {
  session: Session | null
  candidateId: string
}

export default function DetailsCandidate(props: DetailsCandidateProps) {
  const { session, candidateId } = props

  const router = useRouter()
  const accessToken = session?.accessToken

  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  const [activationTrigger, setActivationTrigger] = useState(0)
  const { loading, error, candidate } = useGetCandidate(candidateId ?? '', [
    activationTrigger,
  ])
  const { deleteEmployee } = useDeleteEmployee()
  const {
    activationEmployee,
    loading: activatingLoading,
    error: activatingError,
  } = useActivationEmployee()

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] =
    useState<boolean>(false)
  const [areYouSureToActivateOpen, setAreYouSureToActivateOpen] =
    useState<boolean>(false)

  useEffect(() => {
    setTabActive('candidates')
    if (!candidateId || error) {
      router.push('/dashboard?module=candidates')
    }
  }, [candidateId, error, router, setTabActive])

  // Prevent hydration mismatch: only render after client-side data is ready
  if (!candidateId || loading) {
    return (
      <div className="flex justify-center self-center items-center p-4 h-full ">
        <Spinner />
      </div>
    )
  }
  if (error) {
    // Optionally show an error message instead of redirecting immediately
    return (
      <Text
        text={`Erro: ${error}`}
        styles="text-red-500 text-center"
      />
    )
  }

  const handleBackToMenu = () => {
    redirect('/dashboard?module=candidates')
  }

  const handleDelete = async (id: string, token: string) => {
    await deleteEmployee(id, token)
    setAreYouSureToDeleteOpen(false)
    router.push('/dashboard?module=candidates')
  }

  const handleActivation = async (
    id: string,
    isActive: boolean,
    token: string
  ) => {
    await activationEmployee(id, isActive, token)
    setAreYouSureToActivateOpen(false)
    setActivationTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center px-4 pb-4 lg:px-0 lg:gap-8 gap-4 w-full">
      {/* Title */}
      <div className="flex lg:flex-row flex-col w-full items-center lg:gap-2 gap-4">
        <div className="lg:w-1/3 lg:block hidden">
          <BackButton
            id="back-btn-create-candidate"
            onClick={() => handleBackToMenu()}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={
            <span>
              Detalhes do{' '}
              <span className="font-bold underline">
                {candidate?.user?.fullName ?? ''}
              </span>
            </span>
          }
          styles="lg:w-2/3 w-full lg:text-[32px] text-[20px] lg:leading-[40px] leading-[25px] font-semibold text-digiblack self-center text-center"
        />
        <div className="lg:w-1/3 w-full gap-2 flex items-center lg:justify-end justify-center">
          <PrimaryButton
            id="handle-activate-candidate"
            onClick={() => {
              setAreYouSureToActivateOpen(true)
            }}
            text={'Atribuir Contrato'}
            type="button"
            extraStyles="!bg-digigreen hover:!bg-digigreen/60 !text-white"
          />
          <EditButton
            id={`edit-${candidate?.id}`}
            onClick={() => {
              router.push(`/candidate/edit?id=${candidate?.id}`)
            }}
            tooltipText="Editar Candidato"
            hasTooltip
            typeBtn="text"
            extraStyles="bg-digiorange hover:bg-digiorange/60"
          />
          <DeleteButton
            id={`delete-${candidate?.id}`}
            onClick={() => {
              setAreYouSureToDeleteOpen(true)
            }}
            tooltipText="Remover Candidato"
            hasTooltip
            typeBtn="text"
            extraStyles="bg-digired hover:bg-digired/60"
          />
        </div>
      </div>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl border border-digibrown"
      >
        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center p-4 h-full ">
            <Spinner />
          </div>
        ) : error ? (
          <Text
            text={`Erro: ${error}`}
            styles="text-red-500 text-center"
          />
        ) : (
          <GeneralInfoCandidate candidate={candidate} />
        )}
      </ContainerCard>

      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Candidato"
          message={`Tem a certeza que deseja remover o candidato selecionado (${candidate?.user?.fullName})?`}
          onConfirm={() => {
            if (candidateId && accessToken) {
              handleDelete(candidateId, accessToken)
            }
          }}
          onClose={() => {
            setAreYouSureToDeleteOpen(false)
          }}
          primaryBtnText="Remover"
        />
      )}
      {areYouSureToActivateOpen && (
        <AreYouSureModal
          isOpen={areYouSureToActivateOpen}
          title={`Atribuir Contrato ao Candidato`}
          message={`Tem a certeza que deseja atribuir contrato ao candidato selecionado (${candidate?.user?.fullName})?`}
          onConfirm={() => {
            if (candidateId && accessToken) {
              handleActivation(candidateId, true, accessToken)
            }
          }}
          onClose={() => {
            setAreYouSureToActivateOpen(false)
          }}
          primaryBtnText="Atribuir Contrato"
        />
      )}
    </div>
  )
}
