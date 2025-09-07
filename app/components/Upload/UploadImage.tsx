import { useRef } from 'react'
import React from 'react'
import Image from 'next/image'
import Text from '../Text/Text'
import { classNames } from '@/utils'

interface UploadImageProps {
  imageUrl?: string
  setImageUrl: (url: string) => void
  label?: string
  labelStyles?: string
  disabled?: boolean
  mandatory?: boolean
  uploadImage: (file: File) => Promise<string>
}

const UploadImage = ({
  imageUrl,
  setImageUrl,
  label = '',
  labelStyles = 'text-digiblack1624-semibold',
  disabled = false,
  mandatory = false,
  uploadImage,
}: UploadImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      setError(null)
      try {
        const url = await uploadImage(file)
        setImageUrl(url)
      } catch (err) {
        setError('Erro ao fazer upload da imagem.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClear = () => {
    setImageUrl('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 h-full w-full">
      <Text
        text={label}
        styles={error ? 'text-digired1624-semibold' : labelStyles}
        required={mandatory}
      />
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-4 w-full">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={disabled || loading}
            onChange={handleFileChange}
            className={classNames(
              'block w-full text-sm text-digibrown1624-semibold',
              'file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0',
              'file:text-sm file:font-semibold file:bg-digiblue-hover/10 file:text-digibrown hover:file:cursor-pointer hover:file:text-white hover:file:bg-digiblue-hover',
              'disabled:cursor-not-allowed disabled:text-gray-400 disabled:file:bg-gray-400/10 disabled:hover:file:bg-gray-400/10',
              'disabled:hover:file:text-gray-400 disabled:file:text-gray-400 disabled:file:cursor-not-allowed'
            )}
          />
          {loading && (
            <span className="text-digibrown text-sm">A carregar...</span>
          )}
          {imageUrl && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          )}
        </div>
        {error && <span className="text-digired1212-normal">{error}</span>}
        {imageUrl && (
          <div
            className="mt-2 max-h-32 relative"
            style={{ width: 'auto', height: '8rem' }}
          >
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadImage
