import { Employee } from '@/app/types/employee/employee'
import Text from '../../Text/Text'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import { formatDate } from '@/app/utils'

type GeneralInfoEmployeeProps = {
  employee: Employee | null
}

export default function GeneralInfoEmployee(props: GeneralInfoEmployeeProps) {
  const { employee } = props

  return (
    <div className="flex flex-col gap-4">
      <Row>
        <Label
          label="Nome Completo"
          value={employee?.user?.fullName}
        />
        <Label
          label="Email"
          value={employee?.user?.email}
        />
        <Label
          label="Telefone"
          value={employee?.phoneNumber}
        />
      </Row>
      <Row>
        <Label
          label="Cargo"
          value={employee?.jobTitles[0]?.name}
        />
        <Label
          label="Departamento"
          value={employee?.department ? employee?.department : undefined}
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
    </div>
  )
}
