import GeneralLayout from '../components/Layout/GeneralLayout'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import authOptions from '../api/auth/[...nextauth]/auth'
import DashboardContent from '../components/pages/dashboard/DashboardContent'

const Dashboard = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <GeneralLayout session={session}>
      <DashboardContent />
    </GeneralLayout>
  )
}

export default Dashboard
