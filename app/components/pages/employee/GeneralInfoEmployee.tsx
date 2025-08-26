import { Employee } from '@/app/types/employee/employee'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import { formatDate } from '@/app/utils'
import Image from 'next/image'

type GeneralInfoEmployeeProps = {
  employee: Employee | null
}

export default function GeneralInfoEmployee(props: GeneralInfoEmployeeProps) {
  const { employee } = props

  return (
    <div className="flex flex-col gap-4">
      <Row>
        <Label
          type="image"
          label="Foto"
          value={employee?.photoUrl}
          imageProps={{
            alt: 'Employee Profile',
            width: 120,
            height: 80,
          }}
        />
        <Label
          label="Nome Completo"
          value={employee?.user?.fullName}
        />
        <Label
          label="Email"
          value={employee?.user?.email}
        />
      </Row>
      <Row>
        <Label
          label="Telefone"
          type="phone"
          value={employee?.user?.phoneNumber}
        />
        <Label
          label="Estado Civil"
          value={employee?.maritalStatus ? employee?.maritalStatus : undefined}
        />
        <Label
          label="Data de Nascimento"
          value={
            employee?.dateOfBirth
              ? formatDate(employee?.dateOfBirth as Date)
              : undefined
          }
        />
      </Row>
      <Row>
        <Label
          label="NIF"
          value={employee?.nif ? employee?.nif : undefined}
        />
        <Label
          label="Número de Segurança Social"
          value={
            employee?.socialSecurityNumber
              ? employee?.socialSecurityNumber
              : undefined
          }
        />
        <Label
          label="Cartão de Cidadão"
          value={employee?.nationalId ? employee?.nationalId : undefined}
        />
      </Row>
      <Row>
        <Label
          label="País"
          value={employee?.country ? employee?.country : undefined}
        />
        <Label
          label="Distrito"
          value={employee?.district ? employee?.district : undefined}
        />
        <Label
          label="Cidade"
          value={employee?.city ? employee?.city : undefined}
        />
      </Row>
      <Row>
        <Label
          label="Morada"
          value={employee?.address ? employee?.address : undefined}
        />
        <Label
          label="Código Postal"
          value={employee?.postalCode ? employee?.postalCode : undefined}
        />
        <Label
          label="Localização Atual"
          value={
            employee?.currentLocation ? employee?.currentLocation : undefined
          }
        />
      </Row>
      <Row>
        <Label
          label="Linguagens"
          value={
            employee?.languages
              ? employee?.languages?.map((lang) => lang.name).join(', ')
              : undefined
          }
        />
        <Label
          label="Qualificação Educacional"
          value={
            employee?.educationQualification?.name
              ? employee?.educationQualification?.name
              : undefined
          }
        />
        <Label
          label="Género"
          value={employee?.gender ? employee?.gender : undefined}
        />
      </Row>
      <Row>
        <Label
          type="phone"
          label="Contato de Emergência"
          value={
            employee?.emergencyContact?.phone
              ? employee?.emergencyContact?.phone
              : undefined
          }
        />
        <Label
          label="Nome do Contato de Emergência"
          value={
            employee?.emergencyContact?.name
              ? employee?.emergencyContact?.name
              : undefined
          }
        />
        <Label
          label="Relação com o Contato de Emergência"
          value={
            employee?.emergencyContact?.relationship
              ? employee?.emergencyContact?.relationship
              : undefined
          }
        />
      </Row>
    </div>
  )
}
