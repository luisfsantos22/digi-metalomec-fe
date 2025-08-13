export const metadata = {
  title: 'Novo Colaborador - Digiauto',
  description:
    'Crie um novo colaborador para a sua empresa, adicionando todos os detalhes necessários.',
  openGraph: {
    title: 'Novo Colaborador - Digiauto',
    description:
      'Crie um novo colaborador para a sua empresa, adicionando todos os detalhes necessários.',
    type: 'website',
  },
}

import { redirect } from 'next/navigation'
import CreateEmployee from '@/app/components/pages/employee/CreateEmployee'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'

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
            { name: 'Novo Colaborador', href: '/employee/create' },
          ]}
        />
        <CreateEmployee session={session} />
      </div>
    </GeneralLayout>
  )
}

export default CreateEmployeePage
