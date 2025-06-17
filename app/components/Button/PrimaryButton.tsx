import { classNames } from '@/utils/index'
import GenericTooltip from '../Tooltip/GenericTooltip'

type PrimaryButtonProps = {
  onClick?: () => void
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  text: string
  type: 'submit' | 'button'
  disabled?: boolean
  id: string
  textDisabled?: string
  extraStyles?: string
}

const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    onClick,
    fullWidth = false,
    size = 'medium',
    text,
    type,
    disabled = false,
    id,
    textDisabled = 'Disponível em breve',
    extraStyles = '',
  } = props

  return (
    <>
      <button
        id={id}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={classNames(
          fullWidth && 'w-full',
          extraStyles,
          size === 'small'
            ? 'px-2 py-1 text-digiblack1212-semibold'
            : size === 'medium'
              ? 'px-4 py-2 text-digiblack1624-semibold'
              : size === 'large' && 'px-6 py-3 text-digiblack2025-semibold',
          'disabled:!text-gray-500 disabled:hover:cursor-not-allowed disabled:bg-gray-200',
          'flex self-center justify-center items-center cursor-pointer rounded-xl bg-digigold hover:bg-digigold-hover'
        )}
      >
        {text}
      </button>
      <GenericTooltip
        hidden={!disabled}
        text={textDisabled}
        anchorSelect={id}
        position="top"
      />
    </>
  )
}

export default PrimaryButton
