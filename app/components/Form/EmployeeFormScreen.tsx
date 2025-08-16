import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Text from '../Text/Text'
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
import { useState } from 'react'
import FormDropdownMultiple from '../Dropdown/FormDropdownMultiple'
import Separator from '../Separator/Separator'

type EmployeeFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  languagesAvailable: Language[]
  jobTitlesAvailable: GenericJobTitle[]
}

const EmployeeFormScreen = (props: EmployeeFormScreenProps) => {
  const {
    formData,
    register,
    setValue,
    errors,
    languagesAvailable,
    jobTitlesAvailable,
  } = props
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

  return (
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
          query={
            collaborationStartDate ? collaborationStartDate.toString() : ''
          }
          setQuery={(e) =>
            setValue('collaborationStartDate', e ? new Date(e) : undefined)
          }
          placeholder="dd/mm/aaaa"
          inputType="date"
          mandatory={false}
          label="Data de Início de Colaboração"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/5 w-full"
        />
        <FormDropdown
          choices={jobTitlesAvailable?.map((job) => ({
            label: job.name,
            value: job.id,
          }))}
          placeholder="Selecione o Cargo/Função"
          selectedValue={jobTitles[0]}
          setSelectedValue={(value) => {
            setValue('jobTitles', value as unknown as string[])
          }}
          mandatory={true}
          label="Cargo/Função"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('jobTitles', { required: true })}
          width="lg:w-1/5 w-full"
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
          {...register('geographicAvailability', { required: true })}
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
            setValue('languages', selectedLangs)
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
          placeholder="Selecione a qualificação educacional"
          label="Qualificação Educacional"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('educationQualification', { required: false })}
        />
      </Row>
    </ContainerCard>
  )
}

export default EmployeeFormScreen
