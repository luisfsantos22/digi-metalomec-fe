import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import DetailsEmployee from '@/app/components/pages/employee/DetailsEmployee'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

interface PageProps {
  params?: Promise<{ id: string }>
}

const DetailEmployeePage = async ({ params }: PageProps) => {
  const resolvedParams = await params
  const employeeId = resolvedParams?.id ?? ''

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
            {
              name: 'Detalhes do Colaborador',
              href: `/employee/details/${employeeId}`,
            },
          ]}
        />
        <DetailsEmployee session={session} />
      </div>
    </GeneralLayout>
  )
}

export default DetailEmployeePage
