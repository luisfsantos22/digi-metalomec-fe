import { EmployeeDocument } from '@/app/types/employee/document'

export const mapDocument = (data: any): EmployeeDocument => {
  return {
    id: data.id || '',
    title: data.title || '',
    documentType: data.document_type || 'other',
    fileName: data.file_name || '',
    fileType: data.file_type || '',
    fileSize: data.file_size || 0,
    updatedAt: data.updated_at || '',
    createdAt: data.created_at || '',
    uploadedByName: data.uploaded_by_name || '',
    uploadedBy: data.uploaded_by || '',
    employee: data.employee || '',
    employeeName: data.employee_name || '',
    expiryDate: data.expiry_date || null,
    notes: data.notes || undefined,
    isExpired: data.is_expired || false,
    daysUntilExpiry: data.days_until_expiry || null,
    isExpiringSoon: data.is_expiring_soon || false,
    isContract: data.is_contract || false,
    fileKey: data.file_key || '',
    downloadUrl: data.download_url || '',
  }
}
