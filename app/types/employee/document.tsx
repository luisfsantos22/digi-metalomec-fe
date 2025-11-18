export interface EmployeeDocument {
  id?: string
  documentType?: string
  title: string
  fileName?: string
  fileType?: string
  fileSize?: number
  downloadUrl?: string
  uploadedByName?: string
  createdAt?: string
  updatedAt?: string
  uploadedBy?: string
  employee?: string
  employeeName?: string
  expiryDate?: string | null
  notes?: string | null
  isExpired?: boolean
  daysUntilExpiry?: number | null
  isExpiringSoon?: boolean
  isContract?: boolean
  fileKey?: string
}

export interface DocumentUploadData {
  file: File
  title?: string
  documentType?: string
}
