import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import SearchInput from '../Input/SearchInput'
import useVehiclesSearchQuery from '@/app/hooks/vehicles/useVehiclesSearchQuery'
import { useEffect } from 'react'
import Text from '../Text/Text'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import { WorkshopStatus } from '@/app/enum'
import FormDropdown from '../Dropdown/FormDropdown'
import { translateVehicleValue } from '@/utils'
import { VehicleSearch } from '@/app/types/vehicle'

type MainRepairFormScreenProps = {
  formData: WorkshopFormData
  register: UseFormRegister<WorkshopFormData>
  setValue: UseFormSetValue<WorkshopFormData>
  errors: FieldErrors<WorkshopFormData>
  queryVehicle: string
  setQueryVehicle: (value: string) => void
  selectedVehicle: VehicleSearch | undefined
  setSelectedVehicle: (vehicle: VehicleSearch | undefined) => void
}

const MainRepairFormScreen = (props: MainRepairFormScreenProps) => {
  const {
    formData,
    register,
    setValue,
    errors,
    queryVehicle,
    setQueryVehicle,
    selectedVehicle,
    setSelectedVehicle,
  } = props
  const {
    vehicleUuid,
    nOr,
    appointmentDate,
    createdAt,
    state,
    hasRequestedMaterial,
  } = formData

  const { vehicles, setSearch, loading } = useVehiclesSearchQuery()

  const workshopStatusOptions = Object.entries(WorkshopStatus).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  )

  const hasRequestedMaterialOptions = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ]

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (queryVehicle?.length > 0) {
        setSearch(queryVehicle) // Update the search query in the hook
      }
    }, 300) // 300ms debounce delay

    return () => clearTimeout(timeoutId) // Cleanup timeout on unmount or queryVehicle change
  }, [queryVehicle])

  return (
    <ContainerCard
      padding="lg:p-8 p-4"
      styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
    >
      <Text
        text="Dados Gerais da Reparação"
        styles="text-digiblack2025-semibold"
      />
      <Row>
        <div className="flex lg:flex-row flex-col lg:gap-4 gap-1 w-full">
          <SearchInput
            placeholder="Ex: Audi A3 ou 12-AA-12"
            data={vehicles}
            dataIsLoading={loading}
            query={
              selectedVehicle
                ? translateVehicleValue(selectedVehicle)
                : queryVehicle
            }
            setQuery={setQueryVehicle}
            disabled={false}
            inputType="text"
            mandatory
            {...register('vehicleUuid', { required: true })}
            setValue={(value) => setValue('vehicleUuid', value)}
            error={
              errors.vehicleUuid
                ? 'Escolha do veículo é obrigatória'
                : undefined
            }
            width="lg:w-1/3 w-full"
            label="Veículo a Reparar"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            value={vehicleUuid}
            setSelectedObj={setSelectedVehicle}
          />
          {vehicleUuid && (
            <div className="flex flex-1 items-center gap-2 lg:mt-6 w-full">
              <Text
                text="Veículo selecionado"
                styles="text-selected-form"
              />
            </div>
          )}
        </div>
      </Row>
      <Row>
        <FormInput
          query={nOr}
          setQuery={(e) => setValue('nOr', e)}
          error={
            errors.nOr
              ? 'Número de Ordem de Reparação é obrigatório'
              : undefined
          }
          placeholder="2025/xxxx"
          inputType="text"
          mandatory={true}
          label="Número de Ordem de Reparação (NOR)"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('nOr', { required: true })}
        />
        <FormInput
          query={createdAt || ''}
          setQuery={(e) => setValue('createdAt', e)}
          error={
            errors.createdAt
              ? 'Data de Criação da Reparação é obrigatória'
              : undefined
          }
          placeholder="dd/mm/aaaa"
          inputType="date"
          mandatory={true}
          label="Data de Criação da Reparação"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('createdAt', { required: true })}
        />
        <FormInput
          query={appointmentDate}
          setQuery={(e) => setValue('appointmentDate', e)}
          error={errors.appointmentDate ? 'Data de Agendamento' : undefined}
          placeholder="dd/mm/aaaa"
          inputType="date"
          mandatory={true}
          label="Data de Agendamento"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('appointmentDate', { required: true })}
        />
      </Row>
      <Row>
        <FormDropdown
          choices={workshopStatusOptions || []}
          placeholder="Escolha o estado da reparação..."
          selectedValue={state}
          setSelectedValue={(value) => {
            const foundOption = workshopStatusOptions?.find(
              (option) => option.value === value
            )
            if (foundOption) {
              setValue('state', foundOption.value as WorkshopStatus)
            }
          }}
          label="Estado da Reparação"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          error={errors.state ? 'Estado da Reparação é obrigatório' : undefined}
          mandatory
          width="lg:w-1/3 w-full"
          {...register('state', { required: true })}
        />
        <FormDropdown
          choices={hasRequestedMaterialOptions || []}
          placeholder="O material foi solicitado?"
          selectedValue={hasRequestedMaterial?.toString()}
          setSelectedValue={(value) =>
            setValue(
              'hasRequestedMaterial',
              hasRequestedMaterialOptions.find(
                (option) => option.value === value
              )?.value as unknown as boolean
            )
          }
          label="Material Solicitado"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          error={
            errors.hasRequestedMaterial
              ? 'Escolha se o material foi solicitado'
              : undefined
          }
          mandatory
          width="lg:w-1/3 w-full"
          {...register('hasRequestedMaterial', { required: true })}
        />
      </Row>
    </ContainerCard>
  )
}

export default MainRepairFormScreen
