// Centralized validators for forms

export const patterns = {
  firstName: /^.{2,}$/, // at least 2 characters
  lastName: /^.{2,}$/, // at least 2 characters
  phone: /^9\d{8}$/, // Portuguese mobile starts with 9 and has 9 digits
  nif: /^\d{9}$/, // NIF exactly 9 digits
  nationalId: /^\d{8}$/, // National ID (CC) exactly 8 digits
  socialSecurity: /^\d{11}$/, // SSN exactly 11 digits
  ehic: /^\d{20}$/, // European Health Insurance Card exactly 20 digits
  postalCode: /^\d{4}-\d{3}$/, // XXXX-XXX
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

export const messages = {
  required: 'Este campo é obrigatório',
  firstName: 'Nome deve ter pelo menos 2 caracteres',
  firstNameReq: 'Nome é obrigatório',
  lastName: 'Apelido deve ter pelo menos 2 caracteres',
  lastNameReq: 'Apelido é obrigatório',
  phone: 'Deve começar com 9 e ter 9 dígitos',
  nif: 'Deve ter exatamente 9 dígitos',
  nationalId: 'Deve ter exatamente 8 dígitos',
  socialSecurity: 'Deve ter exatamente 11 dígitos',
  ehic: 'Deve ter exatamente 20 dígitos',
  postalCode: 'Deve formatar: XXXX-XXX',
  email: 'Deve ter formato válido de email',
}

export function cleanPhone(value?: string | number | null) {
  if (!value) return ''
  // keep numbers only, remove spaces, punctuation and +351 country code
  let s = value.toString().replace(/[\s\-().]/g, '')
  s = s.replace(/^\+?351/, '')

  return s
}

export function validatePhone(value?: string | number | null) {
  const cleaned = cleanPhone(value)
  if (!cleaned) return messages.required
  if (!patterns.phone.test(cleaned)) return messages.phone

  return true
}

export function validateFirstName(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return messages.required

  return patterns.firstName.test(value.toString()) ? true : messages.firstName
}

export function validateLastName(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return messages.required

  return patterns.lastName.test(value.toString()) ? true : messages.lastName
}

export function validateNIF(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.nif.test(value.toString()) ? true : messages.nif
}

export function validateNationalId(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.nationalId.test(value.toString()) ? true : messages.nationalId
}

export function validateSocialSecurity(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.socialSecurity.test(value.toString())
    ? true
    : messages.socialSecurity
}

export function validateEHIC(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.ehic.test(value.toString()) ? true : messages.ehic
}

export function validatePostalCode(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.postalCode.test(value.toString()) ? true : messages.postalCode
}

export function validateEmail(value?: string | number | null) {
  if (!value || value.toString().trim() === '') return null

  return patterns.email.test(value.toString()) ? true : messages.email
}
