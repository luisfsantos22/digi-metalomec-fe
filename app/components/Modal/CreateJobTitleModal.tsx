import { Modal } from '@mantine/core'
import Row from '../Row/Row'
import FormInput from '../Input/FormInput'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import { GenericJobTitle } from '@/app/types/utils/job-title'
import useCreateJobTitle from '@/app/hooks/employees/useCreateJobTitle'

type CreateJobTitleModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (createdJobTitle: GenericJobTitle) => void
  setNewJobTitle: (jobTitle: any) => void
  newJobTitle: GenericJobTitle | undefined
}

const CreateJobTitleModal = (props: CreateJobTitleModalProps) => {
  const { isOpen, onClose, onConfirm, setNewJobTitle, newJobTitle } = props

  const { createJobTitle, error } = useCreateJobTitle()

  const createExternalService = async () => {
    if (newJobTitle) {
      const createdJobTitle = await createJobTitle(newJobTitle)
      if (createdJobTitle && !error) {
        onConfirm(createdJobTitle)
      }
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Criar Novo Cargo"
      centered
      transitionProps={{ transition: 'fade', duration: 400 }}
      size={'lg'}
      padding="lg"
      radius="12"
      styles={{
        title: {
          fontSize: '24px',
          fontWeight: '600',
          fontFamily: 'inter, sans-serif',
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <Row>
          <FormInput
            label="Nome do Cargo"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Nome do Cargo"
            mandatory
            query={newJobTitle?.name || ''}
            setQuery={(value) =>
              setNewJobTitle((prev) => ({
                ...prev,
                name: value,
              }))
            }
            inputType="text"
            width=" w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Descrição"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Descrição do Cargo"
            mandatory={false}
            query={newJobTitle?.description || ''}
            setQuery={(value) =>
              setNewJobTitle((prev) => ({
                ...prev,
                description: value,
              }))
            }
            inputType="text"
            width="w-full"
          />
        </Row>
        <div className="flex justify-end gap-4">
          <SecondaryButton
            text="Cancelar"
            id="cancel-btn"
            onClick={onClose}
          />
          <PrimaryButton
            type="button"
            text={'Criar'}
            id="primary-btn"
            onClick={createExternalService}
            disabled={!(newJobTitle?.name && newJobTitle?.description)}
            extraStyles="!bg-digiblue hover:!bg-color-digiblue-hover-options"
            textDisabled="Preencher todos os campos obrigatórios"
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateJobTitleModal
