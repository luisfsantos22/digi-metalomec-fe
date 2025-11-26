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
import useCheckUnique from '@/app/hooks/utils/useCheckUnique'
import { cleanPhone } from '@/app/validators/validation'
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
    setError,
  } = useForm<CreateCandidateData>({
    mode: 'onChange', // Validate on change for immediate feedback
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
  const { checkUnique } = useCheckUnique('candidates')
  const { checkUnique: checkEmployeeUnique } = useCheckUnique('employees')
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
      formData?.user?.phoneNumber,
      formData?.user?.role,
      formData?.user?.company,
    ]

    const isUserDataValid = mandatoryUserFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    setCanSubmit(
      isEmployeeDataValid && isUserDataValid && Object.keys(errors).length === 0
    )
  }, [formData, errors])

  //functions
  const formSubmit = async (data: CreateCandidateData) => {
    // Custom validation for fields not handled by react-hook-form
    let hasErrors = false

    // Validate jobTitles
    if (!data.jobTitles || data.jobTitles.length === 0) {
      setError('jobTitles', {
        type: 'required',
        message: 'Cargo/Função é obrigatório',
      })
      hasErrors = true
    }

    // Validate geographic location
    if (!data.geographicLocation?.city) {
      setError('geographicLocation.city', {
        type: 'required',
        message: 'Cidade é obrigatória',
      })
      hasErrors = true
    }

    if (!data.geographicLocation?.municipality) {
      setError('geographicLocation.municipality', {
        type: 'required',
        message: 'Concelho é obrigatório',
      })
      hasErrors = true
    }

    // Validate availability status
    if (!data.availabilityStatus) {
      setError('availabilityStatus', {
        type: 'required',
        message: 'Disponibilidade é obrigatória',
      })
      hasErrors = true
    }

    if (Object.keys(errors).length > 0 || hasErrors) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Preencha todos os campos obrigatórios antes de submeter.',
        position: 'top-right',
      })

      return
    }

    try {
      // Re-check uniqueness on submit (normalize inputs first). This is a final client-side check
      // to avoid accidental duplicate submissions; the server is still authoritative.
      if (data?.user) {
        const email = data.user.email?.toString().trim().toLowerCase() || ''
        const phoneRaw = data.user.phoneNumber?.toString() || ''
        const phone = cleanPhone(phoneRaw)

        // check both candidates & employees to ensure cross-entity uniqueness
        const existsInCandidates = email ? await checkUnique(email) : false
        const existsInEmployees = email
          ? await checkEmployeeUnique(email)
          : false

        if (existsInCandidates || existsInEmployees) {
          setError('user.email' as any, {
            type: 'unique',
            message: 'Este email já se encontra em uso.',
          })
          notifications.show({
            title: 'Erro',
            color: 'red',
            message: 'Este email já se encontra em uso.',
            position: 'top-right',
          })

          return
        }

        // phone check (only when present)
        if (phone) {
          const existsPhoneInCandidates = await checkUnique(phone)
          const existsPhoneInEmployees = await checkEmployeeUnique(phone)
          if (existsPhoneInCandidates || existsPhoneInEmployees) {
            setError('user.phoneNumber' as any, {
              type: 'unique',
              message: 'Este número já se encontra em uso',
            })
            notifications.show({
              title: 'Erro',
              color: 'red',
              message: 'Este número já se encontra em uso',
              position: 'top-right',
            })

            return
          }
        }
      }

      startLoading()
      const result = await createCandidate(data)

      // If result contains validation errors from API
      if (result && typeof result === 'object' && !(result as any).id) {
        // Handle API validation errors
        const validationErrors = result as any
        // If server returned a raw DB detail string (eg. duplicate key), map it
        // to the correct field and clear the opposite field so we don't
        // mis-attribute the error (eg. email showing when phone is duplicate).
        if (validationErrors?.detail) {
          const detail = String(validationErrors.detail || '').toLowerCase()
          if (
            /phone_number/i.test(detail) ||
            /unique_user_phone/i.test(detail)
          ) {
            const m = detail.match(/\)=\((?:[^,]+),\s*([^)]+)\)/)
            const phoneFound = m?.[1]?.trim()
            const msg = phoneFound
              ? `Este número ${phoneFound} já está associado a outro candidato.`
              : 'Este número já se encontra em uso.'
            // clear any stale email error
            clearErrors && clearErrors('user.email')
            setError('user.phoneNumber' as any, {
              type: 'server',
              message: msg,
            })

            return
          }
          if (/email/i.test(detail) || /unique_user_email/i.test(detail)) {
            const m = detail.match(/\)=\((?:[^,]+),\s*([^)@\s]+@[^)\s]+)/)
            const emailFound = m?.[1]?.trim()
            const msg = emailFound
              ? `Este email ${emailFound} já está associado a outro candidato.`
              : 'Este email já se encontra em uso.'
            // clear any stale phone error
            clearErrors && clearErrors('user.phoneNumber')
            setError('user.email' as any, { type: 'server', message: msg })

            return
          }
        }
        if (validationErrors.user?.phone_number) {
          setError('user.phoneNumber', {
            type: 'server',
            message: validationErrors.user.phone_number[0],
          })
        }

        // Handle other potential validation errors
        Object.keys(validationErrors).forEach((key) => {
          if (key === 'user' && typeof validationErrors[key] === 'object') {
            Object.keys(validationErrors[key]).forEach((userKey) => {
              const errorMessages = validationErrors[key][userKey]
              if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                // Translate common backend messages to user-friendly Portuguese
                let msg = errorMessages[0]
                if (
                  userKey === 'email' &&
                  /already exists|in use|exists/i.test(msg)
                ) {
                  msg = 'Este email já se encontra em uso.'
                }

                setError(`user.${userKey}` as any, {
                  type: 'server',
                  message: msg,
                })
              }
            })
          }
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      stopLoading()
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
          setError={setError}
          errors={errors}
          clearErrors={clearErrors}
          watch={watch}
          action={'create'}
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
            disabled={!canSubmit}
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
