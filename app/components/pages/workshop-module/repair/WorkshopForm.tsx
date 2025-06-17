'use client'

import BackButton from '@/app/components/Button/BackButton'
import PrimaryButton from '@/app/components/Button/PrimaryButton'
import SecondaryButton from '@/app/components/Button/SecondaryButton'
import ExternalServicesRepairFormScreen from '@/app/components/Form/ExternalServicesRepairFormScreen'
import MainRepairFormScreen from '@/app/components/Form/MainRepairFormScreen'
import MaterialsRepairFormScreen from '@/app/components/Form/MaterialsRepairFormScreen'
import ServicesRepairFormScreen from '@/app/components/Form/ServicesRepairFormScreen'
import WorkforcesRepairFormScreen from '@/app/components/Form/WorkforcesRepairFormScreen'
import AreYouSureModal from '@/app/components/Modal/AreYouSureModal'
import ProgressBarWithNames from '@/app/components/ProgressBar/ProgressBarWithNames'
import Spinner from '@/app/components/Spinner/Spinner'
import Text from '@/app/components/Text/Text'
import { NEW_REPAIR_STEPS } from '@/app/constants'
import useCompanyWorkshopUsersQuery from '@/app/hooks/users/useCompanyWorkforceUsersQuery'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'
import useCreateRepair from '@/app/hooks/workshop/useCreateRepair'
import useEditRepair from '@/app/hooks/workshop/useEditRepair'
import { useGetRepairById } from '@/app/hooks/workshop/useGetRepairById'
import { VehicleSearch } from '@/app/types/vehicle'
import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { WorkshopMaterialObj } from '@/app/types/workshop/workshop-materials'
import { WorkshopServiceObj } from '@/app/types/workshop/workshop-services'
import { translateVehicleValue } from '@/utils'
import { notifications } from '@mantine/notifications'
import { Session } from 'next-auth'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type WorkshopFormProps = {
  action: 'create' | 'edit'
  session: Session | null
}

