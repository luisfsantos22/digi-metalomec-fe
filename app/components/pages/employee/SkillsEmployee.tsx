import Label from '../../Label/Label'
import Row from '../../Row/Row'
import Collapsible from '../../Collapsible/Collapsible'
import EditButton from '../../Button/EditButton'
import DeleteButton from '../../Button/DeleteButton'
import { formatDate } from '@/app/utils'
import Separator from '../../Separator/Separator'
import Text from '../../Text/Text'
import AddButton from '../../Button/AddButton'
import { EmployeeSkill } from '@/app/types/employee/skill'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useCreateSkill from '@/app/hooks/employees/skills/useCreateSkill'
import { useEditSkill } from '@/app/hooks/employees/certification/useEditCertification'
import { useDeleteSkill } from '@/app/hooks/employees/certification/useDeleteCertification'

type SkillsEmployeeProps = {
  skills: EmployeeSkill[] | undefined
}

export default function SkillsEmployee(props: SkillsEmployeeProps) {
  const { skills } = props
  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleSkillModal, setOpenHandleSkillModal] = useState(false)
  const [skillToEdit, setSkillToEdit] = useState<EmployeeSkill | null>(null)
  const [skillToDelete, setSkillToDelete] = useState<EmployeeSkill | null>(null)

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleSkillModal(true)
  }

  const handleOpenEditModal = (skill: EmployeeSkill) => {
    setActionModal('edit')
    setSkillToEdit(skill)
    setOpenHandleSkillModal(true)
  }

  const handleOpenAreYouSureModal = (skill: EmployeeSkill) => {
    setSkillToDelete(skill)
    setAreYouSureToDeleteOpen(true)
  }

  const { createSkill } = useCreateSkill()
  const { editSkill } = useEditSkill()
  const { deleteSkill } = useDeleteSkill()

  if (!skills || skills.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center">
        <Text
          header="h2"
          styles="text-digired2025-semibold text-center"
          text="Nenhuma habilidade técnica encontrada"
        />
        <AddButton
          id="add-skill"
          onClick={handleOpenAddModal}
          tooltipText="Adicionar Habilidade Técnica"
          size="h-20 w-20"
          widthTooltip="300"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center w-full gap-4">
        <Text
          header="h2"
          styles="text-digiblack2025-normal lg:text-left text-center"
          text={
            <span>
              Total de Habilidades Técnicas:{' '}
              <strong>{skills?.length || 0}</strong>
              <span className="text-digiblack1212-semibold">
                {' '}
                (Lista de Habilidades Técnicas associadas a este colaborador)
              </span>
            </span>
          }
        />
        <AddButton
          id="add-skill"
          onClick={handleOpenAddModal}
          tooltipText="Adicionar Habilidade Técnica"
          size="h-10 w-10"
        />
      </div>

      <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
        {skills?.map((skill, index) => (
          <div
            key={skill?.id}
            className="flex flex-col gap-4"
          >
            <Collapsible
              header={
                <div className="flex flex-row items-start lg:items-center justify-between gap-2">
                  <Row extraStyles="flex-1">
                    <Label
                      label="Nome da Habilidade Técnica"
                      value={skill?.name || undefined}
                    />
                    <Label
                      label="Nível"
                      value={skill?.level || undefined}
                    />
                    <Label
                      label="Data de Aquisição"
                      value={
                        skill?.acquiredAt
                          ? formatDate(skill?.acquiredAt)
                          : undefined
                      }
                    />
                  </Row>
                  <div className="flex flex-row gap-2 pt-2 lg:pt-0">
                    <EditButton
                      id={`edit-skill-${skill?.id}`}
                      onClick={() => handleOpenEditModal(skill)}
                      tooltipText="Editar Habilidade Técnica"
                      hasTooltip={true}
                    />
                    <DeleteButton
                      id={`delete-skill-${skill?.id}`}
                      onClick={() => handleOpenAreYouSureModal(skill)}
                      tooltipText="Remover Habilidade Técnica"
                      hasTooltip={true}
                    />
                  </div>
                </div>
              }
              buttonId={`toggle-skill-${skill?.id}`}
              fullWidth
            >
              <Row>
                <Label
                  label="Descrição"
                  value={skill?.description || undefined}
                />
              </Row>
            </Collapsible>
            {index < skills.length - 1 && <Separator />}
          </div>
        ))}
      </div>
      {/* TODO: missing modals */}
    </div>
  )
}
