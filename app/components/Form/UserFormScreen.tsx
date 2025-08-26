import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
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
}

const UserFormScreen = (props: UserFormScreenProps) => {
  const { formData, register, setValue, errors } = props
  const {
    user: { username, email, firstName, lastName },
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
    phoneNumber,
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
          setQuery={(e) => setValue('user.firstName', e)}
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
          setQuery={(e) => setValue('user.lastName', e)}
          error={errors.user?.lastName ? 'Apelido é obrigatório' : undefined}
          placeholder="Silva"
          inputType="text"
          mandatory={true}
          label="Apelido"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.lastName', { required: true })}
        />
        <FormInput
          query={username}
          setQuery={(e) => setValue('user.username', e)}
          error={errors.user?.username ? 'Username é obrigatório' : undefined}
          placeholder="jose.carlos"
          inputType="text"
          mandatory={true}
          label="Username"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.username', { required: true })}
        />
        <FormInput
          query={email}
          setQuery={(e) => setValue('user.email', e)}
          error={errors.user?.email ? 'Email é obrigatório' : undefined}
          placeholder="jose.carlos@email.com"
          inputType="email"
          mandatory={true}
          label="Email"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          {...register('user.email', { required: true })}
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
        />
      </Row>
      <Separator />
      <Row title="Contatos">
        <FormInput
          query={phoneNumber}
          setQuery={(e) => setValue('phoneNumber', e as unknown as string)}
          placeholder="+351912345678"
          inputType="tel"
          mandatory={false}
          label="Número de Telemóvel"
          width="lg:w-1/5 w-full"
        />
      </Row>
      <Row>
        <FormInput
          label="Nome do Contato de Emergência"
          query={name}
          setQuery={(e) =>
            setValue('emergencyContact.name', e as unknown as string)
          }
          placeholder="João Silva"
          inputType="text"
          mandatory={false}
        />
        <FormInput
          label="Telemóvel de Emergência"
          query={phone}
          setQuery={(e) =>
            setValue('emergencyContact.phone', e as unknown as string)
          }
          placeholder="+351912345678"
          inputType="tel"
          mandatory={false}
        />
        <FormInput
          label="Relação do Contato de Emergência"
          query={relationship}
          setQuery={(e) =>
            setValue('emergencyContact.relationship', e as unknown as string)
          }
          placeholder="Pai"
          inputType="text"
          mandatory={false}
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
          width="w-40"
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
