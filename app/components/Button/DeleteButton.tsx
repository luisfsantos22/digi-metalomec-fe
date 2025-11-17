import { classNames } from 'utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'
import Text from '../Text/Text'

type DeleteButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  sizeContainer?: string
  extraStyles?: string
  typeBtn?: 'text' | 'icon'
  widthIcon?: number
  heightIcon?: number
  theme?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
}

const DeleteButton = (props: DeleteButtonProps) => {
  const {
    tooltipText = '',
    hasTooltip = false,
    id,
    onClick,
    sizeContainer = 'h-8 w-8',
    extraStyles = '',
    typeBtn = 'icon',
    widthIcon = 24,
    heightIcon = 24,
    theme = 'light',
    size = 'medium',
  } = props

  return (
    <>
      <div
        className={classNames(
          theme === 'light' &&
            (typeBtn === 'icon' ? sizeContainer : 'px-4 py-2'),
          extraStyles,
          typeBtn === 'text' ? 'rounded-2xl' : 'rounded-full',
          theme === 'dark'
            ? 'bg-digired/70 hover:bg-digired/90'
            : 'hover:bg-digiblue-hover-options',
          theme === 'dark' &&
            (size === 'small'
              ? 'p-1'
              : size === 'medium'
                ? 'p-2'
                : size === 'large' && 'p-3'),
          'flex flex-none items-center justify-center relative hover:cursor-pointer '
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        id={id}
      >
        {typeBtn === 'icon' ? (
          <Image
            src={
              theme === 'dark' ? '/icons/delete.svg' : '/icons/delete-red.svg'
            }
            alt={'Logo Delete'}
            width={widthIcon}
            height={heightIcon}
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
