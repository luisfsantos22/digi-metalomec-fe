type EmployeeContract = {
  id: string
  title: string
  documentType: 'contract' | 'other'
  fileName: string
  fileType: string
  fileSize: number
  isContract: boolean
  expiryDate: string | null
  createdAt: Date
}

export type { EmployeeContract }
