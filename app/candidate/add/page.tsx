export const metadata = {
  title: 'Novo Candidato - Digiauto',
  description:
    'Crie um novo candidato para a sua empresa, adicionando todos os detalhes necessários.',
  openGraph: {
    title: 'Novo Candidato - Digiauto',
    description:
      'Crie um novo candidato para a sua empresa, adicionando todos os detalhes necessários.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import CreateCandidate from '@/app/components/pages/candidate/CreateCandidate'

const CreateCandidatePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <GeneralLayout session={session}>
      <div className="flex flex-col gap-4 w-full">
        <Breadcrumb
          paths={[
            { name: 'Candidatos', href: '/dashboard?module=candidates' },
            { name: 'Novo Candidato', href: '/candidate/create' },
          ]}
        />
        <CreateCandidate session={session} />
      </div>
    </GeneralLayout>
  )
}

export default CreateCandidatePage
