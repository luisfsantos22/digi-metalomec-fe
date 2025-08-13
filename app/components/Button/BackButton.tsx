import { classNames } from '@/utils'
import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'

type BackButtonProps = {
  onClick: () => void
  id: string
  tooltipText?: string
  size?: string
  width?: string
}

const BackButton = (props: BackButtonProps) => {
  const {
    onClick,
    id,
    tooltipText = 'Voltar',
    size = 'h-8 w-8',
    width = 'auto',
  } = props

  return (
    <div
      id={id}
      className={classNames(
        size,
        'flex flex-none items-start relative hover:cursor-pointer hover:rounded-full hover:bg-digiblue/20'
      )}
      onClick={onClick}
    >
      <Image
        src={'/icons/arrow-left.svg'}
        alt={'Logo Arrow Left'}
        style={{ objectFit: 'contain' }}
        className="p-2"
        fill
      />
      <GenericTooltip
        text={tooltipText}
        anchorSelect={id}
        withArrow={false}
        width={width}
      />
    </div>
  )
}

export default BackButton
