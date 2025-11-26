import { classNames } from 'utils'
import Text from '../Text/Text'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { pt } from 'intl-tel-input/i18n'
const IntlTelInput = dynamic(() => import('intl-tel-input/reactWithUtils'), {
  ssr: false,
})
import 'intl-tel-input/styles'
import { formatPhoneNumber } from '@/app/utils'
import {
  cleanPhone,
  patterns as validatorsPatterns,
  messages as validatorsMessages,
  validatePhone,
  validateEmail,
} from '@/app/validators/validation'

type ValidationRule = {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | true
}

type FormInputProps = {
  query: string | number | undefined
  setQuery: (e: string | number | Date | undefined) => void
  placeholder: string
  error?: string | null
  inputType?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel'
  mandatory?: boolean
  label?: string
  labelStyles?: string
  width?: string
  disabled?: boolean
  clearable?: boolean
  validation?: ValidationRule
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void
  onBlur?: (e: any) => void
}

const FormInput = (props: FormInputProps) => {
  const {
    query,
    setQuery,
    placeholder,
    error = null,
    inputType = 'text',
    mandatory = false,
    label = '',
    labelStyles = 'text-digiblack1624-semibold',
    width = 'w-full',
    disabled = false,
    clearable = false,
    validation,
    onValidationChange,
    onBlur,
  } = props

  const [internalErrorStyles, setInternalErrorStyles] = useState(!!error)
  const [realTimeError, setRealTimeError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  // Validation function - use centralized validators when available
  const validateValue = (value: string | number | undefined): string | null => {
    if (!validation) return null

    let stringValue = value?.toString() || ''

    // For phone numbers, use central cleaning
    if (inputType === 'tel') {
      stringValue = cleanPhone(stringValue)
    }

    // Required validation
    if (validation.required && (!stringValue || stringValue.trim() === '')) {
      return validatorsMessages.required
    }

    // Skip other validations if empty and not required
    if (!stringValue.trim() && !validation.required) return null

    if (validation.minLength && stringValue.length < validation.minLength)
      return `Deve ter pelo menos ${validation.minLength} caracteres`

    if (validation.maxLength && stringValue.length > validation.maxLength)
      return `Deve ter no máximo ${validation.maxLength} caracteres`

    // If specific pattern passed and we can match it to central ones, use central messages
    if (validation.pattern && !validation.pattern.test(stringValue)) {
      const src = validation.pattern.source
      if (src === validatorsPatterns.nif.source) return validatorsMessages.nif
      if (src === validatorsPatterns.nationalId.source)
        return validatorsMessages.nationalId
      if (src === validatorsPatterns.socialSecurity.source)
        return validatorsMessages.socialSecurity
      if (src === validatorsPatterns.phone.source)
        return validatorsMessages.phone
      if (src === validatorsPatterns.postalCode.source)
        return validatorsMessages.postalCode
      if (src === validatorsPatterns.ehic.source) return validatorsMessages.ehic
      if (src === validatorsPatterns.email.source)
        return validatorsMessages.email

      return 'Formato inválido'
    }

    // For extra checks (tel/email) when no pattern is provided
    if (inputType === 'tel') {
      const res = validatePhone(stringValue)

      return res === true ? null : res
    }
    if (inputType === 'email') {
      const res = validateEmail(stringValue)

      return res === true ? null : res
    }

    // Custom validation
    if (validation.custom) {
      const result = validation.custom(stringValue)
      if (result !== true) return result
    }

    return null
  }

  // Real-time validation effect
  useEffect(() => {
    // only show realtime errors if the field was touched, or there's a value present
    const validationError = validateValue(query)
    if (touched) {
      setRealTimeError(validationError)
    } else {
      setRealTimeError(null)
    }

    // Notify parent component of validation status
    if (onValidationChange) {
      onValidationChange(!validationError, validationError || undefined)
    }
  }, [query, validation])

  useEffect(() => {
    if (error) {
      setInternalErrorStyles(!!error)
    }
  }, [error, inputType])

  return (
    <div
      className={classNames(
        width,
        inputType === 'tel' ? 'gap-[1.375rem]' : 'gap-2',
        'flex flex-col items-start justify-start'
      )}
    >
      <Text
        text={label}
        styles={
          (internalErrorStyles && error) || realTimeError
            ? 'text-digired1420-semibold'
            : labelStyles
        }
        required={mandatory}
      />
      <div className="flex flex-col gap-0.5 w-full">
        <div className="relative w-full">
          {inputType === 'tel' ? (
            <IntlTelInput
              initialValue={
                typeof query === 'string' ? formatPhoneNumber(query) : ''
              }
              initOptions={{
                containerClass: classNames(
                  error && internalErrorStyles
                    ? 'border-b-digired'
                    : query
                      ? 'border-b-digibrown'
                      : 'border-b-gray-300',
                  'border-b text-digibrown1624-semibold focus:outline-none focus:border-b-digibrown focus:ring-0',
                  'disabled:cursor-not-allowed disabled:text-gray-400 outline-none'
                ),
                i18n: pt,
                initialCountry: 'pt',
              }}
              inputProps={{
                placeholder,
                onBlur: (e: any) => {
                  setTouched(true)
                  onBlur && onBlur(e)
                },
              }}
              onChangeNumber={(value) => {
                if (value !== query) {
                  setInternalErrorStyles(false)
                  setTouched(true)
                  setQuery(value)
                }
              }}
            />
          ) : (
            <input
              type={inputType}
              disabled={disabled}
              placeholder={placeholder}
              onBlur={(e) => {
                setTouched(true)
                onBlur && onBlur(e)
              }}
              value={query ? query : ''}
              onChange={(e) => {
                setInternalErrorStyles(false)
                setTouched(true)
                setQuery(e.target.value)
              }}
              className={classNames(
                error && internalErrorStyles
                  ? 'border-b-digired'
                  : query
                    ? 'border-b-digibrown'
                    : 'border-b-gray-300',
                'border-b p-2 text-digibrown1624-semibold  w-full focus:outline-none focus:border-b-digibrown focus:ring-0',
                'disabled:cursor-not-allowed disabled:text-gray-400 line-clamp-1 text-left'
              )}
            />
          )}
          {clearable && query && query?.toString().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
              }}
              className="absolute hover:cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        {(internalErrorStyles && error) || realTimeError ? (
          <Text
            text={error || realTimeError || ''}
            styles="text-digired1212-normal"
          />
        ) : null}
      </div>
    </div>
  )
}

export default FormInput
