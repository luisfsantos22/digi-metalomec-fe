import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Row from '../Row/Row'
import {
  CreateEmployeeData,
  EmployeeCertification,
} from '@/app/types/employee/employee'
import FormDropdown from '../Dropdown/FormDropdown'
import { EDUCATIONAL_QUALIFICATION_OPTIONS } from '@/app/constants'
import { useState } from 'react'
import { EmployeeSkill } from '@/app/types/employee/skill'
import Separator from '../Separator/Separator'

type TechnicalEmployeeFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
}

const TechnicalEmployeeFormScreen = (
  props: TechnicalEmployeeFormScreenProps
) => {
  const { formData, setValue, register, errors } = props
  const { skills, certifications } = formData

  const [showCertificationModal, setShowCertificationModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)
  const [skillsList, setSkillsList] = useState<EmployeeSkill[]>(skills || [])
  const [certificationsList, setCertificationsList] = useState<
    EmployeeCertification[]
  >(certifications || [])

  return (
    <ContainerCard
      padding="lg:p-8 p-4"
      styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
    >
      <Row
        title="Certificados"
        withAddButton
        action={() => setShowCertificationModal(true)}
        tooltipText="Adicionar Certificação"
        id="add-certification-button"
      >
        <div className="flex flex-col gap-4 w-full">
          {certificationsList.length > 0 &&
            certificationsList.map((certification) => (
              <div
                key={certification.id}
                className="border-b border-gray-200 py-2"
              >
                <h4 className="font-semibold">{certification.name}</h4>
                <p className="text-sm text-gray-500">{certification.issuer}</p>
              </div>
            ))}
        </div>
      </Row>
      <Separator />
      <Row
        title="Habilidades Técnicas"
        withAddButton
        action={() => setShowSkillsModal(true)}
        tooltipText="Adicionar Habilidade"
        id="add-skills-button"
      >
        <div className="flex flex-col gap-4 w-full">
          {skillsList.length > 0 &&
            skillsList.map((skill) => (
              <div
                key={skill.id}
                className="border-b border-gray-200 py-2"
              >
                <h4 className="font-semibold">{skill.name}</h4>
                <p className="text-sm text-gray-500">{skill.level}</p>
              </div>
            ))}
        </div>
      </Row>
    </ContainerCard>
    //TODO:  {showCertificationModal && (
    //     <CertificationModal .../>
    //   )}
  )
}

export default TechnicalEmployeeFormScreen
