// component to show the progress of a task
import React, { Fragment } from 'react'
import Text from '../Text/Text'
import { classNames, isDesktopSize } from '@/utils'
import Image from 'next/image'
import { useWindowSize } from '@/utils/hooks'

type ProgressBarWithNamesProps = {
  currentStep: number
  totalSteps: string[]
  onClick?: (step: number) => void
  setCurrentStep: (step: number) => void
}

const ProgressBarWithNames = (props: ProgressBarWithNamesProps) => {
  const { currentStep, totalSteps, onClick, setCurrentStep } = props

  const screenSize = useWindowSize()
  const isDesktop = isDesktopSize(screenSize)
  const stepsCount = totalSteps.length

  return (
    <div className="flex items-center self-center gap-1 w-full lg:w-2/4 flex-wrap">
      {isDesktop && currentStep > 1 && (
        <div
          className="flex items-center justify-center py-2 px-2 bg-digiorange rounded-2xl hover:cursor-pointer"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <div className="flex flex-none h-4 w-4 items-start relative">
            <Image
              src={'/icons/arrow-left.svg'}
              alt={'Logo Arrow Left'}
              style={{ objectFit: 'contain' }}
              fill
            />
          </div>
        </div>
      )}
      {totalSteps.map((name, index) => {
        return (
          <Fragment key={index}>
            <div
              key={index}
              onClick={() => {
                if (onClick) {
                  onClick(index + 1)
                }
              }}
              className={classNames(
                index == currentStep - 1 ? 'bg-digiorange' : 'bg-gray-200',
                onClick && 'hover:cursor-pointer',
                'h-8 w-auto px-4  rounded-2xl flex items-center justify-center'
              )}
            >
              <Text
                text={isDesktop ? name : ((index + 1) as unknown as string)}
                styles="text-digibrown1212-bold"
              />
            </div>
            {index < stepsCount - 1 && (
              <div className={`h-1 flex-1 rounded-xl bg-gray-200`}></div>
            )}
          </Fragment>
        )
      })}
      {isDesktop && currentStep < totalSteps.length && (
        <div
          className="flex items-center justify-center py-2 px-2 bg-digiorange rounded-2xl hover:cursor-pointer"
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          <div className="flex flex-none h-4 w-4 items-start relative">
            <Image
              src={'/icons/arrow-right.svg'}
              alt={'Logo Arrow Right'}
              style={{ objectFit: 'contain' }}
              fill
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressBarWithNames
