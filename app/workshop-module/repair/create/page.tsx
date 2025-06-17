export const metadata = {
  title: 'Nova Reparação - Digiauto',
  description:
    'Crie uma nova reparação para o seu veículo, adicionando todos os detalhes necessários.',
  openGraph: {
    title: 'Nova Reparação - Digiauto',
    description:
      'Crie uma nova reparação para o seu veículo, adicionando todos os detalhes necessários.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import WorkshopForm from '@/app/components/pages/workshop-module/repair/WorkshopForm'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'

const WorkshopCreate = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Breadcrumb
        paths={[
          { name: 'Reparações', href: '/workshop-module/repair' },
          { name: 'Nova Reparação', href: '/workshop-module/repair/create' },
        ]}
      />
      <WorkshopForm
        session={session}
        action="create"
      />
    </div>
  )
}

export default WorkshopCreate
