import Text from '../Text/Text'

type LabelProps = {
  label: string
  value?: string
  labelStyles?: string
  valueStyles?: string
  placeholder?: string
  mandatory?: boolean
}

const Label = ({
  label,
  value,
  labelStyles = 'text-digiblack1624-semibold',
  valueStyles = 'text-digibrown1624-normal w-full focus:outline-none focus:border-b-digibrown focus:ring-0 disabled:cursor-not-allowed disabled:text-gray-400 line-clamp-1 text-left border-b-gray-300',
  placeholder = 'Por Preencher...',
  mandatory = false,
}: LabelProps) => {
  const placeholderStyles = 'text-gray-400 italic'

  return (
    <div className="flex flex-col items-start justify-start gap-2 w-full">
      <Text
        text={label}
        styles={labelStyles}
        required={mandatory}
      />
      <div className="flex flex-col gap-0.5 w-full">
        <div className="relative w-full">
          {/* <input
            type="text"
            disabled
            value={value ?? ''}
            placeholder={placeholder || label}
            className={valueStyles}
          /> */}
          <Text
            text={value ?? placeholder}
            styles={value ? valueStyles : placeholderStyles}
          />
        </div>
      </div>
    </div>
  )
}

export default Label
