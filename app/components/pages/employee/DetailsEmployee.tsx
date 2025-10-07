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
import { EMPLOYEE_DETAILS_TABS } from '@/app/constants'
import GeneralInfoEmployee from './GeneralInfoEmployee'
import PrimaryButton from '../../Button/PrimaryButton'
import { useActivationEmployee } from '@/app/hooks/employees/useActivationEmployee'
import { classNames } from 'utils'
import CertificationsEmployee from './CertificationsEmployee'
import SkillsEmployee from './SkillsEmployee'

type DetailsEmployeeProps = {
  session: Session | null
  employeeId: string
}

export default function DetailsEmployee(props: DetailsEmployeeProps) {
  const { session, employeeId } = props

  const router = useRouter()
  const accessToken = session?.accessToken

  const [tabActive, setTabActive] = useAtom(mainPageActiveTab)

  const [activationTrigger, setActivationTrigger] = useState(0)
  const { loading, error, employee } = useGetEmployee(employeeId ?? '', [
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
  const [tab, setTab] = useState<string>(
    EMPLOYEE_DETAILS_TABS?.find((t) => t.value === 'general')?.value ||
      EMPLOYEE_DETAILS_TABS[0]?.value
  )

  useEffect(() => {
    setTabActive('employees')
    if (!employeeId || error) {
      router.push('/dashboard?module=employees')
    }
  }, [employeeId, error, router, setTabActive])

  // Prevent hydration mismatch: only render after client-side data is ready
  if (!employeeId || loading) {
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
    redirect('/dashboard?module=employees')
  }

  const handleDelete = async (id: string, token: string) => {
    await deleteEmployee(id, token)
    setAreYouSureToDeleteOpen(false)
    router.push('/dashboard?module=employees')
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
            id="back-btn-create-employee"
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
                {employee?.user?.fullName ?? ''}
              </span>
            </span>
          }
          styles="lg:w-2/3 w-full lg:text-[32px] text-[20px] lg:leading-[40px] leading-[25px] font-semibold text-digiblack self-center text-center"
        />
        <div className="lg:w-1/3 w-full gap-2 flex items-center lg:justify-end justify-center">
          <PrimaryButton
            id="handle-activate-employee"
            onClick={() => {
              setAreYouSureToActivateOpen(true)
            }}
            text={employee?.user?.isActive ? 'Desativar' : 'Ativar'}
            type="button"
            extraStyles={
              employee?.user?.isActive
                ? '!bg-digibrown hover:!bg-digibrown/60 !text-white'
                : '!bg-digigreen hover:!bg-digigreen/60 !text-white'
            }
          />
          <EditButton
            id={`edit-${employee?.id}`}
            onClick={() => {
              router.push(`/employee/edit?id=${employee?.id}`)
            }}
            tooltipText="Editar Colaborador"
            hasTooltip
            typeBtn="text"
            extraStyles="bg-digiorange hover:bg-digiorange/60"
          />
          <DeleteButton
            id={`delete-${employee?.id}`}
            onClick={() => {
              setAreYouSureToDeleteOpen(true)
            }}
            tooltipText="Remover Colaborador"
            hasTooltip
            typeBtn="text"
            extraStyles="bg-digired hover:bg-digired/60"
          />
        </div>
      </div>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles={classNames(
          employee?.user?.isActive ? 'border-digigreen' : 'border-digibrown',
          'flex flex-col gap-4 w-full rounded-xl border'
        )}
        withTabs
        tabs={EMPLOYEE_DETAILS_TABS}
        activeTab={tab}
        onTabChange={setTab}
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
        ) : tab === 'general' ? (
          <GeneralInfoEmployee employee={employee} />
        ) : tab === 'certifications' ? (
          <CertificationsEmployee
            employeeId={employee?.id}
            certifications={employee?.certifications}
            setActivationTrigger={setActivationTrigger}
          />
        ) : tab === 'technicalQualifications' ? (
          <SkillsEmployee
            employeeId={employee?.id}
            skills={employee?.skills}
            setActivationTrigger={setActivationTrigger}
            companyId={employee?.user?.company}
          />
        ) : null}
      </ContainerCard>

      {areYouSureToDeleteOpen && (
        <AreYouSureModal
          isOpen={areYouSureToDeleteOpen}
          title="Remover Colaborador"
          message={`Tem a certeza que deseja remover o colaborador selecionado (${employee?.user?.fullName})?`}
          onConfirm={() => {
            if (employeeId && accessToken) {
              handleDelete(employeeId, accessToken)
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
          title={`${employee?.user?.isActive ? 'Desativar' : 'Ativar'} Colaborador`}
          message={`Tem a certeza que deseja ${employee?.user?.isActive ? 'desativar' : 'ativar'} o colaborador selecionado (${employee?.user?.fullName})?`}
          onConfirm={() => {
            if (employeeId && accessToken) {
              handleActivation(
                employeeId,
                employee?.user?.isActive ? false : true,
                accessToken
              )
            }
          }}
          onClose={() => {
            setAreYouSureToActivateOpen(false)
          }}
          primaryBtnText={employee?.user?.isActive ? 'Desativar' : 'Ativar'}
        />
      )}
    </div>
  )
}
