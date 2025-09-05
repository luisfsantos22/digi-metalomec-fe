export const metadata = {
  title: 'Editar Colaborador - Digiauto',
  description: 'Edite os detalhes do colaborador na sua empresa.',
  openGraph: {
    title: 'Editar Colaborador - Digiauto',
    description: 'Edite os detalhes do colaborador na sua empresa.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import CreateEmployee from '@/app/components/pages/employee/CreateEmployee'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import EditEmployee from '@/app/components/pages/employee/EditEmployee'

const CreateEmployeePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <GeneralLayout session={session}>
      <div className="flex flex-col gap-4 w-full">
        <Breadcrumb
          paths={[
            { name: 'Colaboradores', href: '/dashboard?module=employees' },
            { name: 'Editar Colaborador', href: '/employee/edit' },
          ]}
        />
        <EditEmployee />
      </div>
    </GeneralLayout>
  )
}

export default CreateEmployeePage
