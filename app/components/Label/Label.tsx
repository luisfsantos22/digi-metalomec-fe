import dynamic from 'next/dynamic'
import Text from '../Text/Text'
const IntlTelInput = dynamic(() => import('intl-tel-input/reactWithUtils'), {
  ssr: false,
})
import 'intl-tel-input/styles'

import Image from 'next/image'

type LabelProps = {
  label: string
  value?: string
  labelStyles?: string
  valueStyles?: string
  placeholder?: string
  mandatory?: boolean
  type?: 'text' | 'email' | 'phone' | 'image'
  imageProps?: {
    src?: string
    alt?: string
    width?: number
    height?: number
    className?: string
  }
}

const Label = ({
  label,
  value,
  labelStyles = 'text-digiblack1624-semibold',
  valueStyles = 'text-digibrown1624-normal w-full focus:outline-none focus:border-b-digibrown focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 line-clamp-1 text-left border-b-gray-300',
  placeholder = 'Por Preencher...',
  mandatory = false,
  type = 'text',
  imageProps,
}: LabelProps) => {
  const placeholderStyles = 'text-gray-400 italic'

  return (
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      <Text
        text={label}
        styles={labelStyles}
        required={mandatory}
      />
      <div className="flex flex-col gap-0.5 w-full">
        <div className="relative w-full">
          {type === 'image' ? (
            <Image
              src={imageProps?.src || value || '/icons/user-man.svg'}
              alt={imageProps?.alt || 'Imagem'}
              width={imageProps?.width || 120}
              height={imageProps?.height || 80}
              priority
              className={
                imageProps?.className ||
                'w-full h-auto max-h-32 object-contain p-2 disabled:cursor-not-allowed disabled:text-gray-400 line-clamp-1 text-left border-b-gray-300'
              }
            />
          ) : type === 'phone' && value ? (
            <IntlTelInput
              initialValue={value || ''}
              inputProps={{
                placeholder: 'Por Preencher...',
              }}
              initOptions={{
                allowDropdown: false,
              }}
              disabled
            />
          ) : (
            <Text
              text={value ?? placeholder}
              styles={value ? valueStyles : placeholderStyles}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Label
