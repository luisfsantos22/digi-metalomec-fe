import { classNames } from 'utils'
import Image from 'next/image'
import GenericTooltip from '../Tooltip/GenericTooltip'

type PreviewButtonProps = {
  onClick?: () => void
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  text?: string
  type: 'submit' | 'button'
  disabled?: boolean
  id: string
  extraStyles?: string
  onlyIcon?: boolean
  widthIcon?: number
  heightIcon?: number
  hasTooltip?: boolean
  tooltipText?: string
}

const PreviewButton = (props: PreviewButtonProps) => {
  const {
    onClick,
    fullWidth = false,
    size = 'medium',
    text,
    type,
    disabled,
    id,
    extraStyles,
    onlyIcon,
    widthIcon = 20,
    heightIcon = 20,
    tooltipText = 'Pré-visualizar',
    hasTooltip = false,
  } = props

  return (
    <>
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        id={id}
        className={classNames(
          fullWidth && 'w-full',
          extraStyles,
          size === 'small'
            ? 'p-1 text-digiblack1212-semibold'
            : size === 'medium'
              ? 'p-2 text-digiblack1420-semibold'
              : size === 'large' && 'p-3 text-digiblack2025-semibold',
          'disabled:!text-gray-500 disabled:hover:cursor-not-allowed disabled:bg-gray-200',
          'flex self-center justify-center items-center cursor-pointer rounded-full bg-digiblue hover:bg-digiblue-hover'
        )}
      >
        <Image
          src="/icons/eye.svg"
          alt="Preview Icon"
          width={widthIcon}
          height={heightIcon}
        />
        {onlyIcon ? null : text}
      </button>
      {hasTooltip && (
        <GenericTooltip
          text={tooltipText}
          id="preview-button-tooltip"
          anchorSelect={id}
        />
      )}
    </>
  )
}

export default PreviewButton
