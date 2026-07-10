import type { SimulationResult } from '../engine/types'
import { buildCompanyReserveBreakdown } from '../engine/reserves'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function BreakdownTables({ result, names }: Props) {
  if (!result.valid) return null
  const reserves = buildCompanyReserveBreakdown(result)

  return (
    <div className="tables-grid">
      <section className="card table-card table-company">
        <h3>{names.company}</h3>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Faturação (sem IVA)</td>
              <td>{formatEur(result.monthlyRevenue)}</td>
            </tr>
            <tr>
              <td>Salário bruto</td>
              <td>−{formatEur(result.baseSalary)}</td>
            </tr>
            <tr>
              <td>Segurança Social (empregador, 23,75%)</td>
              <td>−{formatEur(result.employerSs)}</td>
            </tr>
            <tr>
              <td>Ajudas de custo</td>
              <td>−{formatEur(result.expenseAllowance)}</td>
            </tr>
            <tr>
              <td>Imposto autónomo 5% (ajudas)</td>
              <td>−{formatEur(result.allowanceTax)}</td>
            </tr>
            <tr>
              <td title="No regime normal, o IVA do contabilista é dedutível na liquidação trimestral.">
                Contabilista (com IVA)
              </td>
              <td>−{formatEur(result.accountantFeeTotal)}</td>
            </tr>
            <tr>
              <td>Lucro antes de IRC</td>
              <td>{formatEur(result.profitBeforeTax)}</td>
            </tr>
            <tr>
              <td>IRC (21%)</td>
              <td>−{formatEur(result.ircTax)}</td>
            </tr>
            <tr className="strong">
              <td>Lucro líquido (fica na empresa)</td>
              <td>{formatEur(result.netProfit)}</td>
            </tr>
          </tbody>
        </table>

        {reserves && (
          <>
            <h4 className="reserve-subtitle">Quanto guardar para impostos</h4>
            <table className="data-table">
              <tbody>
                <tr>
                  <td>IVA (liquidação trimestral)</td>
                  <td>{formatEur(reserves.vatSetAside)}</td>
                </tr>
                <tr>
                  <td>Segurança Social (dia 20)</td>
                  <td>{formatEur(reserves.employerSocialSecurity)}</td>
                </tr>
                <tr>
                  <td>Imposto autónomo (com o IRC)</td>
                  <td>{formatEur(reserves.autonomousTaxOnAllowances)}</td>
                </tr>
                <tr>
                  <td>IRC (anual, provisão)</td>
                  <td>{formatEur(reserves.ircProvision)}</td>
                </tr>
                <tr className="strong">
                  <td>Total a reservar por mês</td>
                  <td>{formatEur(reserves.totalTaxReserveForCompany)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
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
              <td>Segurança Social (11%, retida no recibo)</td>
              <td>−{formatEur(result.employeeSs)}</td>
            </tr>
            <tr>
              <td>IRS retido (estimativa)</td>
              <td>−{formatEur(result.irsTaxMonthly)}</td>
            </tr>
            <tr>
              <td>Ajudas de custo recebidas</td>
              <td>{formatEur(result.expenseAllowance)}</td>
            </tr>
            <tr className="strong">
              <td>Total na conta pessoal</td>
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
              <th colSpan={2} className="table-subheader">Pagos pela empresa</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IVA (23%)</td>
              <td>{formatEur(result.taxes.vat)}</td>
            </tr>
            <tr>
              <td>Segurança Social (empregador, 23,75%)</td>
              <td>{formatEur(result.taxes.employerSs)}</td>
            </tr>
            <tr>
              <td>IRC (21% sobre o lucro)</td>
              <td>{formatEur(result.taxes.irc)}</td>
            </tr>
            <tr>
              <td>Imposto autónomo (5% das ajudas)</td>
              <td>{formatEur(result.taxes.allowanceTax)}</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colSpan={2} className="table-subheader table-subheader-person">
                Retidos no salário
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Segurança Social (pessoa física, 11%)</td>
              <td>{formatEur(result.taxes.employeeSs)}</td>
            </tr>
            <tr>
              <td>IRS (estimativa)</td>
              <td>{formatEur(result.taxes.irs)}</td>
            </tr>
            <tr className="strong">
              <td>Total ao Estado</td>
              <td>{formatEur(result.totalTaxesSum)}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  )
}
