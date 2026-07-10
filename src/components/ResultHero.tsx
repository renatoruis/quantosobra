import type { SimulationResult } from '../engine/types'
import { buildPersonalCashBreakdown } from '../engine/reserves'
import type { DisplayNames } from '../format'
import { formatEur, formatPercent } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function ResultHero({ result, names }: Props) {
  const p = buildPersonalCashBreakdown(result)

  if (!p) {
    return (
      <section className="card result-hero muted">
        <h2>Na tua conta pessoal</h2>
        <p className="muted-text">Preenche os dados com valores válidos para ver o resultado.</p>
      </section>
    )
  }

  return (
    <section className="card result-hero" aria-live="polite">
      <p className="section-eyebrow">Fim do mês</p>
      <h2>Na conta pessoal — {names.employee}</h2>
      <p className="result-hero-number">{formatEur(p.totalPersonalCash)}</p>
      <div className="split-two">
        <div className="split-box">
          <span className="split-label">Salário líquido</span>
          <span className="split-value">{formatEur(p.netSalaryToAccount)}</span>
          <span className="split-hint">
            Já sem Seg. Social ({formatEur(p.withheldEmployeeSs)}) e IRS (
            {formatEur(p.withheldIrs)}), retidos no recibo.
          </span>
        </div>
        <div className="split-box">
          <span className="split-label">Ajudas de custo + kms</span>
          <span className="split-value">{formatEur(p.allowancesToAccount)}</span>
          <span className="split-hint">Entram por inteiro — sem descontos no recibo.</span>
        </div>
      </div>
      <div className="result-chips">
        <div className="result-chip chip-company">
          <span className="result-chip-label">Fica na empresa</span>
          <strong className="result-chip-value">{formatEur(result.netProfit)}</strong>
        </div>
        <div className="result-chip chip-state">
          <span className="result-chip-label">Vai ao Estado</span>
          <strong className="result-chip-value">{formatEur(result.totalTaxesSum)}</strong>
        </div>
        <div className="result-chip chip-rate">
          <span className="result-chip-label">Da fatura, fora do bolso</span>
          <strong className="result-chip-value">
            {formatPercent(result.effectiveTaxRateOnInvoiceWithVat)}
          </strong>
        </div>
      </div>
    </section>
  )
}
