import type { SimulationInput, SimulationResult } from '../engine/types'
import {
  compareWithPermanentContract,
  EMPLOYMENT_PAYMENTS_PER_YEAR,
} from '../engine/employmentComparison'
import { formatEur } from '../format'

type Props = {
  input: SimulationInput
  result: SimulationResult
}

export function EmploymentComparison({ input, result }: Props) {
  if (!result.valid) return null
  const c = compareWithPermanentContract(input)

  if (!c) {
    return (
      <section className="card compare-section">
        <h2>B2B vs contrato sem termo</h2>
        <p className="muted-text">
          Indica uma faturação suficiente para calcular o contrato equivalente.
        </p>
      </section>
    )
  }

  const b2bNet = result.totalPersonalIncome
  const delta = b2bNet - c.netMonthlyAvg

  return (
    <section className="card compare-section">
      <h2>B2B vs contrato sem termo</h2>
      <p className="risk-lead">
        Se a consultoria gastasse o mesmo ({formatEur(c.annualBudget)}/ano) a
        contratar-te como funcionário — o «CLT» português.
      </p>

      <div className="split-two">
        <div className="split-box compare-box-b2b">
          <span className="split-label">B2B (cenário atual)</span>
          <span className="split-value">{formatEur(b2bNet)} /mês</span>
          <span className="split-hint">Salário líquido + ajudas de custo e kms.</span>
        </div>
        <div className="split-box">
          <span className="split-label">Contrato sem termo</span>
          <span className="split-value">{formatEur(c.netMonthlyAvg)} /mês</span>
          <span className="split-hint">
            Média mensal: 14 pagamentos líquidos + subsídio de refeição, ÷ 12.
          </span>
        </div>
      </div>

      <p className={`compare-delta${delta >= 0 ? '' : ' compare-delta-negative'}`}>
        {delta >= 0
          ? `O B2B deixa mais ${formatEur(delta)} por mês na tua conta.`
          : `O contrato sem termo deixa mais ${formatEur(-delta)} por mês na tua conta.`}
      </p>

      <table className="data-table">
        <tbody>
          <tr>
            <td>Salário bruto ({EMPLOYMENT_PAYMENTS_PER_YEAR} pagamentos/ano)</td>
            <td>{formatEur(c.grossMonthly)}</td>
          </tr>
          <tr>
            <td>Segurança Social (11%)</td>
            <td>−{formatEur(c.employeeSsPerPayment)}</td>
          </tr>
          <tr>
            <td>IRS (estimativa)</td>
            <td>−{formatEur(c.irsPerPayment)}</td>
          </tr>
          <tr>
            <td>Líquido por pagamento</td>
            <td>{formatEur(c.netPerPayment)}</td>
          </tr>
          <tr>
            <td>Subsídio de refeição (cartão, isento, ano)</td>
            <td>{formatEur(c.mealAllowanceAnnual)}</td>
          </tr>
          <tr className="strong">
            <td>Líquido anual total</td>
            <td>{formatEur(c.netAnnual)}</td>
          </tr>
        </tbody>
      </table>

      <p className="compare-note">
        O que o contrato sem termo dá e o B2B não: subsídio de desemprego, férias e
        baixas pagas, indemnização por despedimento e zero burocracia. O que o B2B dá:
        mais líquido, ajudas de custo isentas e independência — com contabilista para
        pagar e risco fiscal para gerir.
      </p>
    </section>
  )
}
