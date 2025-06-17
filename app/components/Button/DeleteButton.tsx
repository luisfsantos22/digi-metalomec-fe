import { classNames } from '@/utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'

type DeleteButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  size?: string
}

const DeleteButton = (props: DeleteButtonProps) => {
  const {
    tooltipText = '',
    hasTooltip = false,
    id,
    onClick,
    size = 'h-6 w-6',
  } = props

  return (
    <>
      <div
        className={classNames(
          size,
          'flex flex-none items-start relative hover:cursor-pointer'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        id={id}
      >
        <Image
          src={'/icons/delete-red.svg'}
          alt={'Logo Delete'}
          style={{ objectFit: 'contain' }}
          fill
        />
      </div>
      {hasTooltip && (
        <GenericTooltip
          text={tooltipText}
          anchorSelect={id}
          withArrow={false}
        />
      )}
    </>
  )
}

export default DeleteButton
