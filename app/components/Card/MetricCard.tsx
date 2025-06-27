'use client'

import Image from 'next/image'
import ContainerCard from './ContainerCard'
import Text from '../Text/Text'
import GraphicIcon from '../Icon/GraphicIcon'
import Price from '../Text/Price'

interface MetricCardProps {
  label: string
  value: string | number
  variation: number
  type: 'currency' | 'client' | 'employee' | 'number'
}

export default function MetricCard({
  label,
  value,
  variation,
  type,
}: MetricCardProps) {
  const isPositive = variation >= 0

  return (
    <ContainerCard
      styles="flex flex-1"
      padding="p-5"
    >
      <div className="flex flex-col gap-2">
        <Text
          styles="text-digiblack1825-semibold"
          text={label}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-1 w-7 h-7 bg-digiblue-hover/20 rounded-lg">
            <Image
              src={
                type === 'currency'
                  ? '/icons/euro.svg'
                  : type === 'client'
                    ? '/icons/client-metric.svg'
                    : type === 'employee'
                      ? '/icons/employee-metric.svg'
                      : '/icons/number.svg'
              }
              alt="metric icon"
              width={20}
              height={20}
            />
          </div>
          {type === 'currency' ? (
            <Price
              value={value as number}
              styles="text-digiblack2432-semibold"
            />
          ) : (
            <Text
              styles="text-digiblack2432-semibold"
              text={value as string}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Text
            styles="text-gray1420-normal"
            text="vs. último mês: "
          />
          <GraphicIcon
            type={isPositive ? 'positive' : 'negative'}
            value={variation}
            size={16}
          />
        </div>
      </div>
    </ContainerCard>
  )
}
