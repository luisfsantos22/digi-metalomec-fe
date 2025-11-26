import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
  UseFormWatch,
  UseFormSetError,
} from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import FormDropdown from '../Dropdown/FormDropdown'
import { AVAILABILITY_STATUS } from '@/app/constants'
import Separator from '../Separator/Separator'
import SearchInput from '../Input/SearchInput'
import {
  patterns as validatorsPatterns,
  messages as validatorsMessages,
  cleanPhone,
} from '@/app/validators/validation'
import useCheckUnique from '@/app/hooks/utils/useCheckUnique'
import useJobTitlesSearchQuery from '@/app/hooks/employees/useJobTitlesSearchQuery'
import { useEffect, useState } from 'react'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import CreateJobTitleModal from '../Modal/CreateJobTitleModal'
import { CreateCandidateData } from '@/app/types/candidate/candidate'
import GeographicLocationInput from './GeographicLocationInput'

type CandidateFormScreenProps = {
  formData: CreateCandidateData
  register: UseFormRegister<CreateCandidateData>
  setValue: UseFormSetValue<CreateCandidateData>
  setError: UseFormSetError<CreateCandidateData>
  errors: FieldErrors<CreateCandidateData>
  clearErrors?: UseFormClearErrors<CreateCandidateData>
  watch?: UseFormWatch<any>
  action: 'create' | 'edit'
}

