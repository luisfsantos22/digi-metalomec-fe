type EmployeeDocument = {
  id: string
  employee?: string
  employeeName: string
  documentType: string
  title: string
  fileKey: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedByName: string
  expiryDate?: string | null
  notes?: string | null
  isExpired?: boolean
  daysUntilExpiry?: number | null
  isExpiringSoon?: boolean
  isContract: boolean
  downloadUrl: string
  createdAt: Date
  updatedAt: Date
}

export type { EmployeeDocument }
