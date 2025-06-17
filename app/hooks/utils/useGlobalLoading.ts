import { globalLoadingAtom } from '@/app/atoms'
import { useAtom } from 'jotai'

export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useAtom(globalLoadingAtom)

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  return { isLoading, startLoading, stopLoading }
}
