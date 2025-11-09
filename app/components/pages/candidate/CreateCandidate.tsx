'use client'

import BackButton from '@/app/components/Button/BackButton'
import PrimaryButton from '@/app/components/Button/PrimaryButton'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import Text from '@/app/components/Text/Text'
import { AVAILABILITY_STATUS, AVAILABLE_ROLES } from '@/app/constants'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'
import { notifications } from '@mantine/notifications'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import useCreateCandidate from '@/app/hooks/candidates/useCreateEmployee'
import CandidateFormScreen from '../../Form/CandidateFormScreen'
import { CreateCandidateData } from '@/app/types/candidate/candidate'

type CreateCandidateProps = {
  session: Session | null
}

export default function CreateCandidate(props: CreateCandidateProps) {
  const { session } = props

  const {
    register,
    unregister,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<CreateCandidateData>({
    defaultValues: {
      user: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: AVAILABLE_ROLES.find((role) => role.value === 'EMPLOYEE')?.value,
        company: session?.user.companyId || '',
        phoneNumber: '',
      },
      jobTitles: [],
      geographicLocation: {
        city: '',
        municipality: '',
        locality: '',
        parish: '',
        latitude: null,
        longitude: null,
        addressFull: null,
      },
      availabilityStatus: AVAILABILITY_STATUS.find(
        (status) => status.value === 'AVAILABLE'
      )?.value,
    },
  })

  const formData = watch()
  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  const [canSubmit, setCanSubmit] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Modal states
  const [
    areYouSureCloseCreateCandidateModal,
    setAreYouSureCloseCreateCandidateModal,
  ] = useState(false)

  const { createCandidate, loading, error } = useCreateCandidate()
  const { startLoading, stopLoading } = useGlobalLoading()

  // UseEffects
  useEffect(() => {
    setTabActive('candidates')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  useEffect(() => {
    // Define mandatory fields
    const mandatoryEmployeeFields = [
      formData?.jobTitles?.length > 0 ? formData?.jobTitles[0] : undefined,
      formData?.availabilityStatus,
      formData?.geographicLocation?.city,
      formData?.geographicLocation?.municipality,
    ]

    // Check if all mandatory fields are filled
    const isEmployeeDataValid = mandatoryEmployeeFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    // Validate user data
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

    setCanSubmit(isEmployeeDataValid && isUserDataValid)
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
        await createCandidate(data)
      } catch (err) {
        console.log(err)
      } finally {
        stopLoading()
      }
    }
  }

  const handleBackToMenu = () => {
    if (!formData || Object.keys(formData).length === 0) {
      redirect('/dashboard?module=candidates')
    }
    setAreYouSureCloseCreateCandidateModal(true)
  }

  return (
    <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center px-4 lg:px-0 lg:gap-8 gap-4 w-full">
      {/* Title */}
      <div className="flex w-full items-center gap-2">
        <div className="lg:w-1/3 lg:block hidden">
          <BackButton
            id="back-btn-create-candidate"
            onClick={() => handleBackToMenu()}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={'Criar Candidato'}
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
          clearErrors={clearErrors}
          watch={watch}
        />
        <div className="flex flex-row gap-4 lg:gap-8 w-full items-center justify-center lg:justify-end">
          <SecondaryButton
            text="Cancelar"
            id="cancelar"
            onClick={() => {
              setAreYouSureCloseCreateCandidateModal(true)
            }}
          />

          <PrimaryButton
            text={'Criar'}
            type="submit"
            size={'medium'}
            disabled={Object.keys(errors).length > 0 || !canSubmit}
            id="btn-repair-action"
            textDisabled="Preencha todos os campos obrigatórios"
          />
        </div>
      </form>

      {areYouSureCloseCreateCandidateModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseCreateCandidateModal}
          onClose={() => {
            setAreYouSureCloseCreateCandidateModal(false)
          }}
          onConfirm={() => redirect('/dashboard?module=candidates')}
          title="Sair da Criação de um Novo Candidato"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
    </div>
  )
}
