import React, { useState } from 'react'
import SecondaryButton from '../Button/SecondaryButton'
import { classNames } from 'utils'

type CollapsibleProps = {
  header: React.ReactNode
  children: React.ReactNode
  initiallyOpen?: boolean
  showMoreText?: string
  showLessText?: string
  buttonId?: string
  buttonStyles?: string
  fullWidth?: boolean
}

const Collapsible: React.FC<CollapsibleProps> = ({
  header,
  children,
  initiallyOpen = false,
  showMoreText = 'Mais detalhes',
  showLessText = 'Menos detalhes',
  buttonId = '',
  buttonStyles = '',
  fullWidth = false,
}) => {
  const [open, setOpen] = useState(initiallyOpen)

  return (
    <div className="flex flex-col gap-2">
      {header}
      {open && <div className="mt-2">{children}</div>}
      <div className={classNames(fullWidth ? 'self-stretch' : 'self-start')}>
        <SecondaryButton
          id={buttonId}
          text={open ? showLessText : showMoreText}
          onClick={() => setOpen((prev) => !prev)}
          size="small"
          extraStyles={buttonStyles}
          fullWidth={fullWidth}
        />
      </div>
    </div>
  )
}

export default Collapsible
