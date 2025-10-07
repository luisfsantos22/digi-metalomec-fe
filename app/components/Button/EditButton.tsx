import { classNames } from 'utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'
import Text from '../Text/Text'

type EditButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  size?: string
  extraStyles?: string
  typeBtn?: 'text' | 'icon'
}

const EditButton = (props: EditButtonProps) => {
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
            src={'/icons/edit.svg'}
            alt={'Logo Edit'}
            style={{ objectFit: 'contain' }}
            fill
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
