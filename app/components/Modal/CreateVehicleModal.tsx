import { VehicleWorkshop } from '@/app/types/vehicle'
import { Modal } from '@mantine/core'
import Row from '../Row/Row'
import FormInput from '../Input/FormInput'
import SecondaryButton from '../Button/SecondaryButton'
import PrimaryButton from '../Button/PrimaryButton'
import useCreateVehicle from '@/app/hooks/workshop/useCreateVehicle'

type CreateVehicleModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  setNewVehicle: (vehicle: any) => void
  newVehicle: VehicleWorkshop | undefined
}

const CreateVehicleModal = (props: CreateVehicleModalProps) => {
  const { isOpen, onClose, onConfirm, setNewVehicle, newVehicle } = props

  const { createVehicle, error } = useCreateVehicle()

  const createExternalService = async () => {
    if (newVehicle) {
      await createVehicle(newVehicle)
      if (!error) {
        onConfirm()
      }
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Criar Veículo"
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
            label="Marca"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Marca"
            mandatory
            query={newVehicle?.brand || ''}
            setQuery={(value) =>
              setNewVehicle((prev) => ({
                ...prev,
                brand: value,
              }))
            }
            inputType="text"
            width="lg:w-1/3 w-full"
          />
          <FormInput
            label="Modelo"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Modelo"
            mandatory
            query={newVehicle?.model || ''}
            setQuery={(value) =>
              setNewVehicle((prev) => ({
                ...prev,
                model: value,
              }))
            }
            inputType="text"
            width="lg:w-1/3 w-full"
          />
          <FormInput
            label="Versão"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Versão"
            query={newVehicle?.version || ''}
            setQuery={(value) =>
              setNewVehicle((prev) => ({
                ...prev,
                version: value,
              }))
            }
            inputType="text"
            width="lg:w-1/3 w-full"
          />
        </Row>
        <Row>
          <FormInput
            label="Matrícula"
            labelStyles="text-digiblack1420-semibold flex gap-1"
            placeholder="Matrícula"
            mandatory
            query={newVehicle?.licensePlate || ''}
            setQuery={(value) =>
              setNewVehicle((prev) => ({
                ...prev,
                licensePlate: value,
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
            disabled={
              !(
                newVehicle?.licensePlate &&
                newVehicle?.brand &&
                newVehicle?.model
              )
            }
            extraStyles="!bg-digigold hover:!bg-digigold-hover"
            textDisabled="Preencher todos os campos obrigatórios"
          />
        </div>
      </div>
    </Modal>
  )
}

export default CreateVehicleModal
