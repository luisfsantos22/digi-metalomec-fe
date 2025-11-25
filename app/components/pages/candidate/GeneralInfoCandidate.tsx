import { Employee } from '@/app/types/employee/employee'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import { translateEmployeeAvailabilityStatus } from '@/app/utils'
import { GenericCandidate } from '@/app/types/candidate/candidate'
import { formatDate } from '../../../utils'

type GeneralInfoCandidateProps = {
  candidate: GenericCandidate | null
}

export default function GeneralInfoCandidate(props: GeneralInfoCandidateProps) {
  const { candidate } = props

  return (
    <div className="flex flex-col gap-4">
      <Row>
        <Label
          label="Idenficador Universal"
          value={
            candidate?.internalIdentifier
              ? (candidate?.internalIdentifier as unknown as string)
              : undefined
          }
        />
        <Label
          label="Nome Completo"
          value={candidate?.user?.fullName}
        />
        <Label
          label="Nacionalidade"
          value={candidate?.nationality}
        />
      </Row>
      <Row>
        <Label
          label="Email"
          value={candidate?.user?.email}
          additionalText={
            candidate?.user?.temporaryEmail ? 'Email Temporário' : undefined
          }
        />
        <Label
          label="Telefone"
          type="phone"
          value={
            candidate?.user?.phoneNumber
              ? candidate?.user?.phoneNumber
              : undefined
          }
        />
        <Label
          label="Último Atualização"
          type="text"
          value={
            candidate?.updatedAt ? formatDate(candidate?.updatedAt) : undefined
          }
        />
      </Row>
      <Row>
        <Label
          label="Cargo"
          value={
            candidate?.jobTitles && candidate.jobTitles.length > 0
              ? candidate.jobTitles.map((job) => job.name).join(', ')
              : undefined
          }
        />
        <Label
          label="Disponibilidade"
          value={
            candidate?.availabilityStatus
              ? translateEmployeeAvailabilityStatus(
                  candidate?.availabilityStatus
                )
              : undefined
          }
        />
        <Label
          label="Localização"
          value={candidate?.geographicLocation?.addressFull ?? undefined}
          numberOfLinesClass="line-clamp-2"
        />
      </Row>
    </div>
  )
}