export default function WorkshopForm(props: WorkshopFormProps) {
  const { action, session } = props

  const searchParams = useSearchParams()
  const router = useRouter()

  const repairId = searchParams.get('uuid')
  if (!repairId && action === 'edit') {
    router.push('/workshop-module/repair')
  }

  const { repairItem, loading } = useGetRepairById(
    session?.accessToken || '',
    repairId ?? ''
  )

  const {
    register,
    unregister,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WorkshopFormData>({
    defaultValues: {
      vehicleUuid: '',
      nOr: '',
      appointmentDate: '',
      state: undefined,
      hasRequestedMaterial: undefined,
      services: [],
      materials: [],
      externalServices: [],
      workforces: [],
      createdAt: new Date().toISOString().split('T')[0],
    },
  })

  // Update form values when repairItem is loaded
  useEffect(() => {
    if (action === 'edit' && repairItem) {
      reset({
        vehicleUuid: repairItem.vehicle?.uuid || '',
        nOr: repairItem.nOr || '',
        appointmentDate: repairItem.appointmentDate || '',
        state: repairItem.state || undefined,
        hasRequestedMaterial: repairItem.hasRequestedMaterial || undefined,
        services: repairItem.services || [],
        materials: repairItem.materials || [],
        externalServices: repairItem.externalServices || [],
        workforces: repairItem.workforces || [],
        createdAt:
          repairItem.createdAt || new Date().toISOString().split('T')[0],
      })
    }
  }, [action, repairItem, reset])

  const formData = watch()

  const [canSubmit, setCanSubmit] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Modal states
  const [areYouSureModalOpen, setAreYouSureModalOpen] = useState(false)
  const [areYouSureModalServicesOpen, setAreYouSureModalServicesOpen] =
    useState(false)
  const [areYouSureModalWorkforcesOpen, setAreYouSureModalWorkforcesOpen] =
    useState(false)
  const [
    areYouSureModalExternalServicesOpen,
    setAreYouSureModalExternalServicesOpen,
  ] = useState(false)

  const [
    areYouSureCloseCreateRepairModal,
    setAreYouSureCloseCreateRepairModal,
  ] = useState(false)
  const [areYouSureCloseEditRepairModal, setAreYouSureCloseEditRepairModal] =
    useState(false)

  // Selected material and service states
  const [selectedMaterial, setSelectedMaterial] = useState<
    WorkshopMaterialObj | undefined
  >()
  const [selectedService, setSelectedService] = useState<
    WorkshopServiceObj | undefined
  >()
  const [selectedWorkforce, setSelectedWorkforce] = useState<
    WorkshopFormData['workforces'][number] | undefined
  >()
  const [selectedExternalService, setSelectedExternalService] = useState<
    WorkshopFormData['externalServices'][number] | undefined
  >()

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearch>()

  const [queryVehicle, setQueryVehicle] = useState(
    translateVehicleValue(selectedVehicle) || ''
  )

  //UseQueries
  const { users: companyWorkshopUsers } = useCompanyWorkshopUsersQuery()

  const { createRepair } = useCreateRepair()
  const { editRepair } = useEditRepair()
  const { startLoading, stopLoading } = useGlobalLoading()

  // UseEffects
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  useEffect(() => {
    if (repairItem) {
      setSelectedVehicle({
        uuid: repairItem.vehicle?.uuid || '',
        brand: repairItem.vehicle?.brand || '',
        model: repairItem.vehicle?.model || '',
        version: repairItem.vehicle?.version || '',
        licensePlate: repairItem.vehicle?.licensePlate || '',
      })
    }
  }, [repairItem])

  useEffect(() => {
    // Define mandatory fields
    const mandatoryFields = [
      formData?.vehicleUuid,
      formData?.nOr,
      formData?.appointmentDate,
      formData?.createdAt,
      formData?.state,
      formData?.hasRequestedMaterial,
    ]

    // Check if all mandatory fields are filled
    const allFieldsFilled = mandatoryFields?.every(
      (field) => field !== '' && field !== undefined && field !== null
    )

    // Validate materials
    const areMaterialsValid = formData?.materials?.every(
      (material) =>
        material.uuid &&
        material.buyPrice &&
        material.salePrice &&
        material.iva &&
        material.date &&
        material.numInvoice
    )

    // Validate services
    const areServicesValid = formData?.services?.every(
      (service) => service.uuid && service.date && service.typeService
    )

    // Validate external services
    const areExternalServicesValid = formData?.externalServices?.every(
      (externalService) =>
        externalService.uuid &&
        externalService.buyPrice &&
        externalService.salePrice &&
        externalService.date &&
        externalService.numInvoice &&
        externalService.iva
    )

    // Validate workforces
    const areWorkforcesValid = formData?.workforces?.every(
      (workforce) =>
        workforce.uuid &&
        workforce.date &&
        workforce.numHours &&
        workforce.hourPrice &&
        workforce.workerUuid
    )

    setCanSubmit(
      allFieldsFilled &&
        (formData?.materials?.length === 0 || areMaterialsValid) &&
        (formData?.services?.length === 0 || areServicesValid) &&
        (formData?.externalServices?.length === 0 ||
          areExternalServicesValid) &&
        (formData?.workforces?.length === 0 || areWorkforcesValid)
    )
  }, [formData])

  //functions
  const formSubmit = async (data: WorkshopFormData) => {
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
        if (action === 'edit' && repairId) {
          await editRepair(repairId, data)
        } else if (action === 'create') {
          await createRepair(data)
        } else {
          notifications.show({
            title: 'Erro',
            color: 'red',
            message: 'Ação inválida.',
            position: 'top-right',
          })
        }
      } catch (err) {
        console.log(err)
      } finally {
        stopLoading()
      }
    }
  }

  const handleBackToMenu = () => {
    if (!formData || Object.keys(formData).length === 0) {
      redirect('/workshop-module/repair')
    }
    if (action === 'edit') {
      setAreYouSureCloseEditRepairModal(true)
    } else {
      setAreYouSureCloseCreateRepairModal(true)
    }
  }

  return (
    <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center px-4 lg:px-0 lg:gap-8 gap-4 w-full">
      {/* Title */}
      <div className="flex w-full items-center gap-2">
        <div className="lg:w-1/3 lg:block hidden">
          <BackButton
            id="back-btn-create-repair"
            onClick={() => handleBackToMenu()}
            size="h-10 w-10"
          />
        </div>
        <Text
          header="h1"
          text={action === 'edit' ? 'Editar Reparação' : 'Criar Reparação'}
          styles="lg:w-1/3 w-full lg:text-[32px] text-[20px] lg:leading-[40px] leading-[25px] font-semibold text-digiblack self-center text-center"
        />
        <div className="lg:w-1/3 lg:block hidden"></div>
      </div>

      <ProgressBarWithNames
        currentStep={currentStep}
        totalSteps={NEW_REPAIR_STEPS}
        onClick={setCurrentStep}
        setCurrentStep={setCurrentStep}
      />
      {loading && action === 'edit' ? (
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
                <MainRepairFormScreen
                  formData={formData}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  queryVehicle={queryVehicle}
                  setQueryVehicle={setQueryVehicle}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
              ),
              2: (
                <WorkforcesRepairFormScreen
                  formData={formData}
                  setValue={setValue}
                  setAreYouSureModalOpen={setAreYouSureModalWorkforcesOpen}
                  setSelectedWorkforce={setSelectedWorkforce}
                  workers={companyWorkshopUsers}
                  selectedWorkforce={selectedWorkforce}
                />
              ),
              3: (
                <MaterialsRepairFormScreen
                  formData={formData}
                  setValue={setValue}
                  setAreYouSureModalOpen={setAreYouSureModalOpen}
                  setSelectedMaterial={setSelectedMaterial}
                  selectedMaterial={selectedMaterial}
                />
              ),
              4: (
                <ServicesRepairFormScreen
                  formData={formData}
                  setValue={setValue}
                  setAreYouSureModalOpen={setAreYouSureModalServicesOpen}
                  setSelectedService={setSelectedService}
                  selectedService={selectedService}
                />
              ),
              5: (
                <ExternalServicesRepairFormScreen
                  formData={formData}
                  setValue={setValue}
                  setAreYouSureModalOpen={
                    setAreYouSureModalExternalServicesOpen
                  }
                  setSelectedExternalService={setSelectedExternalService}
                  seletectedExternalService={selectedExternalService}
                />
              ),
            }[currentStep]
          }
          <div className="flex flex-row gap-4 lg:gap-8 w-full items-center justify-center lg:justify-end">
            <SecondaryButton
              text="Cancelar"
              id="cancelar"
              onClick={() => {
                if (action === 'edit') {
                  setAreYouSureCloseEditRepairModal(true)
                } else {
                  setAreYouSureCloseCreateRepairModal(true)
                }
              }}
            />

            <PrimaryButton
              text={action === 'edit' ? 'Atualizar' : 'Criar'}
              type="submit"
              size={'medium'}
              disabled={Object.keys(errors).length > 0 || !canSubmit}
              id="btn-repair-action"
              textDisabled="Preencha todos os campos obrigatórios"
            />
          </div>
        </form>
      )}
      {areYouSureModalOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalOpen}
          onClose={() => {
            setSelectedMaterial(undefined)
            setAreYouSureModalOpen(false)
          }}
          onConfirm={() => {
            const updatedMaterials = formData.materials.filter(
              (material) => material?.uuid !== selectedMaterial?.uuid
            )
            unregister(
              `materials.${formData.materials.findIndex((w) => w.uuid === selectedMaterial?.uuid)}`
            )

            setValue('materials', updatedMaterials)
            setSelectedMaterial(undefined)
            setAreYouSureModalOpen(false)
            notifications.show({
              title: 'Material Removido',
              color: 'green',
              message: 'Material removido com sucesso',
              position: 'top-right',
            })
          }}
          title="Remover Material"
          message="Tem a certeza que pretende remover este material?"
        />
      )}
      {areYouSureModalServicesOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalServicesOpen}
          onClose={() => {
            setSelectedService(undefined)
            setAreYouSureModalServicesOpen(false)
          }}
          onConfirm={() => {
            const updatedServices = formData.services.filter(
              (service) => service?.uuid !== selectedService?.uuid
            )
            unregister(
              `workforces.${formData.services.findIndex((w) => w.uuid === selectedService?.uuid)}`
            )

            setValue('services', updatedServices)
            setSelectedService(undefined)
            setAreYouSureModalServicesOpen(false)
            notifications.show({
              title: 'Serviço Removido',
              color: 'green',
              message: 'Serviço removido com sucesso',
              position: 'top-right',
            })
          }}
          title="Remover Serviço"
          message="Tem a certeza que pretende remover este serviço?"
        />
      )}
      {areYouSureModalWorkforcesOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalWorkforcesOpen}
          onClose={() => {
            setSelectedWorkforce(undefined)
            setAreYouSureModalWorkforcesOpen(false)
          }}
          onConfirm={() => {
            const updatedWorkforces = formData.workforces.filter(
              (workforce) => workforce?.uuid !== selectedWorkforce?.uuid
            )
            unregister(
              `workforces.${formData.workforces.findIndex((w) => w.uuid === selectedWorkforce?.uuid)}`
            )

            setValue('workforces', updatedWorkforces)
            setSelectedWorkforce(undefined)
            setAreYouSureModalWorkforcesOpen(false)
            notifications.show({
              title: "Mão d'Obra Removida",
              color: 'green',
              message: "Mão d'obra removida com sucesso",
              position: 'top-right',
            })
          }}
          title="Remover Mão d'Obra"
          message="Tem a certeza que pretende remover esta mão d'obra?"
        />
      )}
      {areYouSureModalExternalServicesOpen && (
        <AreYouSureModal
          isOpen={areYouSureModalExternalServicesOpen}
          onClose={() => {
            setSelectedExternalService(undefined)
            setAreYouSureModalExternalServicesOpen(false)
          }}
          onConfirm={() => {
            const updatedExternalServices = formData.externalServices.filter(
              (externalService) =>
                externalService?.uuid !== selectedExternalService?.uuid
            )
            unregister(
              `externalServices.${formData.externalServices.findIndex((w) => w.uuid === selectedExternalService?.uuid)}`
            )

            setValue('externalServices', updatedExternalServices)
            setSelectedExternalService(undefined)
            setAreYouSureModalExternalServicesOpen(false)
            notifications.show({
              title: 'Serviço Externo Removido',
              color: 'green',
              message: 'Serviço externo removido com sucesso',
              position: 'top-right',
            })
          }}
          title="Remover Serviço Externo"
          message="Tem a certeza que pretende remover este serviço externo?"
        />
      )}
      {areYouSureCloseCreateRepairModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseCreateRepairModal}
          onClose={() => {
            setAreYouSureCloseCreateRepairModal(false)
          }}
          onConfirm={() => redirect('/workshop-module/repair')}
          title="Sair da Criação de uma Nova Reparação"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
      {areYouSureCloseEditRepairModal && (
        <AreYouSureModal
          isOpen={areYouSureCloseEditRepairModal}
          onClose={() => {
            setAreYouSureCloseEditRepairModal(false)
          }}
          onConfirm={() => redirect('/workshop-module/repair')}
          title="Sair da Edição de uma Reparação"
          message="Tem a certeza que pretende sair?"
          primaryBtnText="Sair"
        />
      )}
    </div>
  )
}
