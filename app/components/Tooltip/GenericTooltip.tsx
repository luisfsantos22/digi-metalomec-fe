'use client'

import { classNames } from 'utils'
import { PlacesType, Tooltip } from 'react-tooltip'

type GenericTooltipProps = {
  text: string
  width?: string
  styles?: string
  position?: PlacesType
  hidden?: boolean
  anchorSelect: string
  withArrow?: boolean
}

export default function GenericTooltip(props: GenericTooltipProps) {
  const {
    text,
    width = 'auto',
    styles = 'text-digiwhite1624-semibold',
    position = 'top',
    hidden = false,
    anchorSelect,
    withArrow = true,
  } = props

  return (
    <Tooltip
      place={position}
      content={text}
      border={'1px solid gray'}
      className={classNames(styles, '!rounded-xl z-50')}
      hidden={hidden}
      anchorSelect={`#${anchorSelect}`}
      noArrow={!withArrow}
      style={{ width: width }}
    />
  )
}
