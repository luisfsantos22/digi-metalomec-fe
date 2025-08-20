import React, { useEffect, useState } from 'react'
import { classNames } from '@/utils'
import Text from '../Text/Text'

export type FormCheckboxOption = {
  label: string
  value: string | number | boolean
}

export type FormCheckboxProps = {
  options: FormCheckboxOption[]
  selectedValues: Array<string | number | boolean>
  setSelectedValues: (values: Array<string | number | boolean>) => void
  label?: string
  error?: string | null
  mandatory?: boolean
  labelStyles?: string
  width?: string
  disabled?: boolean
  className?: string
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  options,
  selectedValues,
  setSelectedValues,
  label = '',
  error,
  mandatory = false,
  labelStyles = 'text-digiblack1624-semibold',
  width = 'w-full',
  disabled = false,
  className = '',
}) => {
  const [internalErrorStyles, setInternalErrorStyles] = useState(!!error)

  useEffect(() => {
    setInternalErrorStyles(!!error)
  }, [error])

  const handleChange = (value: string | number | boolean) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  return (
    <div
      className={classNames(
        width,
        'flex flex-col items-start justify-start gap-2',
        className
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
          <div className="flex flex-wrap gap-4">
            {options.map((opt) => (
              <label
                key={String(opt.value)}
                className={classNames(
                  'flex items-center gap-1 cursor-pointer',
                  error && internalErrorStyles
                    ? 'text-digired1624-semibold'
                    : 'text-digibrown1624-semibold'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={() => handleChange(opt.value)}
                  disabled={disabled}
                  className={classNames(
                    'form-checkbox',
                    error && internalErrorStyles
                      ? 'border-b-digired'
                      : selectedValues.includes(opt.value)
                        ? 'border-b-digibrown'
                        : 'border-b-gray-300',
                    'border-b p-2 focus:outline-none focus:border-b-digibrown focus:ring-0',
                    'disabled:cursor-not-allowed disabled:text-gray-400'
                  )}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
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

export default FormCheckbox
