import type { SimulationResult } from '../engine/types'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function CashFlowDiagram({ result, names }: Props) {
  if (!result.valid) return null

  const toState =
    result.taxes.vat +
    result.taxes.irc +
    result.taxes.employerSs +
    result.taxes.employeeSs +
    result.taxes.irs +
    result.taxes.allowanceTax

  const staysInCompany = result.accountantFeeTotal + result.netProfit

  return (
    <section className="card flow-section">
      <h2>Como o dinheiro se distribui</h2>

      <div className="flow-summary-box">
        <p className="flow-summary-title">
          <strong>De cada {formatEur(result.totalInvoiceValue)} que a consultoria paga:</strong>
        </p>
        <div className="flow-summary-destinations">
          <div className="flow-dest flow-dest-person">
            <span className="flow-dest-dot" />
            <div>
              <span className="flow-dest-label">Conta pessoal de {names.employeeShort}</span>
              <span className="flow-dest-value">{formatEur(result.totalPersonalIncome)}</span>
            </div>
          </div>
          <div className="flow-dest flow-dest-state">
            <span className="flow-dest-dot" />
            <div>
              <span className="flow-dest-label">Estado (impostos e contribuições)</span>
              <span className="flow-dest-value">{formatEur(toState)}</span>
            </div>
          </div>
          <div className="flow-dest flow-dest-company">
            <span className="flow-dest-dot" />
            <div>
              <span className="flow-dest-label">Fica na empresa (custos + lucro)</span>
              <span className="flow-dest-value">{formatEur(staysInCompany)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flow-pipeline" role="list">
        <div className="flow-step flow-step-client" role="listitem">
          <span className="flow-step-num" aria-hidden>1</span>
          <h3 className="flow-step-title">Consultoria paga a fatura</h3>
          <p className="flow-step-amount">{formatEur(result.totalInvoiceValue)}</p>
          <p className="flow-step-desc">
            Inclui {formatEur(result.taxes.vat)} de IVA — dinheiro do Estado.
          </p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
        </div>

        <div className="flow-step flow-step-company" role="listitem">
          <span className="flow-step-num" aria-hidden>2</span>
          <h3 className="flow-step-title">Receita de {names.companyShort} (s/ IVA)</h3>
          <p className="flow-step-amount">{formatEur(result.monthlyRevenue)}</p>
          <p className="flow-step-desc">
            Paga salário, Seg. Social, contabilista e ajudas.
          </p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
        </div>

        <div className="flow-step flow-step-highlight" role="listitem">
          <span className="flow-step-num" aria-hidden>3</span>
          <h3 className="flow-step-title">Conta de {names.employeeShort}</h3>
          <p className="flow-step-amount">{formatEur(result.totalPersonalIncome)}</p>
          <p className="flow-step-desc">Salário líquido + ajudas de custo.</p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
        </div>

        <div className="flow-step flow-step-state" role="listitem">
          <span className="flow-step-num" aria-hidden>4</span>
          <h3 className="flow-step-title">Estado recebe</h3>
          <p className="flow-step-amount">{formatEur(toState)}</p>
          <p className="flow-step-desc">IVA, IRC, Seg. Social, IRS e imposto sobre ajudas.</p>
        </div>
      </div>
    </section>
  )
}
