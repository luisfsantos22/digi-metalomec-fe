import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'
import { AUTH_ENDPOINTS } from './api/endpoints'

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') // Remove trailing slash if present

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const requestInterceptor = async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers['Authorization'] = `Bearer ${session.accessToken}`
  }

  return config
}

const handleRequestError = (error) => {
  console.error('Request error:', {
    message: error.message,
    code: error.code,
    config: {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data,
    },
    response: error.response?.data,
  })

  return Promise.reject(error)
}

const responseInterceptor = (response) => response

const handleResponseError = async (error) => {
  console.error('Response error:', {
    status: error.response?.status,
    data: error.response?.data,
    headers: error.response?.headers,
  })

  // Don't attempt refresh if this is the login endpoint
  if (error.config?.url?.includes(AUTH_ENDPOINTS.login)) {
    return Promise.reject(error)
  }

  const originalRequest = error.config
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const session = await getSession()

    try {
      const { data } = await axiosInstance.post(AUTH_ENDPOINTS.refreshToken, {
        refresh: session?.refreshToken,
      })

      if (data?.access) {
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`

        return axiosInstance(originalRequest)
      }
    } catch (error) {
      console.error('Refresh token error:', error)
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
