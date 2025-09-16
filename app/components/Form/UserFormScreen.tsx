import {
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormClearErrors,
} from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import FormDropdown from '../Dropdown/FormDropdown'
import { CreateEmployeeData } from '@/app/types/employee/employee'
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/app/constants'
import Separator from '../Separator/Separator'
import UploadImage from '../Upload/UploadImage'
import useUploadImage from '@/app/hooks/useUploadImage'
type UserFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  clearErrors?: UseFormClearErrors<CreateEmployeeData>
}
const UserFormScreen = (props: UserFormScreenProps) => {
  const { formData, register, setValue, errors, clearErrors } = props
  const {
    user: { email, firstName, lastName, phoneNumber } = {},
    nif,
    nationalId,
    socialSecurityNumber,
    gender,
    maritalStatus,
    emergencyContact: { name, phone, relationship } = {},
    photoUrl,
    address,
    postalCode,
    city,
    district,
    country,
    dateOfBirth,
  } = formData

  const { uploadImage, loading, error } = useUploadImage()

  return (
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
      <Row>
        <FormInput
          query={dateOfBirth as unknown as string}
          setQuery={(e) => setValue('dateOfBirth', e as unknown as Date)}
          placeholder="dd/mm/aaaa"
          inputType="date"
          mandatory={false}
          label="Data de Nascimento"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/5 w-full"
        />
        <FormDropdown
          choices={MARITAL_STATUS_OPTIONS}
          placeholder="Selecione o Estado Civil"
          selectedValue={maritalStatus}
          setSelectedValue={(value) => {
            setValue('maritalStatus', value as unknown as string)
          }}
          mandatory={false}
          label="Estado Civil"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('maritalStatus', { required: false })}
          width="lg:w-1/5 w-full"
        />
        <FormDropdown
          choices={GENDER_OPTIONS}
          placeholder="Selecione o Género"
          selectedValue={gender}
          setSelectedValue={(value) => {
            setValue('gender', value as unknown as string)
          }}
          mandatory={false}
          label="Género"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/5 w-full"
          {...register('gender', { required: false })}
        />

        <UploadImage
          imageUrl={photoUrl}
          setImageUrl={(url) => setValue('photoUrl', url)}
          label="Foto"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          uploadImage={uploadImage}
          disabled
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
          setQuery={setValue.bind(null, 'user.phoneNumber')}
          placeholder="912 345 678"
          inputType="tel"
          mandatory={true}
          label="Número de Telemóvel"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/4 w-full"
        />
      </Row>
      <Row>
        <FormInput
          label="Nome do Contato de Emergência"
          query={name}
          setQuery={(e) => {
            setValue('emergencyContact.name', e as unknown as string)
            if (errors?.emergencyContact?.name) {
              clearErrors && clearErrors('emergencyContact.name')
            }
          }}
          placeholder="João Silva"
          inputType="text"
          mandatory={false}
          error={errors?.emergencyContact?.name?.message}
          {...register('emergencyContact.name', {
            validate: (value) => {
              const phone = formData?.emergencyContact?.phone
              const relationship = formData?.emergencyContact?.relationship
              if (value || phone || relationship) {
                return value ? true : 'Preencha o nome do contato de emergência'
              }

              return true
            },
          })}
        />
        <FormInput
          label="Telemóvel de Emergência"
          query={phone ? phone : ''}
          setQuery={(e) => {
            if (errors?.emergencyContact?.phone) {
              clearErrors && clearErrors('emergencyContact.phone')
            }
            setValue('emergencyContact.phone', e as unknown as string)
          }}
          placeholder="912 345 678"
          inputType="tel"
          mandatory={false}
          error={errors?.emergencyContact?.phone?.message}
          {...register('emergencyContact.phone', {
            validate: (value) => {
              const name = formData?.emergencyContact?.name
              const relationship = formData?.emergencyContact?.relationship
              if (value || name || relationship) {
                return value ? true : 'Preencha o telemóvel de emergência'
              }

              return true
            },
          })}
        />
        <FormInput
          label="Relação do Contato de Emergência"
          query={relationship}
          setQuery={(e) => {
            if (errors?.emergencyContact?.relationship) {
              clearErrors && clearErrors('emergencyContact.relationship')
            }
            setValue('emergencyContact.relationship', e as unknown as string)
          }}
          placeholder="Pai"
          inputType="text"
          mandatory={false}
          error={errors?.emergencyContact?.relationship?.message}
          {...register('emergencyContact.relationship', {
            validate: (value) => {
              const name = formData?.emergencyContact?.name
              const phone = formData?.emergencyContact?.phone
              if (value || name || phone) {
                return value
                  ? true
                  : 'Preencha a relação do contato de emergência'
              }

              return true
            },
          })}
        />
      </Row>
      <Separator />
      <Row title="Localização">
        <FormInput
          query={country}
          setQuery={(e) => setValue('country', e as unknown as string)}
          error={errors.country ? 'País é obrigatório' : undefined}
          placeholder="Portugal"
          inputType="text"
          mandatory={true}
          label="País"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('country', { required: true })}
        />
        <FormInput
          query={district}
          setQuery={(e) => setValue('district', e as unknown as string)}
          placeholder="Lisboa"
          inputType="text"
          mandatory={false}
          label="Distrito"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('district', { required: false })}
        />
        <FormInput
          query={city}
          setQuery={(e) => setValue('city', e as unknown as string)}
          placeholder="Lisboa"
          inputType="text"
          mandatory={false}
          label="Cidade"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('city', { required: false })}
        />
      </Row>
      <Row>
        <FormInput
          query={address}
          setQuery={(e) => setValue('address', e as unknown as string)}
          placeholder="Rua Exemplo"
          inputType="text"
          mandatory={false}
          label="Morada"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('address', { required: false })}
        />
        <FormInput
          query={postalCode}
          setQuery={(e) => setValue('postalCode', e as unknown as string)}
          placeholder="1000-000"
          inputType="text"
          width="lg:w-40 w-full"
          mandatory={false}
          label="Código Postal"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('postalCode', { required: false })}
        />
      </Row>
      <Separator />
      <Row title="Informação Adicional">
        <FormInput
          query={nif}
          setQuery={(e) => setValue('nif', e as unknown as string)}
          placeholder="123456789"
          inputType="text"
          mandatory={false}
          label="NIF"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('nif', { required: false })}
        />
        <FormInput
          query={nationalId}
          setQuery={(e) => setValue('nationalId', e as unknown as string)}
          placeholder="123456789"
          inputType="text"
          mandatory={false}
          label="Número de Identificação Nacional (CC)"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('nationalId', { required: false })}
        />
        <FormInput
          query={socialSecurityNumber}
          setQuery={(e) =>
            setValue('socialSecurityNumber', e as unknown as string)
          }
          placeholder="123456789"
          inputType="text"
          mandatory={false}
          label="Número de Segurança Social"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('socialSecurityNumber', { required: false })}
        />
      </Row>
    </ContainerCard>
  )
}

export default UserFormScreen
