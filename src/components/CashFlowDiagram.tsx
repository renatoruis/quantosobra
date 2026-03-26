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
      <p className="section-eyebrow">O caminho do dinheiro</p>
      <h2>Como o dinheiro se distribui neste mês</h2>
      <p className="flow-lead">
        Em <strong>quatro passos</strong>, vê exactamente para onde vai cada euro: o cliente
        paga a factura → {names.companyShort} recebe e separa o IVA → {names.employeeShort} recebe
        o ordenado e ajudas na conta pessoal → o Estado fica com impostos e contribuições.
      </p>

      <div className="flow-pipeline" role="list">
        <div className="flow-step flow-step-client" role="listitem">
          <span className="flow-step-num" aria-hidden>
            1
          </span>
          <h3 className="flow-step-title">O cliente paga a {names.companyShort}</h3>
          <p className="flow-step-amount">{formatEur(result.totalInvoiceValue)}</p>
          <p className="flow-step-desc">
            Este é o valor total da <strong>factura</strong> (serviços + IVA).
            Daqui, <strong>{formatEur(result.taxes.vat)}</strong> são de IVA — esse
            dinheiro não é de {names.companyShort}, é do Estado.
          </p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
          <span className="flow-connector-label">entra em {names.companyShort}</span>
        </div>

        <div className="flow-step flow-step-company" role="listitem">
          <span className="flow-step-num" aria-hidden>
            2
          </span>
          <h3 className="flow-step-title">O que {names.companyShort} realmente ganha</h3>
          <p className="flow-step-amount">{formatEur(result.monthlyRevenue)}</p>
          <p className="flow-step-desc">
            Receita <strong>sem IVA</strong> — o valor real dos serviços prestados.
            Daqui {names.companyShort} paga ordenado, Segurança Social, contabilista e ajudas.
            Sobram <strong>{formatEur(result.netProfit)}</strong> de lucro após IRC.
          </p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
          <span className="flow-connector-label">paga a {names.employeeShort}</span>
        </div>

        <div className="flow-step flow-step-highlight" role="listitem">
          <span className="flow-step-num" aria-hidden>
            3
          </span>
          <h3 className="flow-step-title">O que {names.employeeShort} recebe</h3>
          <p className="flow-step-amount">{formatEur(result.totalPersonalIncome)}</p>
          <p className="flow-step-desc">
            <strong>Ordenado líquido</strong> (já com descontos de Segurança Social e IRS)
            mais <strong>ajudas de custo</strong>. Este é o dinheiro que entra de facto
            na conta bancária pessoal.
          </p>
        </div>

        <div className="flow-connector" aria-hidden="true">
          <span className="flow-connector-line" />
          <span className="flow-connector-label">impostos</span>
        </div>

        <div className="flow-step flow-step-state" role="listitem">
          <span className="flow-step-num" aria-hidden>
            4
          </span>
          <h3 className="flow-step-title">O que vai para o Estado</h3>
          <p className="flow-step-amount">{formatEur(toState)}</p>
          <p className="flow-step-desc">
            Soma de todos os impostos e contribuições deste mês: IVA, IRC,
            Segurança Social (empresa e trabalhador), IRS e imposto sobre ajudas.
            Cada um tem o seu prazo — consulta a secção «Calendário fiscal» abaixo.
          </p>
        </div>
      </div>

      <div className="flow-summary-box">
        <p className="flow-summary-title">
          <strong>De cada {formatEur(result.totalInvoiceValue)} que o cliente paga:</strong>
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
              <span className="flow-dest-label">Fica na empresa (custos + lucro retido)</span>
              <span className="flow-dest-value">{formatEur(staysInCompany)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
