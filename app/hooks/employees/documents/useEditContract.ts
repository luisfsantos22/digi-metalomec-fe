import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import axiosInstance from '../../axiosInstance'
import { EMPLOYEE_DOCUMENTS_ENDPOINTS } from '../../api/endpoints'
import snakecaseKeys from 'snakecase-keys'

interface ContractData {
  title: string
  expiryDate?: string | null
  notes?: string | undefined
}

export function useEditContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editContract = async (
    id: string | undefined,
    employeeId: string,
    contractData: ContractData,
    accessToken: string
  ) => {
    if (!id) {
      return false
    }
    setLoading(true)
    setError(null)

    const payload = snakecaseKeys(
      contractData as unknown as Record<string, unknown>,
      { deep: true }
    )
    const finalPayload = { ...payload, employee: employeeId }

    try {
      const response = await axiosInstance.put(
        EMPLOYEE_DOCUMENTS_ENDPOINTS.getDocumentById(id),
        finalPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (response.status === 200) {
        notifications.show({
          title: 'Sucesso',
          color: 'green',
          message: 'Contrato editado com sucesso!',
          position: 'top-right',
        })

        return true
      } else {
        notifications.show({
          title: 'Erro',
          color: 'red',
          message: 'Falha ao editar o contrato. Tente novamente.',
          position: 'top-right',
        })

        return false
      }
    } catch (err) {
      console.error('Failed to edit contract:', err)
      notifications.show({
        title: 'Erro',
        color: 'red',
        message: 'Falha ao editar o contrato. Tente novamente.',
        position: 'top-right',
      })
      setError('Um erro ocorreu ao editar o contrato')

      return false
    } finally {
      setLoading(false)
    }
  }

  return { editContract, loading, error }
}
