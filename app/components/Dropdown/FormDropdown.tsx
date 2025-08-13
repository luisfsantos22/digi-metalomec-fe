import useOutsideClick from '@/app/hooks/utils/useOutsideClick'
import { classNames } from '@/utils'
import Image from 'next/image'
import React, { useState } from 'react'
import Text from '../Text/Text'

type FormDropdownProps = {
  choices: {
    label: string
    value: string
  }[]
  selectedValue?: string
  setSelectedValue: (value: string) => void
  label?: string
  labelStyles?: string
  error?: string | undefined
  placeholder: string
  disabled?: boolean
  mandatory?: boolean
  width?: string
}

const FormDropdown = (props: FormDropdownProps) => {
  const {
    choices,
    selectedValue,
    setSelectedValue,
    label = '',
    labelStyles = 'text-digiblack1624-semibold',
    error = undefined,
    placeholder,
    disabled = false,
    mandatory = false,
    width = 'w-full',
  } = props

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false))

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event propagation
    if (!disabled) {
      setIsDropdownOpen((prev) => !prev) // Toggle dropdown
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
              : selectedValue
                ? 'border-b-digibrown text-digibrown1624-semibold'
                : 'border-b-gray-300 text-placeholder-form ',

            'flex justify-between items-center gap-2 line-clamp-1 text-left',
            'border-b p-2 w-full focus:outline-none focus:border-b-digibrown focus:ring-0 hover:cursor-pointer'
          )}
          onClick={handleTriggerClick}
        >
          <Text
            text={
              selectedValue
                ? (choices.find((choice) => choice.value === selectedValue)
                    ?.label ?? placeholder)
                : placeholder
            }
            styles={classNames(
              disabled && 'cursor-not-allowed text-gray-500',
              error
                ? 'text-digired1624-normal'
                : selectedValue
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
              'absolute bg-white border border-gray-300 rounded-xl z-50 shadow-lg w-full top-12',
              isDropdownOpen ? 'max-h-80 overflow-y-auto' : 'hidden'
            )}
            id="dropdown"
          >
            {choices.map((choice, index) => (
              <div
                key={index}
                className={classNames(
                  selectedValue === choice.value && ' text-digibrown1624-bold',
                  'p-2 hover:bg-gray-100 cursor-pointer'
                )}
                onClick={() => {
                  setSelectedValue?.(choice.value)
                  setIsDropdownOpen(false)
                }}
              >
                {choice.label}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Text
            text={error}
            styles="text-digired1212-normal"
          />
        )}
      </div>
    </div>
  )
}

export default FormDropdown
