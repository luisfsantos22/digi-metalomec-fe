import { WorkshopFormData } from '@/app/types/workshop/workshop'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import ContainerCard from '../Card/ContainerCard'
import Text from '../Text/Text'
import FormInput from '../Input/FormInput'
import Row from '../Row/Row'
import PrimaryButton from '../Button/PrimaryButton'
import { Divider, Table } from '@mantine/core'
import { classNames, generateUuid } from '@/utils'
import Image from 'next/image'
import GenericTooltip from '../Tooltip/GenericTooltip'

type MaterialsRepairFormScreenProps = {
  formData: WorkshopFormData
  setValue: UseFormSetValue<WorkshopFormData>
  setAreYouSureModalOpen: (open: boolean) => void
  setSelectedMaterial: (
    material: WorkshopFormData['materials'][number] | undefined
  ) => void
  selectedMaterial?: WorkshopFormData['materials'][number] | undefined
}

import { useState } from 'react'
import MaterialsRepairModal from '../Modal/MaterialsRepairModal'
import AddButton from '../Button/AddButton'
import { MATERIAL_TABLE_LIST } from '@/app/constants'
import TableRow from '../Table/TableRow'
import DeleteButton from '../Button/DeleteButton'
import Price from '../Text/Price'

const MaterialsRepairFormScreen = (props: MaterialsRepairFormScreenProps) => {
  const {
    formData,
    setValue,
    setAreYouSureModalOpen,
    setSelectedMaterial,
    selectedMaterial,
  } = props
  const { materials } = formData

  const [showMaterialModal, setShowMaterialModal] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit'>('add')

  const handleDiferentialValue = (salePrice: number, buyPrice: number) => {
    return (salePrice - buyPrice).toFixed(2)
  }

  return (
    <>
      <ContainerCard
        padding="lg:p-8 p-4"
        styles="flex flex-col gap-4 w-full rounded-xl max-h-[40rem] overflow-y-auto"
      >
        <div className="flex items-center gap-2 justify-between w-full">
          <Text
            text="Materiais Ordenados para a Reparação"
            styles="text-digiblack2025-semibold"
          />
          <AddButton
            id="add-material-btn"
            onClick={() => {
              setAction('add')
              setShowMaterialModal(true)
            }}
            tooltipText={'Criar novo material'}
            size="lg:w-12 lg:h-12 h-10 w-10"
            width={'300'}
            position="top"
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {materials.length > 0 && (
            <Table
              striped
              withTableBorder
              highlightOnHoverColor="bg-digiorange/10"
              className="w-full"
            >
              <Table.Thead className="bg-digiorange">
                <Table.Tr>
                  {MATERIAL_TABLE_LIST.map((text) => (
                    <Table.Th
                      className="text-digibrown1624-bold"
                      key={text}
                    >
                      {text}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {materials.map((material, index) => (
                  <Table.Tr
                    key={index}
                    onClick={() => {
                      setAction('edit')
                      setSelectedMaterial(material)
                      setShowMaterialModal(true)
                    }}
                    className="hover:cursor-pointer hover:!bg-digiorange/20"
                  >
                    <TableRow>
                      <Text
                        text={material.description || '---'}
                        styles="text-digibrown1624-normal line-clamp-1 max-w-[20rem]"
                      />
                    </TableRow>
                    <TableRow>
                      <Text
                        text={material.date || ''}
                        styles="text-digibrown1624-normal"
                      />
                    </TableRow>
                    <TableRow>
                      <Price value={material.buyPrice || 0} />
                    </TableRow>
                    <TableRow>
                      <Price value={material.salePrice || 0} />
                    </TableRow>
                    <TableRow>
                      <Price
                        value={handleDiferentialValue(
                          material.salePrice || 0,
                          material.buyPrice || 0
                        )}
                        applyColorFormat
                      />
                    </TableRow>
                    <TableRow customStyles="!hover:bg-white/0 z-10">
                      <div className="flex justify-start items-center">
                        <DeleteButton
                          id={`delete-${material.uuid}`}
                          onClick={() => {
                            setAreYouSureModalOpen(true)
                            setSelectedMaterial(material)
                          }}
                          tooltipText="Remover Material"
                          hasTooltip
                        />
                      </div>
                    </TableRow>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          <div className="flex  lg:flex-row flex-col gap-4 items-center p-2 rounded-xl justify-center w-full text-digibrown2025-bold bg-digiorange/20">
            <div className="flex items-center gap-2">
              <Text
                text="Total de Despesas:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={materials
                  .reduce((acc, material) => {
                    return acc + (material.buyPrice || 0)
                  }, 0)
                  .toFixed(2)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Text
                text="Total de Vendas:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={materials
                  .reduce((acc, material) => {
                    return acc + (material.salePrice || 0)
                  }, 0)
                  .toFixed(2)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Text
                text="Total de Lucro:"
                styles="text-digibrown2025-semibold"
              />
              <Price
                value={materials
                  .reduce((acc, material) => {
                    return (
                      acc + (material.salePrice || 0) - (material.buyPrice || 0)
                    )
                  }, 0)
                  .toFixed(2)}
                applyColorFormat
              />
            </div>
          </div>
        </div>
      </ContainerCard>
      {showMaterialModal && (
        <MaterialsRepairModal
          isOpen={showMaterialModal}
          onClose={() => setShowMaterialModal(false)}
          onConfirm={() => {
            setShowMaterialModal(false)
            setSelectedMaterial(undefined)
          }}
          setValue={setValue}
          action={action}
          selectedMaterial={selectedMaterial}
          formData={formData}
          indexNumber={
            materials.findIndex(
              (material) => material.uuid === selectedMaterial?.uuid
            ) || -1
          }
        />
      )}
    </>
  )
}

export default MaterialsRepairFormScreen
