'use client'

import BackButton from '@/app/components/Button/BackButton'
import PrimaryButton from '@/app/components/Button/PrimaryButton'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import ProgressBarWithNames from '@/app/components/ProgressBar/ProgressBarWithNames'
import Spinner from '@/app/components/Spinner/Spinner'
import Text from '@/app/components/Text/Text'
import { NEW_EMPLOYEE_STEPS } from '@/app/constants'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'
import { useLanguagesQuery } from '@/app/hooks/utils/useLanguagesQuery'
import {
  CreateEmployeeData,
  EmployeeCertification,
} from '@/app/types/employee/employee'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import UserFormScreen from '../../Form/UserFormScreen'
import EmployeeFormScreen from '../../Form/EmployeeFormScreen'
import TechnicalEmployeeFormScreen from '../../Form/TechnicalEmployeeFormScreen'
import { EmployeeSkill } from '@/app/types/employee/skill'
import useGetEducationalQualifications from '@/app/hooks/employees/useGetEducationalQualifications'
import { useAtom } from 'jotai'
import { mainPageActiveTab } from '@/app/atoms'
import useGetEmployee from '@/app/hooks/employees/useGetEmployee'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEditEmployee } from '@/app/hooks/employees/useUpdateEmployee'

export default function EditEmployee() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const employeeId = searchParams.get('id') || undefined

  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [canSubmit, setCanSubmit] = useState(false)

  // Modal states
  const [
    areYouSureCloseEditEmployeeModal,
    setAreYouSureCloseEditEmployeeModal,
  ] = useState(false)
  const [
    areYouSureModalCertificationOpen,
    setAreYouSureModalCertificationOpen,
  ] = useState(false)
  const [areYouSureModalSkillOpen, setAreYouSureModalSkillOpen] =
    useState(false)

  // Selected skills and certifications states
  const [selectedSkill, setSelectedSkill] = useState<
    EmployeeSkill | undefined
  >()
  const [selectedCertification, setSelectedCertification] = useState<
    EmployeeCertification | undefined
  >()

  // Fetch employee data
  const {
    employee,
    loading: loadingEmployee,
    error: errorEmployee,
  } = useGetEmployee(employeeId ?? '')

  // UseQueries
  const {
    languages: availableLanguages,
    loading: loadingLanguages,
    error: languagesError,
  } = useLanguagesQuery()

  const {
    qualifications,
    loading: loadingEducationalQualifications,
    error: educationalQualificationsError,
  } = useGetEducationalQualifications()

  const { editEmployee, loading, error } = useEditEmployee()
  const { startLoading, stopLoading } = useGlobalLoading()

  // Form setup
  const {
    register,
    unregister,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    clearErrors,
    reset,
  } = useForm<CreateEmployeeData>({
    defaultValues: employee as CreateEmployeeData | undefined,
    mode: 'onChange', // Enable real-time validation
  })

  const formData = watch()

  useEffect(() => {
    setTabActive('employees')
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  useEffect(() => {
    if (employee) {
      reset(employee as CreateEmployeeData)
    }
  }, [employee, reset])

  useEffect(() => {
    // Define mandatory fields
    const mandatoryEmployeeFields = [
      formData?.jobTitles?.length > 0 ? formData?.jobTitles[0] : undefined,
      formData?.country,
    ]
    const isEmployeeDataValid = mandatoryEmployeeFields?.every(
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

    setCanSubmit(isEmployeeDataValid && isUserDataValid)
  }, [formData])

  //functions
  const onValidSubmit = async (data: CreateEmployeeData) => {
    await formSubmit(data)
  }

  const onInvalidSubmit = async (errors: any) => {
    // Show specific error messages
    const errorMessages: string[] = []

    // Check user errors
    if (errors.user?.email) errorMessages.push('Email é obrigatório')
    if (errors.user?.firstName) errorMessages.push('Nome é obrigatório')
    if (errors.user?.lastName) errorMessages.push('Apelido é obrigatório')
    if (errors.user?.phoneNumber) errorMessages.push('Número de telemóvel é obrigatório ou inválido')

    // Check employee errors
    if (errors.country) errorMessages.push('País é obrigatório')
    if (!formData?.jobTitles?.length) errorMessages.push('Pelo menos um cargo é obrigatório')

    // Check emergency contact errors
    if (errors.emergencyContact?.name) errorMessages.push('Nome do contato de emergência é obrigatório')
    if (errors.emergencyContact?.phone) errorMessages.push('Telemóvel do contato de emergência é obrigatório ou inválido')
    if (errors.emergencyContact?.relationship) errorMessages.push('Relação do contato de emergência é obrigatória')

    // Check other validation errors
    if (errors.nif) errorMessages.push('NIF deve ter exatamente 9 dígitos')
    if (errors.nationalId) errorMessages.push('CC deve ter exatamente 8 dígitos')
    if (errors.socialSecurityNumber) errorMessages.push('Número de Segurança Social deve ter exatamente 11 dígitos')
    if (errors.europeanHealthInsuranceCard) errorMessages.push('Cartão Europeu de Seguro de Doença deve ter exatamente 20 dígitos')
    if (errors.postalCode) errorMessages.push('Código Postal deve ter formato XXXX-XXX')

    const message = errorMessages.length > 0
      ? errorMessages.slice(0, 3).join(', ') + (errorMessages.length > 3 ? '...' : '')
      : 'Preencha todos os campos obrigatórios corretamente antes de submeter.'

    notifications.show({
      title: 'Erro de Validação',
      color: 'red',
      message,
      position: 'top-right',
    })
  }

  const formSubmit = async (data: CreateEmployeeData) => {
    // Preprocess emergencyContact: if all fields are blank, set to null
    if (data.emergencyContact) {
      const { name, phone, relationship } = data.emergencyContact
      if (
        (!name || name === '') &&
        (!phone || phone === '') &&
        (!relationship || relationship === '')
      ) {
        data.emergencyContact = undefined
      }
    }
    try {
      startLoading()
      const result = await editEmployee(employeeId, data)

      if (result?.id) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Colaborador editado com sucesso!',
          position: 'top-right',
        })
        // Small delay to show the notification before redirecting
        setTimeout(() => {
          router.push(`/employee/details/${result.id}/`)
        }, 1500)
      }
      stopLoading()
    } catch (err) {
      console.log(err)
      stopLoading()
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Ocorreu um erro ao editar o colaborador. Tente novamente.',
        position: 'top-right',
      })
    }
  }

  if (
    !employeeId ||
    loadingEmployee ||
    loadingLanguages ||
    loadingEducationalQualifications
  ) {
    return (
      <div className="flex justify-center self-center items-center p-4 h-full ">
        <Spinner />
      </div>
    )
  }

  if (errorEmployee) {
    // Optionally show an error message instead of redirecting immediately
    return (
      <Text
        text={`Erro: ${errorEmployee}`}
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
            onClick={() => setAreYouSureCloseEditEmployeeModal(true)}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={'Editar Colaborador'}
          styles="lg:w-1/3 w-full lg:text-[32px] text-[20px] lg:leading-[40px] leading-[25px] font-semibold text-digiblack self-center text-center"
        />
        <div className="lg:w-1/3 lg:block hidden"></div>
      </div>
      <ProgressBarWithNames
        currentStep={currentStep}
        totalSteps={NEW_EMPLOYEE_STEPS}
        onClick={setCurrentStep}
        setCurrentStep={setCurrentStep}
      />
      <form
        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
        className="w-full flex flex-col gap-4"
      >
        {
          {
            1: (
              <UserFormScreen
                formData={formData}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
              />
            ),
            2: (
              <EmployeeFormScreen
                formData={formData}
                register={register}
                setValue={setValue}
                errors={errors}
                languagesAvailable={availableLanguages}
                educationalQualificationsAvailable={qualifications}
              />
            ),
            3: (
              <TechnicalEmployeeFormScreen
                formData={formData}
                register={register}
                setValue={setValue}
                errors={errors}
                setAreYouSureModalOpenCertificate={
                  setAreYouSureModalCertificationOpen
                }
                setAreYouSureModalOpenSkill={setAreYouSureModalSkillOpen}
                selectedCertification={selectedCertification}
                setSelectedCertification={setSelectedCertification}
                selectedSkill={selectedSkill}
                setSelectedSkill={setSelectedSkill}
              />
            ),
          }[currentStep]
        }
        <div className="flex flex-row gap-4 lg:gap-8 w-full items-center justify-center lg:justify-end">
          <SecondaryButton
            text="Cancelar"
            id="cancelar"
            onClick={() => setAreYouSureCloseEditEmployeeModal(true)}
          />
          <PrimaryButton
            text={'Editar'}
            type="submit"
            size={'medium'}
            disabled={!isValid || !canSubmit}
            id="btn-edit-employee-action"
            textDisabled="Preencha todos os campos obrigatórios"
          />
        </div>
      </form>
      {areYouSureModalSkillOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalSkillOpen}
          onClose={() => {
            setSelectedSkill(undefined)
            setAreYouSureModalSkillOpen(false)
          }}
          onConfirm={() => {
            const updatedSkills = formData?.skills?.filter(
              (skill) => skill?.id !== skill?.id
            )
            {
              const skillIndex = formData?.skills?.findIndex(
                (w: any) => w.id === selectedSkill
              )
              if (typeof skillIndex === 'number' && skillIndex !== -1) {
                unregister(`skills.${skillIndex}`)
              }
            }
            setValue('skills', updatedSkills)
            setSelectedSkill(undefined)
            setAreYouSureModalSkillOpen(false)
            notifications.show({
              title: 'Skill Removida',
              color: 'green',
              message: 'Skill removida com sucesso',
              position: 'top-right',
            })
          }}
          title="Remover Skill"
          message="Tem a certeza que pretende remover esta skill?"
        />
      )}
      {areYouSureModalCertificationOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalCertificationOpen}
          onClose={() => {
            setSelectedCertification(undefined)
            setAreYouSureModalCertificationOpen(false)
          }}
          onConfirm={() => {
            const updatedCertifications = formData?.certifications?.filter(
              (certification) => certification?.id !== selectedCertification?.id
            )
            {
              const certificationIndex = formData?.certifications?.findIndex(
                (w: any) => w.id === selectedCertification
              )
              if (
                typeof certificationIndex === 'number' &&
                certificationIndex !== -1
              ) {
                unregister(`certifications.${certificationIndex}`)
              }
            }
            setValue('certifications', updatedCertifications)
            {
              const skillIndex = formData?.skills?.findIndex(
                (w: any) => w.id === selectedSkill
              )
              if (typeof skillIndex === 'number' && skillIndex !== -1) {
                unregister(`skills.${skillIndex}`)
              }
            }
            setSelectedCertification(undefined)
            setAreYouSureModalCertificationOpen(false)
            notifications.show({
              title: 'Certificação Removida',
              color: 'green',
              message: 'Certificação removida com sucesso',
              position: 'top-right',
            })
          }}
          title="Remover Certificação"
          message="Tem a certeza que pretende remover esta certificação?"
        />
      )}
      {areYouSureCloseEditEmployeeModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseEditEmployeeModal}
          onClose={() => {
            setAreYouSureCloseEditEmployeeModal(false)
          }}
          onConfirm={() => {
            // Redirect to dashboard or previous page
            window.location.href = '/dashboard?module=employees'
          }}
          title="Sair da Edição de um Colaborador"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
    </div>
  )
}
