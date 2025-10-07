export const checkIfEveryObjectHasAValue = (
  obj: Record<string, any>
): boolean => {
  if (Object.keys(obj).length === 0) {
    return false
  }

  return Object.values(obj).every(
    (value) =>
      value !== '' &&
      value !== undefined &&
      value !== null &&
      value !== 0 &&
      value !== false &&
      (typeof value !== 'object' || Object.keys(value).length !== 0)
  )
}

export const checkIfAtLeastOneObjectHasAValue = (
  obj: Record<string, any>
): boolean => {
  if (Object.keys(obj).length === 0) {
    return false
  }

  return Object.values(obj).some(
    (value) =>
      value !== '' &&
      value !== undefined &&
      value !== null &&
      value !== 0 &&
      value !== false &&
      (typeof value !== 'object' || Object.keys(value).length !== 0)
  )
}
