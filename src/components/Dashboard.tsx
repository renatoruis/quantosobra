import type { SimulationResult } from '../engine/types'
import type { DisplayNames } from '../format'
import { formatEur, formatPercent } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function Dashboard({ result, names }: Props) {
  if (!result.valid) {
    return (
      <section className="card dashboard muted">
        <h2>Resumo</h2>
        <p className="error-text">Corrige os parâmetros para ver o resumo.</p>
      </section>
    )
  }

  const { taxes } = result

  return (
    <section className="card dashboard">
      <p className="section-eyebrow">Empresa + pessoal + Estado</p>
      <h2>Resumo do mês</h2>
      <div className="kpi-grid">
        <div className="kpi kpi-client">
          <span className="kpi-label">Total facturado (com IVA)</span>
          <span className="kpi-value">{formatEur(result.totalInvoiceValue)}</span>
        </div>
        <div className="kpi highlight">
          <span className="kpi-label">Líquido pessoal de {names.employeeShort}</span>
          <span className="kpi-value">{formatEur(result.totalPersonalIncome)}</span>
        </div>
        <div className="kpi kpi-company">
          <span className="kpi-label">Lucro líquido de {names.companyShort} (após IRC)</span>
          <span className="kpi-value">{formatEur(result.netProfit)}</span>
        </div>
        <div className="kpi kpi-state">
          <span className="kpi-label">Total de impostos (estimativa mensal)</span>
          <span className="kpi-value">{formatEur(result.totalTaxesSum)}</span>
        </div>
        <div className="kpi">
          <span className="kpi-label">% fora do teu bolso (sobre factura c/ IVA)</span>
          <span className="kpi-value">
            {formatPercent(result.effectiveTaxRateOnInvoiceWithVat)}
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-label">% fora do teu bolso (sobre receita s/ IVA)</span>
          <span className="kpi-value">
            {formatPercent(result.effectiveTaxRateOnRevenueExVat)}
          </span>
        </div>
      </div>
      <div className="tax-strip">
        <span>IVA: {formatEur(taxes.vat)}</span>
        <span>Seg. Social (empresa): {formatEur(taxes.employerSs)}</span>
        <span>Seg. Social (trabalhador): {formatEur(taxes.employeeSs)}</span>
        <span>IRS: {formatEur(taxes.irs)}</span>
        <span>IRC: {formatEur(taxes.irc)}</span>
        <span>Imposto ajudas: {formatEur(taxes.allowanceTax)}</span>
      </div>
    </section>
  )
}
