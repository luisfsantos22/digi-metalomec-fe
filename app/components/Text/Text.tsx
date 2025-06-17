import { requiredSpan } from '@/utils'
import { RefObject } from 'react'

type TextProps = {
  text: string
  styles?: string
  header?: string
  required?: boolean
  id?: string
  ref?: RefObject<null>
}

const Text = (props: TextProps) => {
  const {
    text = '',
    styles = 'text-digiblack1624-normal',
    header,
    required = false,
    id,
    ref,
  } = props

  return header === 'h1' ? (
    <h1
      ref={ref}
      id={id}
      className={styles}
    >
      {required && requiredSpan()}
      {text}
    </h1>
  ) : header === 'h2' ? (
    <h2
      ref={ref}
      id={id}
      className={styles}
    >
      {required && requiredSpan()}
      {text}
    </h2>
  ) : header === 'h3' ? (
    <h3
      ref={ref}
      id={id}
      className={styles}
    >
      {required && requiredSpan()}
      {text}
    </h3>
  ) : (
    <p
      ref={ref}
      id={id}
      className={styles}
    >
      {required && requiredSpan()}
      {text}
    </p>
  )
}

export default Text
