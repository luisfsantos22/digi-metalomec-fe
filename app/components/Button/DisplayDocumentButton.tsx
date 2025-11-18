import { classNames } from 'utils'
import Image from 'next/image'
import Text from '../Text/Text'

type DisplayDocumentButtonProps = {
  tooltipText?: string
  hasTooltip?: boolean
  id: string
  onClick: () => void
  sizeContainer?: string
  extraStyles?: string
  typeBtn?: 'text' | 'icon'
  fileType: 'pdf' | 'png' | 'jpg' | 'jpeg'
  widthIcon?: number
  heightIcon?: number
}

const DisplayDocumentButton = (props: DisplayDocumentButtonProps) => {
  const {
    tooltipText = '',
    hasTooltip = false,
    id,
    onClick,
    sizeContainer = 'h-8 w-8',
    widthIcon = 24,
    heightIcon = 24,
    extraStyles = '',
    typeBtn = 'icon',
    fileType,
  } = props

  return (
    <div
      className={classNames(
        typeBtn === 'icon' ? sizeContainer : 'px-4 py-2',
        extraStyles,
        typeBtn === 'text' && 'rounded-2xl',
        'flex flex-none items-center relative justify-center hover:cursor-pointer hover:bg-digiblue-hover-options rounded-full'
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      id={id}
      data-tooltip-id={hasTooltip ? 'display-tooltip' : undefined}
      data-tooltip-content={hasTooltip ? tooltipText : undefined}
    >
      {typeBtn === 'icon' ? (
        <Image
          src={`/icons/${fileType}.svg`}
          alt={`Logo ${fileType.toUpperCase()}`}
          width={widthIcon}
          height={heightIcon}
        />
      ) : (
        <Text
          text="Visualizar"
          styles="lg:text-digiwhite1825-semibold text-digiwhite1420-semibold"
        />
      )}
    </div>
  )
}

export default DisplayDocumentButton
