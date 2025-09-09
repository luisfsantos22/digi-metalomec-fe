import Image from 'next/image'
import Text from '../Text/Text'
import { classNames } from 'utils'

interface ClearAllFiltersButtonProps {
  onClick: () => void
  label?: string
  width?: string
  id: string
  disabled?: boolean
}

const ClearAllFiltersButton = (props: ClearAllFiltersButtonProps) => {
  const {
    onClick,
    label = 'Limpar Filtros',
    width = 'w-full',
    id,
    disabled = false,
  } = props

  return (
    <div
      className={classNames(
        width,
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:cursor-pointer hover:underline',
        'flex gap-2 items-center '
      )}
      onClick={onClick}
    >
      <div
        className="flex flex-none h-4 w-4 items-start relative"
        id={id}
      >
        <Image
          src={'/icons/clear-all.svg'}
          alt={'Logo Clear All'}
          style={{ objectFit: 'contain' }}
          fill
        />
      </div>
      <Text
        text={label}
        styles="text-digiblack1420-semibold"
      />
    </div>
  )
}

export default ClearAllFiltersButton
