'use client'
import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    heigth: undefined,
  })
  useEffect(() => {
     
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        heigth: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
return windowSize
}

export function useIsTruncated(ref) {
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const checkTruncation = () => {
      if (ref.current) {
        // Check if the element's height is greater than the visible height (indicating truncation)
        const { scrollHeight, clientHeight } = ref.current
        setIsTruncated(scrollHeight > clientHeight)
      }
    }

    checkTruncation() // Check on mount
    window.addEventListener('resize', checkTruncation) // Re-check on resize

    return () => {
      window.removeEventListener('resize', checkTruncation)
    }
  }, [ref])

  return isTruncated
}
