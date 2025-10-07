import { classNames } from 'utils'
import { NumericFormat, numericFormatter } from 'react-number-format'

type TextProps = {
  value: number | string
  styles?: string
  applyColorFormat?: boolean
}

const Price = (props: TextProps) => {
  const {
    value = 0,
    styles = 'text-digiblack1624-normal',
    applyColorFormat = false,
  } = props

  return (
    <NumericFormat
      value={value}
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale
      prefix="€ "
      displayType="text"
      className={classNames(
        styles,
        applyColorFormat
          ? (value as number) < 0
            ? 'text-digired1624-semibold'
            : (value as number) > 0 && 'text-green-800'
          : ''
      )}
    />
  )
}

export default Price
