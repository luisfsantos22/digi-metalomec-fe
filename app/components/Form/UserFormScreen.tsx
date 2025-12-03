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
import {
  patterns as validatorsPatterns,
  messages as validatorsMessages,
  cleanPhone,
} from '@/app/validators/validation'

type UserFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  setError: UseFormSetError<CreateEmployeeData>
  clearErrors?: UseFormClearErrors<CreateEmployeeData>
  action: 'create' | 'edit'
}
const UserFormScreen = (props: UserFormScreenProps) => {
  const {
    formData,
    register,
    setValue,
    errors,
    clearErrors,
    action,
    setError,
  } = props
  const {
    user: { email, firstName, lastName, phoneNumber, temporaryEmail } = {},
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
    nationality,
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
            required: validatorsMessages.firstNameReq,
            pattern: {
              value: validatorsPatterns.firstName,
              message: validatorsMessages.firstName,
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
            required: validatorsMessages.lastNameReq,
            pattern: {
              value: validatorsPatterns.lastName,
              message: validatorsMessages.lastName,
            },
          })}
        />
        <FormInput
          query={nationality}
          setQuery={(e) => setValue('nationality', e as unknown as string)}
          placeholder="Português(a)"
          inputType="text"
          label="Nacionalidade"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/4 w-full"
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
          width="lg:w-1/4 w-full"
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
          setQuery={(e) => {
            clearErrors && clearErrors('user.email')
            setValue('user.email', e as unknown as string, {
              shouldValidate: true,
            })
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
          setQuery={(v) => {
            clearErrors && clearErrors('user.phoneNumber')
            setValue('user.phoneNumber', v as string, {
              shouldValidate: true,
            })
          }}
          placeholder="912 345 678"
          inputType="tel"
          mandatory={true}
          label="Número de Telemóvel"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          width="lg:w-1/4 w-full"
          error={errors?.user?.phoneNumber?.message}
          validation={{
            required: true,
            pattern: validatorsPatterns.phone,
          }}
          {...register('user.phoneNumber', {
            required: 'Número de telemóvel é obrigatório',
            validate: (value) => {
              if (!value) return true
              const cleaned = cleanPhone(value)
              const emergency = cleanPhone(formData?.emergencyContact?.phone)
              if (emergency && cleaned === emergency)
                return 'O número principal não pode ser o mesmo que o telemóvel de emergência'

              return (
                validatorsPatterns.phone.test(cleaned) ||
                validatorsMessages.phone
              )
            },
          })}
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
              const mainPhone = formData?.user?.phoneNumber
              if (value || phone || relationship) {
                if (!value) return 'Preencha o nome do contato de emergência'
                const cleanedName = value?.toString().replace(/[\s\-().]/g, '')
                const cleanedMain = mainPhone
                  ? mainPhone.toString().replace(/[\s\-().]/g, '')
                  : ''

                // keep validation minimal: only require the name if other emergency fields exist
                return true
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
          validation={{
            pattern: validatorsPatterns.phone,
          }}
          {...register('emergencyContact.phone', {
            validate: (value) => {
              const name = formData?.emergencyContact?.name
              const relationship = formData?.emergencyContact?.relationship
              if (value || name || relationship) {
                if (!value) return 'Preencha o telemóvel de emergência'
                const cleaned = cleanPhone(value)
                const mainPhone = cleanPhone(formData?.user?.phoneNumber)
                if (mainPhone && cleaned === mainPhone) {
                  return 'O telemóvel de emergência não pode ser igual ao telemóvel principal'
                }

                return (
                  validatorsPatterns.phone.test(cleaned) ||
                  validatorsMessages.phone
                )
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
          label="Código Postal"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          validation={{
            pattern: validatorsPatterns.postalCode,
          }}
          {...register('postalCode', {
            pattern: {
              value: validatorsPatterns.postalCode,
              message: validatorsMessages.postalCode,
            },
          })}
        />
      </Row>
      <Separator />
      <Row title="Informação Adicional">
        <FormInput
          query={nif}
          setQuery={(e) => setValue('nif', e as unknown as string)}
          placeholder="123456789"
          inputType="number"
          label="NIF"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          validation={{ pattern: validatorsPatterns.nif }}
          {...register('nif', {
            pattern: {
              value: validatorsPatterns.nif,
              message: validatorsMessages.nif,
            },
          })}
        />
        <FormInput
          query={nationalId}
          setQuery={(e) => setValue('nationalId', e as unknown as string)}
          placeholder="12345678"
          inputType="number"
          label="Número de Identificação Nacional (CC)"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          validation={{ pattern: validatorsPatterns.nationalId }}
          {...register('nationalId', {
            pattern: {
              value: validatorsPatterns.nationalId,
              message: validatorsMessages.nationalId,
            },
          })}
        />
        <FormInput
          query={socialSecurityNumber}
          setQuery={(e) =>
            setValue('socialSecurityNumber', e as unknown as string)
          }
          placeholder="12345678901"
          inputType="number"
          label="Número de Segurança Social"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          validation={{ pattern: validatorsPatterns.socialSecurity }}
          {...register('socialSecurityNumber', {
            pattern: {
              value: validatorsPatterns.socialSecurity,
              message: validatorsMessages.socialSecurity,
            },
          })}
        />
        <FormInput
          query={formData?.europeanHealthInsuranceCard}
          setQuery={(e) =>
            setValue('europeanHealthInsuranceCard', e as unknown as string)
          }
          placeholder="12345678901234567890"
          inputType="number"
          label="Cartão Europeu de Seguro de Doença"
          labelStyles="text-digiblack1420-semibold flex gap-1"
          validation={{ pattern: validatorsPatterns.ehic }}
          {...register('europeanHealthInsuranceCard', {
            pattern: {
              value: validatorsPatterns.ehic,
              message: validatorsMessages.ehic,
            },
          })}
        />
      </Row>
    </ContainerCard>
  )
}

export default UserFormScreen
