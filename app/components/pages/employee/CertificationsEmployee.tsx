import {
  Certification,
  Employee,
  EmployeeCertification,
} from '@/app/types/employee/employee'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import { formatDate } from '@/app/utils'
import Separator from '../../Separator/Separator'
import Text from '../../Text/Text'

type CertificationsEmployeeProps = {
  certifications: EmployeeCertification[] | undefined
}

export default function CertificationsEmployee(
  props: CertificationsEmployeeProps
) {
  const { certifications } = props

  console.log(certifications)
  //TODO: max height na listagem, add btn, edit e delete em cada item no hover com fundo preto e icons

  if (!certifications || certifications.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center">
        <Text
          header="h2"
          styles="text-digired2025-semibold"
          text="Nenhuma certificação encontrada"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Text
        header="h2"
        styles="text-digiblack2025-normal"
        text={
          <span>
            Total de Certificações:{' '}
            <strong>{certifications?.length || 0}</strong>
          </span>
        }
      />
      <div className="flex flex-col gap-4">
        {certifications?.map((certification, index) => (
          <div
            className="flex flex-col gap-4"
            key={certification?.id}
          >
            <Row>
              <Label
                label="Nome da Certificação"
                value={certification?.name || undefined}
              />
              <Label
                label="Emitido Por"
                value={certification?.issuer || undefined}
              />
              <Label
                label="Data de Emissão"
                value={
                  certification?.issuedAt
                    ? formatDate(certification?.issuedAt)
                    : undefined
                }
              />
              <Label
                label="Data de Validade"
                value={
                  certification?.expiresAt
                    ? formatDate(certification?.expiresAt)
                    : undefined
                }
              />
              <Label
                label="Valido por (dias)"
                value={certification?.validForDays?.toString() || undefined}
              />
            </Row>
            <Row>
              <Label
                label="Descrição"
                value={certification?.description || undefined}
              />
            </Row>
            <Row>
              <Label
                label="URL"
                value={certification?.certificateUrl || undefined}
              />
            </Row>
            {index < certifications.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
