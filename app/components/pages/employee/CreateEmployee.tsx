'use client'

import BackButton from '@/app/components/Button/BackButton'
import PrimaryButton from '@/app/components/Button/PrimaryButton'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import ProgressBarWithNames from '@/app/components/ProgressBar/ProgressBarWithNames'
import Spinner from '@/app/components/Spinner/Spinner'
import Text from '@/app/components/Text/Text'
import {
  AVAILABILITY_STATUS,
  AVAILABLE_ROLES,
  EMPLOYEE_STATUS,
  NEW_EMPLOYEE_STEPS,
} from '@/app/constants'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'
import { useLanguagesQuery } from '@/app/hooks/utils/useLanguagesQuery'
import useCreateEmployee from '@/app/hooks/employees/useCreateEmployee'
import {
  CreateEmployeeData,
  EmployeeCertification,
} from '@/app/types/employee/employee'
import { notifications } from '@mantine/notifications'
import { Session } from 'next-auth'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import UserFormScreen from '../../Form/UserFormScreen'
import EmployeeFormScreen from '../../Form/EmployeeFormScreen'
import TechnicalEmployeeFormScreen from '../../Form/TechnicalEmployeeFormScreen'
import { EmployeeSkill } from '@/app/types/employee/skill'

type CreateEmployeeProps = {
  session: Session | null
}

export default function CreateEmployee(props: CreateEmployeeProps) {
  const { session } = props

  const {
    register,
    unregister,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateEmployeeData>({
    defaultValues: {
      user: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: AVAILABLE_ROLES.find((role) => role.value === 'EMPLOYEE')?.value,
        companyName: session?.user.companyName || '',
      },
      company: '',
      jobTitles: [],
      department: '',
      departmentName: '',
      nationalId: '',
      nif: '',
      socialSecurityNumber: '',
      collaborationStartDate: new Date(),
      gender: undefined,
      maritalStatus: undefined,
      transportAvailable: undefined,
      geographicAvailability: undefined,
      preferredWorkLocation: undefined,
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      educationQualification: undefined,
      languages: [],
      photoUrl: undefined,
      currentLocation: undefined,
      needsHousing: undefined,
      housingProvided: undefined,
      availabilityStatus: AVAILABILITY_STATUS.find(
        (status) => status.value === 'AVAILABLE'
      )?.value,
      status: EMPLOYEE_STATUS.find((status) => status.value === 'NO_CONTRACT')
        ?.value,
      workPermitExpiry: null,
      medicalCertificationExpiry: null,
      skills: [],
      certifications: [],
      address: '',
      postalCode: '',
      city: '',
      district: '',
      country: '',
    },
  })

  const formData = watch()

  const [canSubmit, setCanSubmit] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Modal states
  const [
    areYouSureCloseCreateEmployeeModal,
    setAreYouSureCloseCreateEmployeeModal,
  ] = useState(false)
  const [
    areYouSureModalCertificationOpen,
    setAreYouSureModalCertificationOpen,
  ] = useState(false)
  const [areYouSureModalSkillOpen, setAreYouSureModalSkillOpen] =
    useState(false)

  // Selectedskills and certifications states
  const [selectedSkill, setSelectedSkill] = useState<
    EmployeeSkill | undefined
  >()
  const [selectedCertification, setSelectedCertification] = useState<
    EmployeeCertification | undefined
  >()

  //UseQueries

  const {
    languages: availableLanguages,
    loading: loadingLanguages,
    error: languagesError,
  } = useLanguagesQuery()

  const { createEmployee, loading, error } = useCreateEmployee()
  const { startLoading, stopLoading } = useGlobalLoading()

  // UseEffects
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  useEffect(() => {
    // Define mandatory fields
    const mandatoryEmployeeFields = [
      formData?.jobTitles?.length > 0 ? formData?.jobTitles[0] : undefined,
      formData?.country,
    ]

    // Check if all mandatory fields are filled
    const isEmployeeDataValid = mandatoryEmployeeFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    // Validate user data
    const mandatoryUserFields = [
      formData?.user?.username,
      formData?.user?.email,
      formData?.user?.firstName,
      formData?.user?.lastName,
      formData?.user?.role,
      formData?.user?.companyName,
    ]

    const isUserDataValid = mandatoryUserFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    setCanSubmit(isEmployeeDataValid && isUserDataValid)
  }, [formData])

  //functions
  const formSubmit = async (data: CreateEmployeeData) => {
    if (Object.keys(errors).length > 0) {
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Preencha todos os campos obrigatórios antes de submeter.',
        position: 'top-right',
      })
    } else {
      console.log('Form Data to submit:', data)
      try {
        startLoading()
        console.log('start loading')
        await createEmployee(data)
      } catch (err) {
        console.log(err)
      } finally {
        stopLoading()
      }
    }
  }

  const handleBackToMenu = () => {
    if (!formData || Object.keys(formData).length === 0) {
      redirect('/dashboard?module=employees')
    }
    setAreYouSureCloseCreateEmployeeModal(true)
  }

  return (
    <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center px-4 lg:px-0 lg:gap-8 gap-4 w-full">
      {/* Title */}
      <div className="flex w-full items-center gap-2">
        <div className="lg:w-1/3 lg:block hidden">
          <BackButton
            id="back-btn-create-employee"
            onClick={() => handleBackToMenu()}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={'Criar Colaborador'}
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
      {loadingLanguages ? (
        <div className="flex justify-center self-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(formSubmit)}
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
                />
              ),
              2: (
                <EmployeeFormScreen
                  formData={formData}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  languagesAvailable={availableLanguages}
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
              onClick={() => {
                setAreYouSureCloseCreateEmployeeModal(true)
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
      )}
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
      {areYouSureCloseCreateEmployeeModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseCreateEmployeeModal}
          onClose={() => {
            setAreYouSureCloseCreateEmployeeModal(false)
          }}
          onConfirm={() => redirect('/dashboard?module=employees')}
          title="Sair da Criação de um Novo Colaborador"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
    </div>
  )
}
