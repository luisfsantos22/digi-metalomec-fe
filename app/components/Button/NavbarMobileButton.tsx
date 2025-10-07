import { classNames } from '@/utils/index'
import GenericTooltip from '../Tooltip/GenericTooltip'

type NavbarMobileButtonProps = {
  onClick?: () => void
  text: string
  type: 'submit' | 'button'
  isActive: boolean
  disabled?: boolean
  id: string
  secondary?: boolean
}

const NavbarMobileButton = (props: NavbarMobileButtonProps) => {
  const {
    onClick,
    text,
    type,
    isActive,
    disabled = false,
    id,
    secondary = false,
  } = props

  return (
    <>
      <button
        id={id}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={classNames(
          secondary
            ? 'bg-digired1624 text-digired1624-normal '
            : isActive
              ? 'bg-digiblue text-digiwhite1624-semibold'
              : 'bg-white text-digiblack1624-semibold',
          'flex self-center w-full px-4 py-2  justify-center items-center cursor-pointer',
          'disabled:!text-gray-200 disabled:cursor-not-allowed',
          'rounded-xs'
        )}
      >
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

export default NavbarMobileButton
