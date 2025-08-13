import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Text from '../Text/Text'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import { CreateEmployeeData } from '@/app/types/employee/employee'
import { Language } from '@/app/types/utils/language'
import { GenericJobTitle } from '@/app/types/utils/job-title'

type EmployeeFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  languages: Language[]
  jobTitles: GenericJobTitle[]
}

const EmployeeFormScreen = (props: EmployeeFormScreenProps) => {
  const { formData, register, setValue, errors, languages, jobTitles } = props
  const {
    company,
    jobTitles,
    department,
    departmentName,
    collaborationStartDate,
    transportAvailable,
    geographicAvailability,
  } = formData //TODO: Add more fields as needed

  return (
    <ContainerCard
      padding="lg:p-8 p-4"
      styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
    >
      <Text
        text="Dados Gerais do Colaborador"
        styles="text-digiblack2025-semibold"
      />
      <Row>
        <FormInput
          query={username}
          setQuery={(e) => setValue('user.username', e)}
          error={
            errors.user?.username
              ? 'Username do Utilizador é obrigatório'
              : undefined
          }
          placeholder="jose.carlos"
          inputType="text"
          mandatory={true}
          label="Username do Utilizador"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.username', { required: true })}
        />
        <FormInput
          query={email}
          setQuery={(e) => setValue('user.email', e)}
          error={
            errors.user?.email ? 'Email do Utilizador é obrigatório' : undefined
          }
          placeholder="jose.carlos@email.com"
          inputType="email"
          mandatory={true}
          label="Email do Utilizador"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.email', { required: true })}
        />
      </Row>
      <Row>
        <FormInput
          query={firstName}
          setQuery={(e) => setValue('user.firstName', e)}
          error={
            errors.user?.firstName
              ? 'Nome do Utilizador é obrigatório'
              : undefined
          }
          placeholder="José"
          inputType="text"
          mandatory={true}
          label="Nome do Utilizador"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.firstName', { required: true })}
        />
        <FormInput
          query={lastName}
          setQuery={(e) => setValue('user.lastName', e)}
          error={
            errors.user?.lastName
              ? 'Apelido do Utilizador é obrigatório'
              : undefined
          }
          placeholder="Silva"
          inputType="text"
          mandatory={true}
          label="Apelido do Utilizador"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.lastName', { required: true })}
        />
      </Row>
    </ContainerCard>
  )
}

export default EmployeeFormScreen
