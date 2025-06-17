import { classNames } from '@/utils/index'
import GenericTooltip from '../Tooltip/GenericTooltip'

type NavbarMobileButtonProps = {
  onClick?: () => void
  text: string
  type: 'submit' | 'button'
  isActive: boolean
  disabled?: boolean
  id: string
}

const NavbarMobileButton = (props: NavbarMobileButtonProps) => {
  const { onClick, text, type, isActive, disabled = false, id } = props

  return (
    <>
      <button
        id={id}
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={classNames(
          isActive
            ? 'bg-digigold text-digiwhite1624-semibold'
            : 'bg-white text-digiblack1624-semibold',
          'flex self-center w-full px-4 py-2  justify-center items-center cursor-pointer',
          'disabled:!text-gray-200 disabled:cursor-not-allowed',
          'rounded-xs bg-digigold hover:bg-digigold-hover'
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
