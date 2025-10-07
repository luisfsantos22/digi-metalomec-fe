import { AVAILABLE_ROLES } from '@/app/constants'

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const isMobileSize = (screenSize) => {
  return screenSize?.width < process.env.NEXT_PUBLIC_DESKTOP_WIDTH
}

export const isDesktopSize = (screenSize) => {
  return screenSize?.width >= process.env.NEXT_PUBLIC_DESKTOP_WIDTH
}

export const isHomePage = (router) => {
  return router?.pathname === '/'
}

export function translateRole(role) {
  for (const r of AVAILABLE_ROLES) {
    if (r.value === role) {
      return r.label
    }
  }

  return 'Utilizador'
}

export function requiredSpan() {
  return <span className="text-red-800">*</span>
}

export function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}
