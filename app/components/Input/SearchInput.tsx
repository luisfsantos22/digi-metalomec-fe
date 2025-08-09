import { classNames, generateUuid, translateVehicleValue } from '@/utils'
import Text from '../Text/Text'
import Spinner from '../Spinner/Spinner'
import useOutsideClick from '@/app/hooks/utils/useOutsideClick'
import { useState } from 'react'
import { VehicleWorkshop } from '@/app/types/vehicle'
import CreateVehicleModal from '../Modal/CreateVehicleModal'
import { useSession } from 'next-auth/react'

type SearchInputProps = {
  query: string
  setQuery: (e: string) => void
  placeholder: string
  disabled?: boolean
  inputType?: 'text'
  mandatory?: boolean
  data: any[]
  error?: string
  width?: string
  dataIsLoading?: boolean
  label?: string
  labelStyles?: string
  value?: string
  setValue?: (value: string) => void
  setSelectedObj: (obj: any) => void
}

const SearchInput = (props: SearchInputProps) => {
  const {
    query,
    setQuery,
    placeholder,
    disabled = false,
    inputType = 'text',
    mandatory = false,
    data,
    dataIsLoading = false,
    error = undefined,
    width = 'w-full',
    label,
    labelStyles = 'text-digiblack1624-semibold',
    value,
    setValue,
    setSelectedObj,
  } = props

  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showCreateVehicleModal, setShowCreateVehicleModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState<VehicleWorkshop>({
    uuid: generateUuid(),
    licensePlate: '',
    brand: '',
    model: '',
    version: '',
    createdAt: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    availability: 'REPARING',
  })

  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false))

  return (
    <div
      className={classNames(
        width,
        'flex flex-col items-start justify-start gap-2'
      )}
    >
      {label && (
        <Text
          text={label}
          styles={error ? 'text-digired1624-semibold' : labelStyles}
          required={mandatory}
        />
      )}
      <div className="flex flex-col items-start justify-start gap-2 w-full relative">
        <div className="relative w-full">
          <input
            type={inputType}
            disabled={disabled}
            required={mandatory}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsDropdownOpen(true)
            }}
            className={classNames(
              error
                ? 'border-b-digired'
                : value
                  ? 'border-b-digibrown'
                  : 'border-b-gray-300',
              'border-b text-digibrown1624-semibold p-2 relative w-full focus:outline-none focus:border-b-digibrown focus:ring-0 '
            )}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setValue?.('')
                setSelectedObj(null)
                setIsDropdownOpen(false)
              }}
              className="absolute hover:cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        <div
          className="w-full"
          ref={dropdownRef}
        >
          <div
            className={classNames(
              'absolute bg-white border z-10 border-gray-300 rounded-xl shadow-lg w-full',
              isDropdownOpen && query?.length > 0
                ? 'max-h-80 overflow-y-auto'
                : 'hidden'
            )}
            id="dropdown"
          >
            {dataIsLoading ? (
              <div className="flex justify-center items-center p-4 h-full ">
                <Spinner
                  height={64}
                  width={64}
                />
              </div>
            ) : data?.length === 0 && query?.length > 0 ? (
              <div className="flex flex-col justify-center items-center p-4 h-full">
                <Text
                  text="Nenhum resultado encontrado."
                  styles="text-gray1624-normal"
                />
                <a
                  href="#"
                  className="text-digibrown1624-medium underline hover:bg-digibrown/10"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowCreateVehicleModal(true)
                  }}
                >
                  Crie um novo veículo
                </a>
              </div>
            ) : (
              data.map((obj, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setValue?.(obj.uuid)
                    setSelectedObj(obj)
                    setQuery(translateVehicleValue(obj))
                    setIsDropdownOpen(false)
                  }}
                >
                  {translateVehicleValue(obj)}
                </div>
              ))
            )}
          </div>
          {/* Error message */}
          {error && (
            <Text
              text={error}
              styles="text-red-500"
              id="error-message"
            />
          )}
        </div>
      </div>
      {showCreateVehicleModal && (
        <CreateVehicleModal
          isOpen={showCreateVehicleModal}
          onClose={() => {
            setShowCreateVehicleModal(false)
            setNewVehicle({
              uuid: generateUuid(),
              licensePlate: '',
              brand: '',
              model: '',
              version: '',
              createdAt: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
              availability: 'REPARING',
            })
          }}
          onConfirm={() => {
            setShowCreateVehicleModal(false)
            setValue?.(newVehicle?.uuid ?? '')
            setSelectedObj(newVehicle)
            setQuery(translateVehicleValue(newVehicle))
            setIsDropdownOpen(false)
          }}
          setNewVehicle={setNewVehicle}
          newVehicle={newVehicle}
        />
      )}
    </div>
  )
}

export default SearchInput
