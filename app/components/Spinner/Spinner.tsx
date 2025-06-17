import Image from 'next/image'

type SpinnerProps = {
  width?: number
  height?: number
}

const Spinner = (props: SpinnerProps) => {
  const { width = 128, height = 128 } = props

  return (
    <div className="relative flex items-center justify-center  backdrop-blur-md">
      <Image
        src="/gifs/loading.gif"
        alt="Loading..."
        width={width}
        height={height}
        unoptimized
      />
    </div>
  )
}

export default Spinner
