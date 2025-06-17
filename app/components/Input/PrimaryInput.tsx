import { classNames } from '@/utils'
import Text from '../Text/Text'

type PrimaryInputProps = {
  query: string
  setQuery: (e: string) => void
  placeholder: string
  error?: string | null
  inputType?: 'text' | 'email' | 'password'
  mandatory?: boolean
}

const PrimaryInput = (props: PrimaryInputProps) => {
  const {
    query,
    setQuery,
    placeholder,
    error,
    inputType = 'text',
    mandatory = false,
  } = props

  return (
    <div className="flex flex-col items-start justify-start gap-1 w-full">
      <input
        type={inputType}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required={mandatory}
        className={classNames(
          error ? 'border-digired' : 'border-gray-300',
          'border  p-2 rounded-xl w-full'
        )}
      />
      {error && (
        <Text
          text={error}
          styles="text-error-form"
        />
      )}
    </div>
  )
}

export default PrimaryInput
