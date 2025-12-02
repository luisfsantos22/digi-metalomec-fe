/**
 * Parse backend validation errors and extract user-friendly messages
 * Handles both raw DB constraint errors and structured JSON errors
 */

interface ParsedError {
  field: 'email' | 'phoneNumber'
  message: string
}

/**
 * Parse duplicate key constraint errors from backend
 * @param validationErrors - Error object from API response
 * @param entityType - Type of entity ('candidato' or 'colaborador')
 * @returns Parsed error with field and message, or null if no duplicate error found
 */
export function parseDuplicateError(
  validationErrors: any,
  entityType: 'candidato' | 'colaborador'
): ParsedError | null {
  const detail = validationErrors?.detail?.toLowerCase() || ''
  const userErrors = validationErrors?.user || {}

  // Helper to get error message from structured errors
  const getErrorMsg = (field: any) => 
    field ? (Array.isArray(field) ? field[0] : field) : ''

  // Helper to check if error is duplicate-related
  const isDuplicateError = (msg: string) => /already exists|in use|exists/i.test(msg)

  // Define field configurations
  const fields = [
    {
      name: 'phoneNumber' as const,
      patterns: /phone_number|unique_user_phone/i,
      userField: userErrors.phone_number,
      extractRegex: /\)=\((?:[^,]+),\s*([^)]+)\)/,
      messages: {
        withValue: (val: string) => `Este número já está associado a outro ${entityType}.`,
        generic: 'Este número já se encontra em uso.',
      },
    },
    {
      name: 'email' as const,
      patterns: /email|unique_user_email/i,
      userField: userErrors.email,
      extractRegex: /\)=\((?:[^,]+),\s*([^)@\s]+@[^)\s]+)/,
      messages: {
        withValue: (val: string) => `Este email já está associado a outro ${entityType}.`,
        generic: 'Este email já se encontra em uso.',
      },
    },
  ]

  // Check each field
  for (const field of fields) {
    const hasPatternMatch = field.patterns.test(detail)
    const hasUserError = isDuplicateError(getErrorMsg(field.userField))

    if (hasPatternMatch || hasUserError) {
      const match = detail.match(field.extractRegex)
      const extractedValue = match?.[1]?.trim()

      return {
        field: field.name,
        message: extractedValue
          ? field.messages.withValue(extractedValue)
          : field.messages.generic,
      }
    }
  }

  return null
}

/**
 * Map all user validation errors to form fields
 * @param validationErrors - Error object from API response
 * @param setError - React Hook Form setError function
 */
export function mapUserValidationErrors(
  validationErrors: any,
  setError: any
): void {
  const userErrors = validationErrors?.user
  if (!userErrors || typeof userErrors !== 'object') return

  const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase())
  
  const translateMessage = (key: string, msg: string): string => {
    const isDuplicate = /already exists|in use|exists/i.test(msg)
    if (!isDuplicate) return msg
    
    if (key === 'email') return 'Este email já se encontra em uso.'
    if (['phone', 'phone_number', 'phoneNumber'].includes(key)) {
      return 'Este número já se encontra em uso.'
    }

    return msg
  }

  Object.entries(userErrors).forEach(([key, value]) => {
    const messages = Array.isArray(value) ? value : [value]
    if (messages.length === 0) return

    const camelKey = toCamel(key)
    const translatedMsg = translateMessage(key, messages[0])

    setError(`user.${camelKey}` as any, {
      type: 'server',
      message: translatedMsg,
    })
  })
}
