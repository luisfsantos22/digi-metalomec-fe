type GenericDocument = {
  id: string
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
  createdAt: string
  updatedAt: string
}

export type { GenericDocument }
