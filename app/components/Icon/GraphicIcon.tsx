import { classNames } from 'utils'
import Image from 'next/image'
import Text from '../Text/Text'

interface GraphicIconProps {
  type: 'negative' | 'positive'
  value: number
  size?: number
}

export default function GraphicIcon({
  type,
  value,
  size = 16,
}: GraphicIconProps) {
  const iconSrc =
    type === 'positive' ? '/icons/trend-up.svg' : '/icons/trend-down.svg'
  const bgColor = type === 'positive' ? 'bg-digigreen/20' : 'bg-digired/20'
  const valueStyle =
    type === 'positive'
      ? 'text-digigreen1420-normal'
      : 'text-digired1420-normal'

  return (
    <div
      className={classNames(
        bgColor,
        'flex items-center gap-1 px-2 py-1 rounded-lg'
      )}
    >
      <Image
        src={iconSrc}
        alt={`${type} graphic icon`}
        width={size}
        height={size}
      />
      <Text
        text={`${type === 'positive' ? '+' : ''}${value}%`}
        styles={valueStyle}
      />
    </div>
  )
}
