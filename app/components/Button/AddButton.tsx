import { classNames } from 'utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'

type AddButtonProps = {
  onClick: () => void | undefined
  id: string
  tooltipText?: string
  size?: string
  widthTooltip?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const AddButton = (props: AddButtonProps) => {
  const {
    onClick,
    id,
    tooltipText = '',
    size = 'lg:h-32 lg:w-32 w-10 h-10',
    widthTooltip = 'auto',
    position = 'bottom',
  } = props

  return (
    <div
      id={id}
      className={classNames(
        size,
        'flex flex-none hover:cursor-pointer items-center justify-center relative z-20'
      )}
      onClick={onClick}
    >
      <Image
        src={'/icons/add_circle.svg'}
        alt={'Add circle Image'}
        style={{ objectFit: 'contain' }}
        fill
      />
      <GenericTooltip
        text={tooltipText}
        anchorSelect={id}
        position={position}
        withArrow={false}
        width={widthTooltip}
      />
    </div>
  )
}

export default AddButton
