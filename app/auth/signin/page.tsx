export const metadata = {
  metadata: {
    title: 'Entrar - Digiauto',
    description: 'Aceda à sua conta na plataforma.',
    openGraph: {
      title: 'Entrar - Digiauto',
      description: 'Aceda à sua conta na plataforma.',
      type: 'website',
    },
  },
}

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import SignInForm from '@/app/components/Form/SignInForm'
import Text from '@/app/components/Text/Text'
import { TextCarousel } from '@/app/components/Carousel/TextCarousel'
import { CAROUSEL_TEXT_LIST } from '@/app/constants'
import authOptions from '@/app/api/auth/[...nextauth]/auth'

const SignInPage = async () => {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/workshop-module/repair')
  }

  return (
    <div className="flex items-center justify-center h-screen bg-digigold">
      <div className="flex lg:grid lg:grid-cols-2 w-full">
        {/* Form to sign in */}
        <div className="col-span-1 flex items-center justify-center max-w-[37.5rem] mx-auto p-4 relative w-full">
          <SignInForm />
        </div>
        <div
          className="relative col-span-1 bg-cover bg-center h-screen  items-center justify-center mx-auto w-full lg:flex hidden"
          style={{ backgroundImage: 'var(--color-bg-signin)' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <div className="flex flex-col gap-20 px-10 z-10">
            <Text
              text="Guiamos o Seu Stand para a Excelência Digital"
              styles="text-digiwhite4040-bold"
            />
            <div className="flex justify-center w-lg items-center self-center">
              <TextCarousel listText={CAROUSEL_TEXT_LIST} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
