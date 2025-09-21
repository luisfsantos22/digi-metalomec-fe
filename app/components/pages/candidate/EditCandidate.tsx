'use client'

import BackButton from '@/app/components/Button/BackButton'
import PrimaryButton from '@/app/components/Button/PrimaryButton'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import Spinner from '@/app/components/Spinner/Spinner'
import Text from '@/app/components/Text/Text'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import { useRouter, useSearchParams } from 'next/navigation'
import CandidateFormScreen from '../../Form/CandidateFormScreen'
import { useUpdateCandidate } from '@/app/hooks/candidates/useUpdateCandidate'
import useGetCandidate from '@/app/hooks/candidates/useGetCandidate'
import { CreateCandidateData } from '@/app/types/candidate/candidate'

export default function EditCandidate() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const candidateId = searchParams.get('id') || undefined

  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [canSubmit, setCanSubmit] = useState(false)

  // Modal states
  const [
    areYouSureCloseEditCandidateModal,
    setAreYouSureCloseEditCandidateModal,
  ] = useState(false)

  // Fetch candidate data
  const {
    candidate: candidateData,
    loading: loadingCandidate,
    error: errorCandidate,
  } = useGetCandidate(candidateId ?? '')

  const { editCandidate, loading, error } = useUpdateCandidate()
  const { startLoading, stopLoading } = useGlobalLoading()

  // Form setup
  const {
    register,
    unregister,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<CreateCandidateData>({
    defaultValues: candidateData as CreateCandidateData | undefined,
  })

  const formData = watch()

  useEffect(() => {
    setTabActive('candidates')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  useEffect(() => {
    if (candidateData) {
      reset(candidateData as CreateCandidateData)
    }
  }, [candidateData, reset])

  useEffect(() => {
    // Define mandatory fields
    const mandatoryCandidateFields = [
      formData?.jobTitles?.length > 0 ? formData?.jobTitles[0] : undefined,
      formData?.availabilityStatus,
      formData?.geographicAvailability,
    ]
    const isCandidateDataValid = mandatoryCandidateFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )
    const mandatoryUserFields = [
      formData?.user?.email,
      formData?.user?.firstName,
      formData?.user?.lastName,
      formData?.user?.role,
      formData?.user?.company,
    ]
    const isUserDataValid = mandatoryUserFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    setCanSubmit(isCandidateDataValid && isUserDataValid)
  }, [formData])

  //functions
  const formSubmit = async (data: CreateCandidateData) => {
    if (Object.keys(errors).length > 0) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Preencha todos os campos obrigatórios antes de submeter.',
        position: 'top-right',
      })
    } else {
      try {
        startLoading()
        const result = await editCandidate(candidateId, data)

        if (result?.id) {
          router.push(`/candidate/details/${result.id}/`)
        }
        stopLoading()
      } catch (err) {
        console.log(err)
        stopLoading()
      }
    }
  }

  if (!candidateId || loadingCandidate) {
    return (
      <div className="flex justify-center self-center items-center p-4 h-full ">
        <Spinner />
      </div>
    )
  }

  if (errorCandidate) {
    // Optionally show an error message instead of redirecting immediately
    return (
      <Text
        text={`Erro: ${errorCandidate}`}
        styles="text-red-500 text-center"
      />
    )
  }

  return (
    <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center px-4 lg:px-0 lg:gap-8 gap-4 w-full">
      {/* Title */}
      <div className="flex w-full items-center gap-2">
        <div className="lg:w-1/3 lg:block hidden">
          <BackButton
            id="back-btn-edit-employee"
            onClick={() => setAreYouSureCloseEditCandidateModal(true)}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={`Editar Colaborador - ${formData?.internalIdentifier}`}
          styles="lg:w-1/3 w-full lg:text-[32px] text-[20px] lg:leading-[40px] leading-[25px] font-semibold text-digiblack self-center text-center"
        />
        <div className="lg:w-1/3 lg:block hidden"></div>
      </div>
      <form
        onSubmit={handleSubmit(formSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <CandidateFormScreen
          formData={formData}
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <div className="flex flex-row gap-4 lg:gap-8 w-full items-center justify-center lg:justify-end">
          <SecondaryButton
            text="Cancelar"
            id="cancelar"
            onClick={() => setAreYouSureCloseEditCandidateModal(true)}
          />
          <PrimaryButton
            text={'Editar'}
            type="submit"
            size={'medium'}
            disabled={Object.keys(errors).length > 0 || !canSubmit}
            id="btn-edit-employee-action"
            textDisabled="Preencha todos os campos obrigatórios"
          />
        </div>
      </form>

      {areYouSureCloseEditCandidateModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseEditCandidateModal}
          onClose={() => {
            setAreYouSureCloseEditCandidateModal(false)
          }}
          onConfirm={() => {
            // Redirect to dashboard or previous page
            window.location.href = '/dashboard?module=candidates'
          }}
          title="Sair da Edição de um Candidato"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
    </div>
  )
}
