import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
} from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import FormDropdown from '../Dropdown/FormDropdown'
import { AVAILABILITY_STATUS } from '@/app/constants'
import Separator from '../Separator/Separator'
import SearchInput from '../Input/SearchInput'
import useJobTitlesSearchQuery from '@/app/hooks/employees/useJobTitlesSearchQuery'
import { useEffect, useState } from 'react'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import CreateJobTitleModal from '../Modal/CreateJobTitleModal'
import { CreateCandidateData } from '@/app/types/candidate/candidate'

type CandidateFormScreenProps = {
  formData: CreateCandidateData
  register: UseFormRegister<CreateCandidateData>
  setValue: UseFormSetValue<CreateCandidateData>
  errors: FieldErrors<CreateCandidateData>
  clearErrors?: UseFormClearErrors<CreateCandidateData>
}

const CandidateFormScreen = (props: CandidateFormScreenProps) => {
  const { formData, register, setValue, errors, clearErrors } = props

  const [selectedJobTitle, setSelectedJobTitle] =
    useState<GenericJobTitle | null>(null)
  const [showCreateJobTitleModal, setShowCreateJobTitleModal] = useState(false)
  const [jobTitleObject, setJobTitleObject] = useState<GenericJobTitle>({
    id: '',
    name: '',
    description: '',
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const {
    user: { email, firstName, lastName, phoneNumber } = {},
    availabilityStatus,
    geographicAvailability,
    jobTitles,
  } = formData

  const {
    jobTitles: searchedJobTitles,
    search,
    setSearch,
    loading: jobTitlesLoading,
    error: jobTitlesError,
  } = useJobTitlesSearchQuery()

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
        <Row title="Informação Básica">
          <FormInput
            query={firstName}
            setQuery={(e) => setValue('user.firstName', e as unknown as string)}
            error={errors.user?.firstName ? 'Nome é obrigatório' : undefined}
            placeholder="José"
            inputType="text"
            mandatory={true}
            label="Nome"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.firstName', { required: true })}
          />
          <FormInput
            query={lastName}
            setQuery={(e) => setValue('user.lastName', e as unknown as string)}
            error={errors.user?.lastName ? 'Apelido é obrigatório' : undefined}
            placeholder="Silva"
            inputType="text"
            mandatory={true}
            label="Apelido"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.lastName', { required: true })}
          />
          <FormInput
            query={email?.split('@')[0]}
            setQuery={() => {}}
            placeholder="jose.carlos"
            inputType="text"
            mandatory={true}
            disabled
            label="Username (gerado automaticamente)"
            labelStyles="text-digiblack1420-semibold flex gap-1"
          />
        </Row>
        <Separator />
        <Row title="Contatos">
          <FormInput
            query={email}
            setQuery={(e) => setValue('user.email', e as unknown as string)}
            error={errors.user?.email ? 'Email é obrigatório' : undefined}
            placeholder="jose.carlos@email.com"
            inputType="email"
            mandatory={true}
            label="Email"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.email', { required: true })}
            width="lg:w-3/4 w-full"
          />
          <FormInput
            query={phoneNumber ? phoneNumber : ''}
            setQuery={(e) => setValue('user.phoneNumber', e as string)}
            placeholder="912 345 678"
            inputType="tel"
            mandatory={true}
            label="Número de Telemóvel"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/4 w-full"
          />
        </Row>
        <Separator />
        <Row title="Informação Profissional">
          <FormDropdown
            label="Disponibilidade"
            choices={AVAILABILITY_STATUS}
            placeholder="Selecione a sua disponibilidade"
            selectedValue={availabilityStatus ?? ''}
            setSelectedValue={(e) =>
              setValue('availabilityStatus', e as unknown as string)
            }
            error={
              errors.availabilityStatus
                ? 'Disponibilidade é obrigatória'
                : undefined
            }
            mandatory={true}
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/3 w-full"
          />
          <FormInput
            query={geographicAvailability}
            setQuery={(e) =>
              setValue('geographicAvailability', e as unknown as string)
            }
            placeholder="Lisboa"
            inputType="text"
            mandatory={true}
            label="Disponibilidade Geográfica"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('geographicAvailability', { required: false })}
            width="lg:w-1/3 w-full"
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
            width="lg:w-1/3 w-full"
            value={search}
            setValue={(id) => {
              const found = searchedJobTitles.find((jt) => jt.id === id)
              if (found) {
                setValue('jobTitles', [found])
                setSelectedJobTitle(found)
              }
            }}
            setSelectedObj={(obj) => {
              if (obj) {
                setValue('jobTitles', [obj])
                setSelectedJobTitle(obj)
              } else {
                setValue('jobTitles', [])
                setSelectedJobTitle(null)
                setSearch('')
              }
            }}
            seletectedObjValue={selectedJobTitle ? selectedJobTitle.name : ''}
            setShowCreateModal={setShowCreateJobTitleModal}
            createText="Crie um novo Cargo/Função"
            source="JobTitle"
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
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
          onConfirm={(createdJobTitle) => {
            setShowCreateJobTitleModal(false)
            setValue('jobTitles', [createdJobTitle])
            setSelectedJobTitle(createdJobTitle)
            setSearch(createdJobTitle?.name ?? '')
            setIsDropdownOpen(false)
          }}
          setNewJobTitle={setJobTitleObject}
          newJobTitle={jobTitleObject}
        />
      )}
    </>
  )
}

export default CandidateFormScreen
