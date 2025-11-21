type EmployeeContract = {
  id: string
  title: string
  documentType: 'contract' | 'other'
  fileName: string
  fileType: string
  fileSize: number
  isContract: boolean
  expiryDate: string | null
  notes?: string | undefined
  createdAt: string
}

export type { EmployeeContract }
