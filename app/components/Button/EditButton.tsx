import { classNames } from '@/utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'

type EditButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  size?: string
}

const EditButton = (props: EditButtonProps) => {
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
          src={'/icons/edit.svg'}
          alt={'Logo Edit'}
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

export default EditButton
