export const metadata = {
  title: 'Editar Candidato - Digiauto',
  description: 'Edite os detalhes do candidato na sua empresa.',
  openGraph: {
    title: 'Editar Candidato - Digiauto',
    description: 'Edite os detalhes do candidato na sua empresa.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import EditCandidate from '@/app/components/pages/candidate/EditCandidate'

const EditCandidatePage = async () => {
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
            { name: 'Editar Candidato', href: '/candidate/edit' },
          ]}
        />
        <EditCandidate />
      </div>
    </GeneralLayout>
  )
}

export default EditCandidatePage
