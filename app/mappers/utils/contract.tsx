export const mapContract = (data: any) => ({
  id: data.id,
  title: data.title,
  documentType: data.document_type,
  fileName: data.file_name,
  fileType: data.file_type,
  fileSize: data.file_size,
  isContract: data.is_contract,
  expiryDate: data.expiry_date,
  notes: data.notes || undefined,
  createdAt: data.created_at,
})
