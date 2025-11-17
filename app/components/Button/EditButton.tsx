import { classNames } from 'utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'
import Text from '../Text/Text'

type EditButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  sizeContainer?: string
  extraStyles?: string
  typeBtn?: 'text' | 'icon'
  widthIcon?: number
  heightIcon?: number
}

const EditButton = (props: EditButtonProps) => {
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
  } = props

  return (
    <>
      <div
        className={classNames(
          typeBtn === 'icon' ? sizeContainer : 'px-4 py-2',
          extraStyles,
          typeBtn === 'text' && 'rounded-2xl',
          'flex flex-none items-center justify-center relative hover:cursor-pointer hover:bg-digiblue-hover-options rounded-full'
        )}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        id={id}
      >
        {typeBtn === 'icon' ? (
          <Image
            src={'/icons/edit.svg'}
            alt={'Logo Edit'}
            width={widthIcon}
            height={heightIcon}
          />
        ) : (
          <Text
            text="Editar"
            styles="lg:text-digiblack1825-semibold text-digiblack1420-semibold"
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

export default EditButton
