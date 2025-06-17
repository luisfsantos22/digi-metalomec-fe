export const metadata = {
  title: 'Editar Reparação - Digiauto',
  description: 'Edite os detalhes da reparação do seu veículo.',
  openGraph: {
    title: 'Editar Reparação - Digiauto',
    description: 'Edite os detalhes da reparação do seu veículo.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import WorkshopForm from '@/app/components/pages/workshop-module/repair/WorkshopForm'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'

const WorkshopEdit = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Breadcrumb
        paths={[
          { name: 'Reparações', href: '/workshop-module/repair' },
          { name: 'Editar Reparação', href: '/workshop-module/repair/edit' },
        ]}
      />
      <WorkshopForm
        action="edit"
        session={session}
      />
    </div>
  )
}

export default WorkshopEdit
