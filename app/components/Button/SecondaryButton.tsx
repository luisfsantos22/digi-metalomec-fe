import { classNames } from '@/utils/index'
import Image from 'next/image'
import GenericTooltip from '../Tooltip/GenericTooltip'

type SecondaryButtonProps = {
  onClick?: () => void
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  text: string
  type?: 'submit' | 'button'
  disabled?: boolean
  active?: boolean
  id: string
  withImage?: boolean
  imageSrc?: string
}

const SecondaryButton = (props: SecondaryButtonProps) => {
  const {
    onClick,
    fullWidth = false,
    size = 'medium',
    text,
    type = 'button',
    disabled = false,
    active = false,
    id,
    withImage = false,
    imageSrc = '',
  } = props

  return (
    <>
      <button
        id={id}
        onClick={onClick}
        type={type}
        className={classNames(
          fullWidth && 'w-full',
          active
            ? 'bg-digiblue'
            : disabled
              ? 'bg-gray-200 hover:cursor-not-allowed'
              : 'bg-neutral-50 hover:bg-gray-200 border border-gray-200',
          size === 'small'
            ? classNames(
                active
                  ? 'text-digiwhite1212-semibold'
                  : 'text-digiblack1212-semibold hover:text-digiwhite1212-normal disabled:!text-gray-500',
                'px-2 py-1'
              )
            : size === 'medium'
              ? classNames(
                  active
                    ? 'text-digiwhite1624-semibold'
                    : 'text-digiblack1624-semibold hover:text-digiwhite1624-normal disabled:!text-gray-500',
                  'px-4 py-2'
                )
              : size === 'large' &&
                classNames(
                  active
                    ? 'text-digiwhite2025-semibold'
                    : 'text-digiblack2025-semibold hover:text-digiwhite2025-normal disabled:!text-gray-500',
                  'px-6 py-3'
                ),
          'flex gap-2 self-center justify-center items-center cursor-pointer rounded-xl'
        )}
        disabled={disabled}
      >
        {withImage && (
          <div className="flex flex-none h-6 w-6 items-start relative ">
            <Image
              src={imageSrc}
              alt={`${text} Image`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
        {text}
      </button>
      <GenericTooltip
        hidden={!disabled}
        text={'Disponível em breve'}
        anchorSelect={id}
      />
    </>
  )
}

export default SecondaryButton
