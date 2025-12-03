import useOutsideClick from '@/app/hooks/utils/useOutsideClick'
import { classNames } from 'utils'
import Image from 'next/image'
import React, { useState } from 'react'
import Text from '../Text/Text'

export type FormDropdownMultipleProps = {
  choices: {
    label: string
    value: string | boolean
  }[]
  selectedValues: Array<string | boolean>
  setSelectedValues: (values: Array<string | boolean>) => void
  label?: string
  labelStyles?: string
  error?: string | undefined
  placeholder: string
  disabled?: boolean
  mandatory?: boolean
  width?: string
  dropdownPosition?: 'top' | 'bottom'
}

const FormDropdownMultiple = (props: FormDropdownMultipleProps) => {
  const {
    choices,
    selectedValues,
    setSelectedValues,
    label = '',
    labelStyles = 'text-digiblack1624-semibold',
    error = undefined,
    placeholder,
    disabled = false,
    mandatory = false,
    width = 'w-full',
    dropdownPosition = 'bottom',
  } = props

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false))

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      setIsDropdownOpen((prev) => !prev)
    }
  }

  const handleCheckboxChange = (value: string | boolean) => {
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
        'flex flex-col items-start justify-start gap-2 w-full'
      )}
    >
      <Text
        text={label}
        styles={error ? 'text-digired1624-semibold' : labelStyles}
        required={mandatory}
      />
      <div className="flex flex-col items-start justify-start w-full relative">
        <div
          className={classNames(
            disabled && 'cursor-not-allowed text-gray-500',
            error
              ? 'border-b-digired text-digired1624-normal'
              : selectedValues.length > 0
                ? 'border-b-digibrown text-digibrown1624-semibold'
                : 'border-b-gray-300 text-placeholder-form ',
            'flex justify-between items-center gap-2 line-clamp-1 text-left',
            'border-b p-2 w-full focus:outline-none focus:border-b-digibrown focus:ring-0 hover:cursor-pointer'
          )}
          onClick={handleTriggerClick}
        >
          <Text
            text={
              selectedValues.length > 0
                ? choices
                    .filter((choice) => selectedValues.includes(choice.value))
                    .map((choice) => choice.label)
                    .join(', ')
                : placeholder
            }
            styles={classNames(
              disabled && 'cursor-not-allowed text-gray-500',
              error
                ? 'text-digired1624-normal'
                : selectedValues.length > 0
                  ? 'text-digibrown1624-semibold'
                  : 'text-placeholder-form',
              'line-clamp-1'
            )}
          />
          <div className="flex flex-none h-6 w-6 items-start relative">
            <Image
              src={
                isDropdownOpen ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'
              }
              alt={'Logo Image'}
              style={{ objectFit: 'contain' }}
              fill
              priority
            />
          </div>
        </div>
        <div
          className="w-full"
          ref={dropdownRef}
        >
          <div
            className={classNames(
              'absolute bg-white border border-gray-300 rounded-xl z-50 shadow-lg w-full',
              dropdownPosition === 'bottom' ? 'top-12' : 'bottom-12',
              isDropdownOpen ? 'max-h-80 overflow-y-auto' : 'hidden'
            )}
            id="dropdown-multiple"
          >
            {choices.map((choice, index) => (
              <label
                key={index}
                className={classNames(
                  'flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer',
                  selectedValues.includes(choice.value) &&
                    'text-digibrown1624-bold'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(choice.value)}
                  onChange={() => handleCheckboxChange(choice.value)}
                  disabled={disabled}
                  className="form-checkbox h-4 w-4 text-digibrown focus:ring-0"
                />
                {choice.label}
              </label>
            ))}
          </div>
        </div>
        <div className="min-h-4 flex items-start">
          {error && (
            <Text
              text={error}
              styles="text-digired1212-normal"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FormDropdownMultiple
