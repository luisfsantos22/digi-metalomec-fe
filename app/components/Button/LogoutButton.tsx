import GenericTooltip from '../Tooltip/GenericTooltip'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import Text from '../Text/Text'

type LogoutButtonProps = {
  isCollapsed: boolean
}

const LogoutButton = (props: LogoutButtonProps) => {
  const { isCollapsed } = props
  const id = 'logout-button'

  return (
    <div
      id={id}
      onClick={() => signOut()}
      className="flex gap-1 w-full justify-center items-center border-2 border-digibrown hover:cursor-pointer rounded-xl px-3 py-2 hover:bg-digiorange"
    >
      <div className="flex flex-none hover:cursor-pointer items-center justify-center relative w-6 h-6">
        <Image
          src={'/icons/logout.svg'}
          alt={'Logout icon'}
          style={{ objectFit: 'contain' }}
          fill
        />
      </div>
      {!isCollapsed ? (
        <Text
          text={'Terminar sessão'}
          styles="text-digibrown1624-semibold line-clamp-1"
        />
      ) : (
        <GenericTooltip
          text={'Terminar sessão'}
          anchorSelect={id}
          position="bottom"
          withArrow={false}
        />
      )}
    </div>
  )
}

export default LogoutButton
