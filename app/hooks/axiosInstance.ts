import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
})

const requestInterceptor = async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers['Authorization'] = `Bearer ${session.accessToken}`
  }
  config.headers['Content-type'] = 'application/json'

  return config
}

const handleRequestError = (error) => {
  return Promise.reject(error)
}

const responseInterceptor = (response) => response

const handleResponseError = async (error) => {
  const originalRequest = error.config
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const session = await getSession()

    try {
      const { data } = await axiosInstance.post('/auth/refresh-token', {
        token: session?.refreshToken,
      })

      if (data?.accessToken) {
        return axiosInstance(originalRequest)
      }
    } catch {
      await signOut({ callbackUrl: '/auth/signin' })

      return Promise.reject(error)
    }
  }

  return Promise.reject(error)
}

axiosInstance.interceptors.request.use(requestInterceptor, handleRequestError)
axiosInstance.interceptors.response.use(
  responseInterceptor,
  handleResponseError
)

export default axiosInstance
