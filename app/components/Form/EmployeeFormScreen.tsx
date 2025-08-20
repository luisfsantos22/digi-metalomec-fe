import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import { CreateEmployeeData } from '@/app/types/employee/employee'
import { Language } from '@/app/types/utils/language'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import FormDropdown from '../Dropdown/FormDropdown'
import {
  AVAILABILITY_STATUS,
  EDUCATIONAL_QUALIFICATION_OPTIONS,
  EMPLOYEE_STATUS,
  YES_NO_OPTIONS,
} from '@/app/constants'
import { useEffect, useState } from 'react'
import SearchInput from '../Input/SearchInput'
import useJobTitlesSearchQuery from '@/app/hooks/employees/useJobTitlesSearchQuery'
import FormDropdownMultiple from '../Dropdown/FormDropdownMultiple'
import Separator from '../Separator/Separator'
import CreateJobTitleModal from '../Modal/CreateJobTitleModal'

type EmployeeFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  languagesAvailable: Language[]
}

const EmployeeFormScreen = (props: EmployeeFormScreenProps) => {
  const { formData, register, setValue, errors, languagesAvailable } = props
  const {
    jobTitles,
    departmentName,
    collaborationStartDate,
    transportAvailable,
    geographicAvailability,
    preferredWorkLocation,
    needsHousing,
    housingProvided,
    availabilityStatus,
    status,
    workPermitExpiry,
    medicalCertificationExpiry,
    languages,
    educationQualification,
  } = formData

  // Job title search hook
  const {
    jobTitles: searchedJobTitles,
    search,
    setSearch,
    loading: jobTitlesLoading,
    error: jobTitlesError,
  } = useJobTitlesSearchQuery()

  // Selected job title object
  const [selectedJobTitle, setSelectedJobTitle] =
    useState<GenericJobTitle | null>(
      jobTitles?.length > 0 ? jobTitles[0] : null
    )
  const [showCreateJobTitleModal, setShowCreateJobTitleModal] = useState(false)
  const [jobTitleObject, setJobTitleObject] = useState<GenericJobTitle>({
    id: '',
    name: '',
    description: '',
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (jobTitles?.length > 0) {
      setSearch(jobTitles[0].name)
      setSelectedJobTitle(jobTitles[0])
    }
  }, [jobTitles])

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
      >
        <Row title="Informação Geral">
          <FormDropdown
            choices={EMPLOYEE_STATUS}
            placeholder="Selecione o Estado do Colaborador"
            selectedValue={status}
            setSelectedValue={(value) => {
              setValue('status', value as unknown as string)
            }}
            mandatory={true}
            label="Estado do Colaborador"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('status', { required: true })}
            width="lg:w-1/5 w-full"
          />
          <FormInput
            query={collaborationStartDate as unknown as string}
            setQuery={(e) =>
              setValue('collaborationStartDate', e as unknown as Date)
            }
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory={false}
            label="Data de Início de Colaboração"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/5 w-full"
          />
          <SearchInput
            query={search}
            setQuery={setSearch}
            placeholder="Pesquise ou crie um Cargo/Função"
            data={searchedJobTitles}
            dataIsLoading={jobTitlesLoading}
            error={
              jobTitlesError ??
              (errors.jobTitles ? 'Cargo/Função é obrigatório' : undefined)
            }
            label="Cargo/Função"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory={true}
            width="lg:w-1/5 w-full"
            value={selectedJobTitle?.name}
            setValue={(name) => {
              // If selected from search, set jobTitles to [id]
              const found = searchedJobTitles.find((jt) => jt.name === name)
              if (found) {
                setValue('jobTitles', [found])
                setSelectedJobTitle(found)
              } else {
                // If not found, treat as new creation (could trigger modal or API call)
                // For now, just set the name as selected
                // setValue('jobTitles', [name])
                // setSelectedJobTitle({ id: '', name, description: '' })
              }
            }}
            setSelectedObj={(obj) => {
              if (obj) {
                setValue('jobTitles', [obj])
                setSelectedJobTitle(obj)
              } else {
                setValue('jobTitles', [])
                setSelectedJobTitle(null)
              }
            }}
            setShowCreateModal={setShowCreateJobTitleModal}
            createText="Crie um novo Cargo/Função"
            source="JobTitle"
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
          />
          <FormInput
            query={departmentName ?? ''}
            setQuery={(e) => setValue('departmentName', String(e))}
            placeholder="Nome do Departamento"
            inputType="text"
            mandatory={false}
            label="Departamento"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('departmentName', { required: false })}
            width="lg:w-1/5 w-full"
          />
        </Row>
        <Separator />
        <Row title="Disponibilidade">
          <FormDropdown
            choices={AVAILABILITY_STATUS}
            placeholder="Selecione o Estado de Disponibilidade"
            selectedValue={availabilityStatus}
            setSelectedValue={(value) => {
              setValue('availabilityStatus', value as unknown as string)
            }}
            mandatory={true}
            label="Estado de Disponibilidade"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('availabilityStatus', { required: true })}
            error={
              errors.availabilityStatus
                ? 'Estado de Disponibilidade é obrigatório'
                : undefined
            }
          />
          <FormInput
            query={preferredWorkLocation ?? ''}
            setQuery={(e) => setValue('preferredWorkLocation', String(e))}
            placeholder="Lisboa e arredores"
            inputType="text"
            mandatory={false}
            label="Local de Trabalho Preferencial"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('preferredWorkLocation', { required: false })}
          />
          <FormInput
            query={geographicAvailability ?? ''}
            setQuery={(e) => setValue('geographicAvailability', String(e))}
            placeholder="Norte de Portugal"
            inputType="text"
            mandatory={false}
            label="Disponibilidade Geográfica"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('geographicAvailability', { required: false })}
          />
        </Row>
        <Row>
          <FormDropdown
            choices={YES_NO_OPTIONS}
            placeholder="Disponibilidade de Transporte"
            selectedValue={transportAvailable}
            setSelectedValue={(value) => {
              setValue('transportAvailable', value as unknown as boolean)
            }}
            mandatory={false}
            label="Disponibilidade de Transporte"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('transportAvailable', { required: false })}
          />
          <FormDropdown
            choices={YES_NO_OPTIONS}
            placeholder="Necessita de Alojamento"
            selectedValue={needsHousing}
            setSelectedValue={(value) => {
              setValue('needsHousing', value as unknown as boolean)
            }}
            mandatory={false}
            label="Necessita de Alojamento"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('needsHousing', { required: false })}
          />
          <FormDropdown
            choices={YES_NO_OPTIONS}
            placeholder="Alojamento Fornecido"
            selectedValue={housingProvided}
            setSelectedValue={(value) => {
              setValue('housingProvided', value as unknown as boolean)
            }}
            mandatory={false}
            label="Alojamento Fornecido"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('housingProvided', { required: false })}
          />
        </Row>
        <Separator />
        <Row title="Informação Adicional">
          <FormDropdownMultiple
            choices={languagesAvailable.map((lang) => ({
              label: lang.name,
              value: lang.id,
            }))}
            placeholder="Selecione as Línguas Faladas"
            selectedValues={languages ? languages.map((l) => l.id) : []}
            setSelectedValues={(ids) => {
              const selectedLangs = languagesAvailable.filter((lang) =>
                ids.includes(lang.id)
              )
              // Map Language to UserLanguage with default proficiency
              const userLanguages = selectedLangs.map((lang) => ({
                ...lang,
                proficiency: 'Fluent', // Default, can be changed as needed
              }))
              setValue('languages', userLanguages)
            }}
            mandatory={false}
            label="Línguas Faladas"
            dropdownPosition="top"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('languages', { required: false })}
          />
          <FormInput
            query={workPermitExpiry as unknown as string}
            setQuery={(e) => setValue('workPermitExpiry', e as unknown as Date)}
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory={false}
            label="Data de Expiração do Visto de Trabalho"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('workPermitExpiry', { required: false })}
          />
          <FormInput
            query={medicalCertificationExpiry as unknown as string}
            setQuery={(e) =>
              setValue('medicalCertificationExpiry', e as unknown as Date)
            }
            placeholder="dd/mm/aaaa"
            inputType="date"
            mandatory={false}
            label="Data de Expiração da Certificação Médica"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('medicalCertificationExpiry', { required: false })}
          />
          <FormDropdown
            choices={EDUCATIONAL_QUALIFICATION_OPTIONS}
            selectedValue={educationQualification}
            setSelectedValue={(value) =>
              setValue('educationQualification', value as unknown as string)
            }
            mandatory={false}
            dropdownPosition="top"
            placeholder="Selecione a qualificação educacional"
            label="Qualificação Educacional"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('educationQualification', { required: false })}
          />
        </Row>
      </ContainerCard>
      {showCreateJobTitleModal && (
        <CreateJobTitleModal
          isOpen={showCreateJobTitleModal}
          onClose={() => {
            setShowCreateJobTitleModal(false)
            setJobTitleObject({ id: '', name: '', description: '' })
          }}
          onConfirm={() => {
            setShowCreateJobTitleModal(false)
            setValue('jobTitles', [jobTitleObject])
            setSelectedJobTitle(jobTitleObject)
            setSearch(jobTitleObject?.name ?? '')
            setIsDropdownOpen(false)
          }}
          setNewJobTitle={setJobTitleObject}
          newJobTitle={jobTitleObject}
        />
      )}
    </>
  )
}

export default EmployeeFormScreen
