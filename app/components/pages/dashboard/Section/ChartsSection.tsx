'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ContainerCard from '../../../Card/ContainerCard'
import Text from '@/app/components/Text/Text'

export default function ChartsSection() {
  // Generate last 6 months labels
  const getLastMonths = () => {
    const months: string[] = []
    const currentDate = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      )
      months.push(date.toLocaleString('default', { month: 'short' }))
    }

    return months
  }

  const months = getLastMonths()

  type ChartData = {
    month: string
    value: number
  }

  const revenueData: ChartData[] = [
    { month: months[0], value: 18500 },
    { month: months[1], value: 20100 },
    { month: months[2], value: 19800 },
    { month: months[3], value: 21500 },
    { month: months[4], value: 22800 },
    { month: months[5], value: 24500 },
  ]

  const costsData: ChartData[] = [
    { month: months[0], value: 15200 },
    { month: months[1], value: 16100 },
    { month: months[2], value: 15900 },
    { month: months[3], value: 16800 },
    { month: months[4], value: 17200 },
    { month: months[5], value: 18100 },
  ]

  const formatEuro = (value: number) => `€${value.toLocaleString()}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContainerCard padding="p-5">
        <div className="flex flex-col gap-4">
          <Text
            styles="text-digiblack1825-semibold"
            text="Receita Mensal"
          />
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={revenueData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatEuro} />
              <Tooltip formatter={(value) => formatEuro(value as number)} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ContainerCard>

      <ContainerCard padding="p-6">
        <div className="flex flex-col text- gap-4">
          <Text
            styles="text-digiblack1825-semibold"
            text="Gastos Mensais"
          />
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={costsData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatEuro} />
              <Tooltip formatter={(value) => formatEuro(value as number)} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ContainerCard>
    </div>
  )
}
