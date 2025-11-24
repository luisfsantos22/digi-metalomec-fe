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
  additionalText?: string
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
    additionalText = '',
  } = props

  const [internalErrorStyles, setInternalErrorStyles] = useState(!!error)

  useEffect(() => {
    if (error && inputType !== 'tel') {
      setInternalErrorStyles(!!error)
    }
  }, [error])

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
          internalErrorStyles && error
            ? 'text-digired1624-semibold'
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
                  query ? 'border-b-digibrown' : 'border-b-gray-300',
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
        {additionalText && (
          <Text
            text={additionalText}
            styles="text-digiblue1212-normal"
          />
        )}
        {internalErrorStyles && error && (
          <Text
            text={error}
            styles="text-digired1212-normal"
          />
        )}
      </div>
    </div>
  )
}

export default FormInput
