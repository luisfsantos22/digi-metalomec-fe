import MetricCard from '@/app/components/Card/MetricCard'

export default function MetricsSection() {
  return (
    <div className="flex lg:flex-row flex-col lg:gap-5 gap-4 w-full items-center justify-between">
      <MetricCard
        label="Receita Total"
        value={24500}
        variation={12}
        type="currency"
      />
      <MetricCard
        label="Gastos Totais"
        value={12}
        variation={-2}
        type="currency"
      />
      <MetricCard
        label="Clientes Ativos"
        value={145}
        variation={8}
        type="client"
      />
      <MetricCard
        label="Colaboradores Ativos"
        value={12}
        variation={-2}
        type="employee"
      />
    </div>
  )
}
