import MetricCard from '@/app/components/Card/MetricCard'

export default function MetricsSection() {
  return (
    <div className="flex lg:flex-row flex-col lg:gap-5 gap-4 w-full items-center justify-between">
      <MetricCard
        label="Receita Total"
        value={0}
        variation={0}
        type="currency"
      />
      <MetricCard
        label="Gastos Totais"
        value={0}
        variation={0}
        type="currency"
      />
      <MetricCard
        label="Clientes Ativos"
        value={'N/A'}
        variation={0}
        type="client"
      />
      <MetricCard
        label="Colaboradores Ativos"
        value={'N/A'}
        variation={0}
        type="employee"
      />
    </div>
  )
}
