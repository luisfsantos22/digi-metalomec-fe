import { classNames } from '@/utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'
import Text from '../Text/Text'

type DeleteButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  size?: string
  extraStyles?: string
  typeBtn?: 'text' | 'icon'
}

const DeleteButton = (props: DeleteButtonProps) => {
  const {
    tooltipText = '',
    hasTooltip = false,
    id,
    onClick,
    size = 'h-6 w-6',
    extraStyles = '',
    typeBtn = 'icon',
  } = props

  return (
    <>
      <div
        className={classNames(
          typeBtn === 'icon' ? size : 'px-4 py-2',
          extraStyles,
          typeBtn === 'text' && 'rounded-2xl',
          'flex flex-none items-center relative hover:cursor-pointer'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        id={id}
      >
        {typeBtn === 'icon' ? (
          <Image
            src={'/icons/delete-red.svg'}
            alt={'Logo Delete'}
            style={{ objectFit: 'contain' }}
            fill
          />
        ) : (
          <Text
            text="Remover"
            styles="lg:text-digiwhite1825-semibold text-digiwhite1420-semibold"
          />
        )}
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
