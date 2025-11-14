import useGetEmployeeContracts from '@/app/hooks/employees/documents/useGetEmployeeContracts'
import { Employee } from '@/app/types/employee/employee'
import Spinner from '../../Spinner/Spinner'
import Text from '../../Text/Text'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { EmployeeContract } from '@/app/types/utils/contract'
import Collapsible from '../../Collapsible/Collapsible'
import Row from '../../Row/Row'
import Label from '../../Label/Label'
import AddButton from '../../Button/AddButton'
import { formatDate } from '@/app/utils'
import EditButton from '../../Button/EditButton'
import DeleteButton from '../../Button/DeleteButton'
import Separator from '../../Separator/Separator'

type ContractEmployeeProps = {
  employee: Employee | null
}

export default function ContractEmployee(props: ContractEmployeeProps) {
  const { employee } = props

  const { data: session } = useSession()
  const accessToken = session?.accessToken || ''

  const [areYouSureToDeleteOpen, setAreYouSureToDeleteOpen] = useState(false)
  const [actionModal, setActionModal] = useState<'add' | 'edit'>('add')
  const [openHandleContractModal, setOpenHandleContractModal] = useState(false)
  const [contractToEdit, setContractToEdit] = useState<EmployeeContract | null>(
    null
  )
  const [contractToDelete, setContractToDelete] =
    useState<EmployeeContract | null>(null)

  const { contracts, error, loading, count } = useGetEmployeeContracts(
    employee?.id || ''
  )

  const handleOpenAddModal = () => {
    setActionModal('add')
    setOpenHandleContractModal(true)
  }

  const handleOpenEditModal = (contract: EmployeeContract) => {
    setActionModal('edit')
    setContractToEdit(contract)
    setOpenHandleContractModal(true)
  }

  const handleOpenAreYouSureModal = (contract: EmployeeContract) => {
    setContractToDelete(contract)
    setAreYouSureToDeleteOpen(true)
  }

  //   const { createEmployeeContract } = useCreateContract()
  //   const { editContract } = useEditContract()
  //   const { deleteContract } = useDeleteContract()

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex justify-center items-center p-4 h-full ">
          <Spinner />
        </div>
      ) : (
        // Render contracts or a message if no contracts are available
        <div className="flex flex-col gap-4 ">
          <Text
            text={'Contratos'}
            header="h1"
            styles=""
          />
          {contracts.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full gap-4">
                <Text
                  header="h2"
                  styles="text-digiblack2025-normal lg:text-left text-center"
                  text={
                    <span>
                      Total de Contratos: <strong>{count || 0}</strong>
                      <span className="text-digiblack1212-semibold">
                        {' '}
                        (Lista de Contratos já associadas a este colaborador)
                      </span>
                    </span>
                  }
                />
                <AddButton
                  id="add-contract"
                  onClick={handleOpenAddModal}
                  tooltipText="Adicionar Contrato"
                  size="h-10 w-10"
                  widthTooltip="300"
                />
              </div>

              <div className="flex flex-col gap-4 max-h-[25rem] overflow-y-auto border border-digiblue py-4 px-6 rounded-2xl">
                {contracts?.map((contract, index) => (
                  <div
                    key={contract?.id}
                    className="flex flex-col gap-4"
                  >
                    <Collapsible
                      header={
                        <div className="flex flex-row items-start lg:items-center justify-between gap-2">
                          <Row extraStyles="flex-1">
                            <Label
                              label="Título"
                              value={contract?.title || undefined}
                            />
                            <Label
                              label="Nome do Ficheiro"
                              value={contract?.fileName || undefined}
                            />

                            <Label
                              label="Tamanho do Ficheiro"
                              value={
                                contract?.fileSize
                                  ? `${(contract.fileSize / 1024).toFixed(
                                      2
                                    )} KB`
                                  : undefined
                              }
                            />
                          </Row>
                          <div className="flex flex-row gap-2 pt-2 lg:pt-0">
                            <EditButton
                              id={`edit-contract-${contract?.id}`}
                              onClick={() => handleOpenEditModal(contract)}
                              tooltipText="Editar Contrato"
                              hasTooltip={true}
                            />
                            <DeleteButton
                              id={`delete-contract-${contract?.id}`}
                              onClick={() =>
                                handleOpenAreYouSureModal(contract)
                              }
                              tooltipText="Remover Contrato"
                              hasTooltip={true}
                            />
                          </div>
                        </div>
                      }
                      buttonId={`toggle-contract-${contract?.id}`}
                      fullWidth
                    >
                      <Row>
                        <Label
                          label="Tipo de Ficheiro"
                          value={contract?.fileType || undefined}
                        />
                      </Row>
                      <Row>
                        <Label
                          label="Criado Em"
                          value={
                            contract?.createdAt
                              ? formatDate(contract.createdAt)
                              : undefined
                          }
                        />
                      </Row>
                    </Collapsible>
                    {index < count - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center">
              <Text
                header="h2"
                styles="text-digired2025-semibold text-center"
                text="Nenhuma certificação encontrada"
              />
              <AddButton
                id="add-contract"
                onClick={handleOpenAddModal}
                tooltipText="Adicionar Contrato"
                size="h-20 w-20"
                widthTooltip="300"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
