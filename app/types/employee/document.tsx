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
}

export interface DocumentUploadData {
  file: File
  title?: string
  documentType?: string
}
