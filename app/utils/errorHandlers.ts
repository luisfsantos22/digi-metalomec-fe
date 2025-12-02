/**
 * Parse backend validation errors and extract user-friendly messages
 * Handles both raw DB constraint errors and structured JSON errors
 */

interface ParsedError {
  field: 'email' | 'phoneNumber'
  message: string
}

// Shared helpers
const isDuplicateErrorMsg = (msg: string) =>
  /already exists|in use|exists/i.test(msg)

const toCamelCase = (s: string) =>
  s.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase())

const DUPLICATE_MESSAGES = {
  phoneNumber: {
    withEntity: (entityType: string) =>
      `Este número já está associado a outro ${entityType}.`,
    generic: 'Este número já se encontra em uso.',
  },
  email: {
    withEntity: (entityType: string) =>
      `Este email já está associado a outro ${entityType}.`,
    generic: 'Este email já se encontra em uso.',
  },
}

/**
 * Parse duplicate key constraint errors from backend
 * @param validationErrors - Error object from API response
 * @param entityType - Type of entity ('candidato' or 'colaborador')
 * @returns Parsed error with field and message, or null if no duplicate error found
 */
function parseDuplicateError(
  validationErrors: any,
  entityType: 'candidato' | 'colaborador'
): ParsedError | null {
  // Support multiple backend response shapes (detail, error, message)
  const rawDetail =
    validationErrors?.detail ||
    validationErrors?.error ||
    validationErrors?.message ||
    ''
  const detail = rawDetail.toLowerCase()
  const userErrors = validationErrors?.user || {}

  // Helper to get error message from structured errors
  const getErrorMsg = (field: any) =>
    field ? (Array.isArray(field) ? field[0] : field) : ''

  // Define field configurations
  const fields = [
    {
      name: 'phoneNumber' as const,
      patterns: /phone_number|unique_user_phone/i,
      userField: userErrors.phone_number,
      extractRegex: /\)=\((?:[^,]+),\s*([^)]+)\)/,
    },
    {
      name: 'email' as const,
      patterns: /email|unique_user_email/i,
      userField: userErrors.email,
      extractRegex: /\)=\((?:[^,]+),\s*([^)@\s]+@[^)\s]+)/,
    },
  ]

  // Check each field
  for (const field of fields) {
    const hasPatternMatch = field.patterns.test(detail)
    const hasUserError = isDuplicateErrorMsg(getErrorMsg(field.userField))

    if (hasPatternMatch || hasUserError) {
      const match = detail.match(field.extractRegex)
      const extractedValue = match?.[1]?.trim()
      const msgs = DUPLICATE_MESSAGES[field.name]

      return {
        field: field.name,
        message: extractedValue
          ? msgs.withEntity(entityType)
          : msgs.generic,
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
function mapUserValidationErrors(
  validationErrors: any,
  setError: any
): void {
  const userErrors = validationErrors?.user
  if (!userErrors || typeof userErrors !== 'object') return

  const translateMessage = (key: string, msg: string): string => {
    if (!isDuplicateErrorMsg(msg)) return msg

    if (key === 'email') return DUPLICATE_MESSAGES.email.generic
    if (['phone', 'phone_number', 'phoneNumber'].includes(key)) {
      return DUPLICATE_MESSAGES.phoneNumber.generic
    }

    return msg
  }

  Object.entries(userErrors).forEach(([key, value]) => {
    const messages = Array.isArray(value) ? value : [value]
    if (messages.length === 0) return

    const camelKey = toCamelCase(key)
    const translatedMsg = translateMessage(key, messages[0])

    setError(`user.${camelKey}` as any, {
      type: 'server',
      message: translatedMsg,
    })
  })
}

/**
 * Apply validation errors from backend to form fields (duplicate, user, top-level).
 * Returns true if any validation errors were applied (so caller can stop processing).
 */
export function applyValidationErrorsToForm(
  validationErrors: any,
  setError: any,
  clearErrors?: any,
  entityType: 'candidato' | 'colaborador' = 'candidato'
): boolean {
  if (!validationErrors || typeof validationErrors !== 'object') return false

  // 1) duplicate (detail/error/message)
  const dup = parseDuplicateError(validationErrors, entityType)
  if (dup) {
    if (dup.field === 'phoneNumber') {
      clearErrors?.('user.email')
    } else {
      clearErrors?.('user.phoneNumber')
    }

    setError(`user.${dup.field}` as any, {
      type: 'server',
      message: dup.message,
    })

    return true
  }

  // 2) structured user errors
  mapUserValidationErrors(validationErrors, setError)

  // 3) other top-level array errors (e.g., jobTitles, country, etc.)
  Object.keys(validationErrors).forEach((key) => {
    if (key === 'user') return
    if (['detail', 'error', 'message'].includes(key)) return

    const msgs = validationErrors[key]
    if (Array.isArray(msgs) && msgs.length > 0) {
      setError(key as any, { type: 'server', message: msgs[0] })
    }
  })

  return true
}
