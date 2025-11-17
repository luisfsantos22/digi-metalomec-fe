'use client'

import { classNames } from 'utils'
import { PlacesType, Tooltip } from 'react-tooltip'

type GenericTooltipProps = {
  text?: string | undefined
  width?: string
  styles?: string
  position?: PlacesType
  hidden?: boolean
  anchorSelect?: string
  withArrow?: boolean
  id?: string
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
    id,
  } = props

  return (
    <Tooltip
      id={id}
      place={position}
      content={text}
      border={'1px solid gray'}
      className={classNames(styles, '!rounded-xl z-50')}
      hidden={hidden}
      anchorSelect={anchorSelect ? `#${anchorSelect}` : undefined}
      noArrow={!withArrow}
      style={{ width: width }}
    />
  )
}
