import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Row from '../Row/Row'
import {
  CreateEmployeeData,
  EmployeeCertification,
} from '@/app/types/employee/employee'
import { useState } from 'react'
import { EmployeeSkill } from '@/app/types/employee/skill'
import Separator from '../Separator/Separator'
import CertificationModal from '../Modal/CertificationModal'
import { Table } from '@mantine/core'
import { CERTIFICATION_TABLE_LIST } from '@/app/constants'
import TableRow from '../Table/TableRow'
import Text from '../Text/Text'
import DeleteButton from '../Button/DeleteButton'

type TechnicalEmployeeFormScreenProps = {
  formData: CreateEmployeeData
  register: UseFormRegister<CreateEmployeeData>
  setValue: UseFormSetValue<CreateEmployeeData>
  errors: FieldErrors<CreateEmployeeData>
  setAreYouSureModalOpenCertificate: (open: boolean) => void
  setSelectedCertification: (
    certification: EmployeeCertification | undefined
  ) => void
  selectedCertification: EmployeeCertification | undefined
  setAreYouSureModalOpenSkill: (open: boolean) => void
  selectedSkill: EmployeeSkill | undefined
  setSelectedSkill: (skill: EmployeeSkill | undefined) => void
}

const TechnicalEmployeeFormScreen = (
  props: TechnicalEmployeeFormScreenProps
) => {
  const {
    formData,
    setValue,
    register,
    errors,
    setAreYouSureModalOpenCertificate,
    setSelectedCertification,
    selectedCertification,
    setAreYouSureModalOpenSkill,
    selectedSkill,
    setSelectedSkill,
  } = props
  const { skills, certifications } = formData

  const [action, setAction] = useState<'add' | 'edit'>('add')
  const [showCertificationModal, setShowCertificationModal] = useState(false)
  const [showSkillsModal, setShowSkillsModal] = useState(false)

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-8 lg:gap-10 w-full rounded-xl"
      >
        <Row
          title="Certificados"
          withAddButton
          action={() => {
            setAction('add')
            setShowCertificationModal(true)
          }}
          tooltipText="Adicionar Certificação"
          id="add-certification-button"
        >
          <div className="flex flex-col gap-4 w-full">
            {certifications && certifications?.length > 0 && (
              <Table
                striped
                withTableBorder
                highlightOnHoverColor="bg-digigold-hover/10"
                className="w-full"
              >
                <Table.Thead className="bg-digiblue">
                  <Table.Tr>
                    {CERTIFICATION_TABLE_LIST.map((text) => (
                      <Table.Th
                        className="text-digiwhite1624-bold"
                        key={text}
                      >
                        {text}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {certifications.map((certificate, index) => (
                    <Table.Tr
                      key={index}
                      onClick={() => {
                        setAction('edit')
                        setSelectedCertification(certificate)
                        setShowCertificationModal(true)
                      }}
                      className="hover:cursor-pointer hover:!bg-digiblue-hover-options"
                    >
                      <TableRow>
                        <Text
                          text={certificate.name}
                          styles="text-digibrown1624-normal"
                        />
                      </TableRow>
                      <TableRow>
                        <Text
                          text={certificate.issuer || '---'}
                          styles="text-digibrown1624-normal"
                        />
                      </TableRow>
                      <TableRow>
                        <Text
                          text={
                            (certificate?.validityPeriod as unknown as string) ||
                            '---'
                          }
                          styles={
                            certificate?.validityPeriod
                              ? 'text-digigreen1624-normal'
                              : 'text-digired1624-normal'
                          }
                        />
                      </TableRow>
                      <TableRow customStyles="!hover:bg-white/0 z-10">
                        <div className="flex justify-start items-center">
                          <DeleteButton
                            id={`delete-${certificate.id}`}
                            onClick={() => {
                              setAreYouSureModalOpenCertificate(true)
                              setSelectedCertification(certificate)
                            }}
                            tooltipText="Remover Certificado"
                            hasTooltip
                          />
                        </div>
                      </TableRow>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
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
            {skills &&
              skills?.length > 0 &&
              skills?.map((skill) => (
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
      {showCertificationModal && (
        <CertificationModal
          action={action}
          isOpen={showCertificationModal}
          onClose={() => setShowCertificationModal(false)}
          onConfirm={() => {
            setShowCertificationModal(false)
            setSelectedCertification(undefined)
          }}
          setValue={setValue}
          seletectedCertification={selectedCertification}
          formData={formData}
          indexNumber={
            action === 'edit'
              ? (certifications?.findIndex(
                  (certification) =>
                    certification.id === selectedCertification?.id
                ) ?? -1)
              : undefined
          }
        />
      )}
    </>
  )
}

export default TechnicalEmployeeFormScreen
