import { classNames } from '@/utils'
import Text from '../Text/Text'
import { useEffect, useState } from 'react'

type FormInputProps = {
  query: string | number | undefined
  setQuery: (e: string) => void
  placeholder: string
  error?: string | null
  inputType?: 'text' | 'email' | 'password' | 'date' | 'number'
  mandatory?: boolean
  label?: string
  labelStyles?: string
  width?: string
  disabled?: boolean
  clearable?: boolean
}

const FormInput = (props: FormInputProps) => {
  const {
    query,
    setQuery,
    placeholder,
    error,
    inputType = 'text',
    mandatory = false,
    label = '',
    labelStyles = 'text-digiblack1624-semibold',
    width = 'w-full',
    disabled = false,
    clearable = false,
  } = props

  const [internalErrorStyles, setInternalErrorStyles] = useState(!!error)

  useEffect(() => {
    setInternalErrorStyles(!!error)
  }, [error])

  return (
    <div
      className={classNames(
        width,
        'flex flex-col items-start justify-start gap-2 w-full'
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
          <input
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            value={query}
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
