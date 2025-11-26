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
  } = props

  const [internalErrorStyles, setInternalErrorStyles] = useState(!!error)
  const [realTimeError, setRealTimeError] = useState<string | null>(null)

  // Validation function
  const validateValue = (value: string | number | undefined): string | null => {
    if (!validation) return null

    let stringValue = value?.toString() || ''

    // For phone numbers, clean the value before validation (remove spaces, dashes, parentheses, etc.)
    if (inputType === 'tel') {
      stringValue = stringValue.replace(/[\s\-\(\)\.]/g, '')
      // Remove country code if present (+351, etc.)
      if (stringValue.startsWith('+')) {
        stringValue = stringValue.substring(1)
      }
      if (stringValue.startsWith('351')) {
        stringValue = stringValue.substring(3)
      }
    }

    // Required validation
    if (validation.required && (!stringValue || stringValue.trim() === '')) {
      return 'Este campo é obrigatório'
    }

    // Skip other validations if empty and not required
    if (!stringValue.trim() && !validation.required) {
      return null
    }

    // Min length validation
    if (validation.minLength && stringValue.length < validation.minLength) {
      return `Deve ter pelo menos ${validation.minLength} caracteres`
    }

    // Max length validation
    if (validation.maxLength && stringValue.length > validation.maxLength) {
      return `Deve ter no máximo ${validation.maxLength} caracteres`
    }

    // Pattern validation
    if (validation.pattern && !validation.pattern.test(stringValue)) {
      // Return specific error messages for common patterns
      if (validation.pattern.source === '^\\d{9}$') {
        return 'Deve ter exatamente 9 dígitos'
      }
      if (validation.pattern.source === '^\\d{8}$') {
        return 'Deve ter exatamente 8 dígitos'
      }
      if (validation.pattern.source === '^\\d{11}$') {
        return 'Deve ter exatamente 11 dígitos'
      }
      if (validation.pattern.source === '^9\\d{8}$') {
        return 'Deve começar com 9 e ter 9 dígitos'
      }
      if (validation.pattern.source === '^\\d{4}-\\d{3}$') {
        return 'Deve ter formato XXXX-XXX'
      }
      if (validation.pattern.source === '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$') {
        return 'Deve ter formato válido de email'
      }
      return 'Formato inválido'
    }

    // Custom validation
    if (validation.custom) {
      const result = validation.custom(stringValue)
      if (result !== true) {
        return result
      }
    }

    return null
  }

  // Real-time validation effect
  useEffect(() => {
    const validationError = validateValue(query)
    setRealTimeError(validationError)

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
              }}
              onChangeNumber={(value) => {
                if (value !== query) {
                  setInternalErrorStyles(false)
                  setQuery(value)
                }
              }}
            />
          ) : (
            <input
              type={inputType}
              disabled={disabled}
              placeholder={placeholder}
              value={query ? query : ''}
              onChange={(e) => {
                setInternalErrorStyles(false)
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
