import { Employee } from '@/app/types/employee/employee'
import Label from '../../Label/Label'
import Row from '../../Row/Row'
import { translateEmployeeAvailabilityStatus } from '@/app/utils'
import { GenericCandidate } from '@/app/types/candidate/candidate'

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
          label="Cargo"
          value={
            candidate?.jobTitles && candidate.jobTitles.length > 0
              ? candidate.jobTitles.map((job) => job.name).join(', ')
              : undefined
          }
        />
      </Row>
      <Row>
        <Label
          label="Email"
          value={candidate?.user?.email}
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
      </Row>
      <Row>
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
          label="Disponibilidade Geográfica"
          value={
            candidate?.geographicAvailability
              ? candidate?.geographicAvailability
              : undefined
          }
        />
      </Row>
    </div>
  )
}
