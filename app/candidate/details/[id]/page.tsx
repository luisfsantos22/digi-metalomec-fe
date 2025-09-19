import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import DetailsCandidate from '@/app/components/pages/candidate/DetailsCandidate'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface PageProps {
  params?: Promise<{ id: string }>
}

const DetailCandidatePage = async ({ params }: PageProps) => {
  const resolvedParams = await params
  const candidateId = resolvedParams?.id ?? ''

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
            {
              name: 'Detalhes do Candidato',
              href: `/candidate/details/${candidateId}`,
            },
          ]}
        />
        <DetailsCandidate
          candidateId={candidateId}
          session={session}
        />
      </div>
    </GeneralLayout>
  )
}

export default DetailCandidatePage
