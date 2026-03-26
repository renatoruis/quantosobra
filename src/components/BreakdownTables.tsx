import type { SimulationResult } from '../engine/types'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function BreakdownTables({ result, names }: Props) {
  if (!result.valid) return null

  return (
    <div className="tables-grid">
      <section className="card table-card table-company">
        <h3>Empresa — {names.company}</h3>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Facturação (sem IVA)</td>
              <td>{formatEur(result.monthlyRevenue)}</td>
            </tr>
            <tr>
              <td>Custos totais</td>
              <td>{formatEur(result.totalCompanyCosts)}</td>
            </tr>
            <tr>
              <td>Salário bruto</td>
              <td>{formatEur(result.baseSalary)}</td>
            </tr>
            <tr>
              <td>Segurança Social (empregador)</td>
              <td>{formatEur(result.employerSs)}</td>
            </tr>
            <tr>
              <td>Ajudas de custo</td>
              <td>{formatEur(result.expenseAllowance)}</td>
            </tr>
            <tr>
              <td>Imposto autónomo 5% (ajudas)</td>
              <td>{formatEur(result.allowanceTax)}</td>
            </tr>
            <tr>
              <td>
                Contabilista (sem IVA)
                <span className="row-desc"> Valor base dos honorários.</span>
              </td>
              <td>{formatEur(result.accountantFeeExVat)}</td>
            </tr>
            <tr>
              <td>
                IVA do contabilista (23%)
              </td>
              <td>{formatEur(result.accountantVatOnFees)}</td>
            </tr>
            <tr>
              <td>
                Total contabilista (com IVA)
                <span className="row-desc">
                  {' '}No regime normal, o IVA do contabilista pode ser deduzido na liquidação
                  trimestral — o custo real tende a ser só o valor sem IVA.
                </span>
              </td>
              <td>{formatEur(result.accountantFeeTotal)}</td>
            </tr>
            <tr>
              <td>Lucro antes de IRC</td>
              <td>{formatEur(result.profitBeforeTax)}</td>
            </tr>
            <tr>
              <td>IRC (21%)</td>
              <td>{formatEur(result.ircTax)}</td>
            </tr>
            <tr className="strong">
              <td>Lucro líquido</td>
              <td>{formatEur(result.netProfit)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card table-card table-person">
        <h3>Conta pessoal — {names.employee}</h3>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Salário bruto</td>
              <td>{formatEur(result.baseSalary)}</td>
            </tr>
            <tr>
              <td>
                Segurança Social (11%)
                <span className="row-desc"> Retida pela empresa no recibo — nunca chega à conta pessoal.</span>
              </td>
              <td>−{formatEur(result.employeeSs)}</td>
            </tr>
            <tr>
              <td>
                IRS retido (estimativa mensal)
                <span className="row-desc"> Retido pela empresa e entregue ao Estado.</span>
              </td>
              <td>−{formatEur(result.irsTaxMonthly)}</td>
            </tr>
            <tr>
              <td>Ajudas de custo recebidas</td>
              <td>{formatEur(result.expenseAllowance)}</td>
            </tr>
            <tr className="strong">
              <td>Rendimento líquido total</td>
              <td>{formatEur(result.totalPersonalIncome)}</td>
            </tr>
            <tr>
              <td colSpan={2} className="subnote">
                Rendimento anual bruto estimado (12 × salário):{' '}
                {formatEur(result.annualGrossSalaryEquivalent)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card table-card table-state">
        <h3>Estado — impostos e contribuições (mês)</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th colSpan={2} className="table-subheader">A cargo da empresa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IVA (23% sobre facturação)</td>
              <td>{formatEur(result.taxes.vat)}</td>
            </tr>
            <tr>
              <td>Segurança Social (empregador — 23,75%)</td>
              <td>{formatEur(result.taxes.employerSs)}</td>
            </tr>
            <tr>
              <td>IRC (sobre lucro do período)</td>
              <td>{formatEur(result.taxes.irc)}</td>
            </tr>
            <tr>
              <td>Imposto autónomo (5% sobre ajudas)</td>
              <td>{formatEur(result.taxes.allowanceTax)}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colSpan={2} className="table-subheader table-subheader-person">
                Retido no salário (entregue pela empresa ao Estado)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Segurança Social (trabalhador — 11%)</td>
              <td>{formatEur(result.taxes.employeeSs)}</td>
            </tr>
            <tr>
              <td>IRS retido na fonte (estimativa)</td>
              <td>{formatEur(result.taxes.irs)}</td>
            </tr>
          </tbody>
        </table>
        <p className="disclaimer">
          O IVA paga-se a cada 3 meses e o IRC uma vez por ano — aqui os valores são
          a estimativa mensal para facilitar a comparação. Os montantes «retidos no salário»
          são descontados ao trabalhador mas processados e entregues pela empresa.
        </p>
      </section>
    </div>
  )
}
