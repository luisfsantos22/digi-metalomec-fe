'use client'

import AddButton from '@/app/components/Button/AddButton'
import Text from '@/app/components/Text/Text'
// import { ClientFilters } from '@/app/types/client/client'
// import { classNames } from '@/utils'
// import { useWindowSize } from '@/utils/hooks'
// import { Alert } from '@mantine/core'
// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'
// import { useState } from 'react'

export default function ClientsPage() {
  // const { data: session } = useSession()
  // const screenSize = useWindowSize()
  // const isDesktop = isDesktopSize(screenSize)
  // const router = useRouter()
  // const accessToken = session?.accessToken

  // // Use States
  // const [refreshKey, setRefreshKey] = useState(0)
  // const [filters, setFilters] = useState<ClientFilters>({
  //   name: undefined,
  //   email: undefined,
  //   phone: undefined,
  // })

  // Hooks
  // const { clients, loading, error } = useClients(
  //   accessToken,
  //   refreshKey,
  //   filters
  // )

  // Functions
  // const handleDelete = async (uuid: string, token: string) => {
  //   await deleteClient(uuid, token)
  //   setAreYouSureToDeleteOpen(false)
  //   setSelectedClient(null)
  //   setRefreshKey((prev) => prev + 1)
  // }

  // if (error) {
  //   return (
  //     <div className="p-4">
  //       <Alert
  //         color="red"
  //         title="Error"
  //       >
  //         {error}
  //       </Alert>
  //     </div>
  //   )
  // }

  return (
    <Text
      text="Clientes - Em construção"
      header="h2"
      styles="text-digiblack3240-bold"
    />

    // <div className="flex flex-col gap-4 w-full">
    //   {/* <div className="mt-4">
    //         <ClientFiltersCard
    //           filters={filters}
    //           setFilters={setFilters}
    //         />
    //       </div> */}
    //   <div className="flex justify-between items-center w-full">
    //     <Text
    //       text={`Lista de Clients (${clients?.length})`}
    //       header="h2"
    //       styles={classNames(
    //         isDesktop
    //           ? 'text-digiblack2832-semibold'
    //           : 'text-digiblack2025-semibold'
    //       )}
    //     />
    //     {clients?.length > 0 && (
    //       <AddButton
    //         id="add-client-btn"
    //         onClick={() => {
    //           router.push('/workshop-module/client/create')
    //         }}
    //         tooltipText={'Criar novo cliente'}
    //         size="lg:w-20 lg:h-20 h-10 w-10"
    //         width={'300'}
    //       />
    //     )}
    //   </div>
    // </div>
  )
}
