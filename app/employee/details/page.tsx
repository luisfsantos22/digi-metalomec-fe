import authOptions from '@/app/api/auth/[...nextauth]/auth'
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb'
import GeneralLayout from '@/app/components/Layout/GeneralLayout'
import DetailsEmployee from '@/app/components/pages/employee/DetailsEmployee'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const DetailEmployeePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const employeeId = searchParams.id

  return (
    <GeneralLayout session={session}>
      <div className="flex flex-col gap-4 w-full">
        <Breadcrumb
          paths={[
            { name: 'Colaboradores', href: '/dashboard?module=employees' },
            {
              name: 'Detalhes do Colaborador',
              href: `/employee/details?id=${employeeId}`,
            },
          ]}
        />
        <DetailsEmployee session={session} />
      </div>
    </GeneralLayout>
  )
}

export default DetailEmployeePage
