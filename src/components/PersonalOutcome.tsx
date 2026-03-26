import type { SimulationResult } from '../engine/types'
import { buildPersonalCashBreakdown } from '../engine/reserves'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function PersonalOutcome({ result, names }: Props) {
  const p = buildPersonalCashBreakdown(result)

  if (!p) {
    return (
      <section className="card personal-outcome muted">
        <h2>No bolso de {names.employeeShort} (fim do mês)</h2>
        <p className="muted-text">Preenche os dados com valores válidos para ver quanto fica para {names.employeeShort}.</p>
      </section>
    )
  }

  return (
    <section className="card personal-outcome">
      <p className="section-eyebrow">O mais importante para {names.employeeShort}</p>
      <h2>Quanto entra na conta pessoal de {names.employee}</h2>
      <p className="personal-hero">{formatEur(p.totalPersonalCash)}</p>
      <p className="personal-sub">
        Soma do <strong>salário líquido</strong> (após descontos no recibo) e das{' '}
        <strong>ajudas de custo</strong> que {names.companyShort} paga a {names.employeeShort}.
      </p>
      <div className="split-two">
        <div className="split-box">
          <span className="split-label">Salário líquido (estimativa)</span>
          <span className="split-value">{formatEur(p.netSalaryToAccount)}</span>
          <span className="split-hint">
            A empresa retém no recibo: Seg. Social ({formatEur(p.withheldEmployeeSs)}) e IRS (
            {formatEur(p.withheldIrs)}). Esses valores nunca chegam à tua conta — a empresa
            entrega-os directamente ao Estado.
          </span>
        </div>
        <div className="split-box">
          <span className="split-label">Ajudas de custo (reembolso)</span>
          <span className="split-value">{formatEur(p.allowancesToAccount)}</span>
          <span className="split-hint">
            Montante indicado; na prática deve corresponder a despesas reais e regras
            fiscais.
          </span>
        </div>
      </div>
    </section>
  )
}