const CandidateFormScreen = (props: CandidateFormScreenProps) => {
  const {
    formData,
    register,
    setValue,
    errors,
    clearErrors,
    watch,
    action,
    setError,
  } = props

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
    geographicLocation,
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

  // errors are shown in the form UI via the `errors` prop — avoid noisy console logging

  const { checkUnique } = useCheckUnique('candidates')
  const { checkUnique: checkEmployeeUnique } = useCheckUnique('employees')

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
      >
        <Row title="Informação Básica">
          <FormInput
            query={firstName}
            setQuery={(e) =>
              setValue('user.firstName', e as unknown as string, {
                shouldValidate: true,
              })
            }
            error={errors.user?.firstName?.message}
            placeholder="José"
            inputType="text"
            mandatory={true}
            width="lg:w-1/4 w-full"
            label="Nome"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.firstName', {
              required: 'Nome é obrigatório',
              minLength: {
                value: 2,
                message: 'Nome deve ter pelo menos 2 caracteres',
              },
            })}
          />
          <FormInput
            query={lastName}
            setQuery={(e) =>
              setValue('user.lastName', e as unknown as string, {
                shouldValidate: true,
              })
            }
            error={errors.user?.lastName?.message}
            placeholder="Silva"
            inputType="text"
            mandatory={true}
            label="Apelido"
            width="lg:w-1/4 w-full"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.lastName', {
              required: 'Apelido é obrigatório',
              minLength: {
                value: 2,
                message: 'Apelido deve ter pelo menos 2 caracteres',
              },
            })}
          />
          <FormInput
            query={formData.nationality}
            setQuery={(e) => setValue('nationality', e as unknown as string)}
            placeholder="Português(a)"
            inputType="text"
            label="Nacionalidade"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/4 w-full"
          />
          <SearchInput
            query={search}
            setQuery={setSearch}
            placeholder="Pesquise ou crie um Cargo/Função"
            data={searchedJobTitles}
            dataIsLoading={jobTitlesLoading}
            error={
              jobTitlesError ??
              (errors.jobTitles?.message ||
                (errors.jobTitles && 'Cargo/Função é obrigatório'))
            }
            label="Cargo/Função"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            mandatory={true}
            width="lg:w-1/4 w-full"
            value={search}
            setValue={(id) => {
              const found = searchedJobTitles.find((jt) => jt.id === id)
              if (found) {
                setValue('jobTitles', [found], { shouldValidate: true })
                setSelectedJobTitle(found)
                clearErrors?.('jobTitles')
              }
            }}
            setSelectedObj={(obj) => {
              if (obj) {
                setValue('jobTitles', [obj], { shouldValidate: true })
                setSelectedJobTitle(obj)
                clearErrors?.('jobTitles')
              } else {
                setValue('jobTitles', [], { shouldValidate: true })
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
        <Separator />
        <Row title="Contatos">
          <FormInput
            query={email}
            setQuery={(e) => {
              clearErrors && clearErrors('user.email')
              setValue('user.email', e as unknown as string, {
                shouldValidate: true,
              })
            }}
            onBlur={async () => {
              if (action === 'create' && email) {
                const exists = await checkUnique(email as string)
                // also check employees to make email/phone unique across both
                const existsInEmployees = await checkEmployeeUnique(
                  email as string
                )
                if (exists || existsInEmployees) {
                  setError('user.email' as any, {
                    type: 'unique',
                    message: 'Este email já se encontra em uso',
                  })
                }
              }
            }}
            error={errors.user?.email?.message}
            placeholder="jose.carlos@email.com"
            inputType="email"
            mandatory={true}
            label="Email"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            {...register('user.email', {
              required: 'Email é obrigatório',
              pattern: {
                value: validatorsPatterns.email,
                message: validatorsMessages.email,
              },
            })}
            width="lg:w-3/4 w-full"
            disabled={action === 'edit'}
          />
          <FormInput
            query={phoneNumber ? phoneNumber : ''}
            setQuery={(e) => {
              clearErrors && clearErrors('user.phoneNumber')
              setValue('user.phoneNumber', e as string, {
                shouldValidate: true,
              })
            }}
            placeholder="912 345 678"
            inputType="tel"
            mandatory={true}
            label="Número de Telemóvel"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/4 w-full"
            error={errors.user?.phoneNumber?.message}
            validation={{ required: true, pattern: validatorsPatterns.phone }}
            onBlur={async () => {
              if (action === 'create' && phoneNumber) {
                const cleanedPhone = cleanPhone(phoneNumber as string)
                const exists = await checkUnique(cleanedPhone)
                const existsInEmployees =
                  await checkEmployeeUnique(cleanedPhone)
                if (exists || existsInEmployees) {
                  setError('user.phoneNumber' as any, {
                    type: 'unique',
                    message: 'Este número já se encontra em uso',
                  })
                }
              }
            }}
            {...register('user.phoneNumber', {
              required: 'Número de telemóvel é obrigatório',
              // pattern removed: use custom `validate` which normalizes input before checking
              validate: (value) => {
                if (!value) return true
                const cleaned = value
                  .toString()
                  .replace(/[\s\-().]/g, '')
                  .replace(/^\+?351/, '')

                return (
                  /^9\d{8}$/.test(cleaned) ||
                  'Deve começar com 9 e ter 9 dígitos'
                )
              },
            })}
          />
        </Row>
        <Separator />
        <Row title="Localização">
          <GeographicLocationInput
            register={register}
            setValue={setValue}
            errors={errors}
            watch={watch}
            initial={
              geographicLocation
                ? {
                    city: geographicLocation.city,
                    municipality: geographicLocation.municipality,
                    locality: geographicLocation.locality ?? undefined,
                    parish: geographicLocation.parish ?? undefined,
                    latitude: geographicLocation.latitude ?? undefined,
                    longitude: geographicLocation.longitude ?? undefined,
                    addressFull: geographicLocation.addressFull ?? undefined,
                  }
                : undefined
            }
          />
        </Row>
        <Separator />
        <Row title="Informação Profissional">
          <FormDropdown
            label="Disponibilidade"
            choices={AVAILABILITY_STATUS}
            placeholder="Selecione a sua disponibilidade"
            selectedValue={availabilityStatus ?? ''}
            setSelectedValue={(e) => {
              setValue('availabilityStatus', e as unknown as string, {
                shouldValidate: true,
              })
              clearErrors?.('availabilityStatus')
            }}
            error={errors.availabilityStatus?.message}
            mandatory={true}
            labelStyles="text-digiblack1420-semibold flex gap-1"
            width="lg:w-1/3 w-full"
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
