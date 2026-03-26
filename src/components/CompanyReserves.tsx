import type { SimulationResult } from '../engine/types'
import { buildCompanyReserveBreakdown } from '../engine/reserves'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  result: SimulationResult
  names: DisplayNames
}

export function CompanyReserves({ result, names }: Props) {
  const r = buildCompanyReserveBreakdown(result)

  if (!r) {
    return (
      <section className="card company-reserves muted">
        <h2>Reserva na conta de {names.companyShort} (impostos)</h2>
        <p className="muted-text">Indisponível com os dados actuais.</p>
      </section>
    )
  }

  return (
    <section className="card company-reserves">
      <p className="section-eyebrow">Conta de {names.companyShort} — não é dinheiro de {names.employeeShort}</p>
      <h2>O que {names.companyShort} deve separar para impostos e contribuições</h2>
      <p className="section-lead">
        Nem todo o dinheiro que entra na conta de {names.companyShort} é para gastar.
        Parte é IVA (pertence ao Estado), e há ainda Segurança Social, IRC e imposto sobre ajudas.
        Esta tabela mostra quanto {names.companyShort} deve <strong>guardar à parte</strong> para
        não misturar com o dinheiro pessoal de {names.employeeShort}.
      </p>
      <table className="reserves-table">
        <thead>
          <tr>
            <th>O quê</th>
            <th className="num">Valor (mês)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>IVA</strong>
              <span className="row-desc">
                {' '}Cobrado ao cliente; não é receita da empresa. Na liquidação trimestral pode
                ser abatido pelo IVA de despesas (ex.: contabilista), reduzindo o valor a entregar.
              </span>
            </td>
            <td className="num">{formatEur(r.vatSetAside)}</td>
          </tr>
          <tr>
            <td>
              <strong>Segurança Social (empregador)</strong>
              <span className="row-desc"> Contribuição sobre o salário bruto.</span>
            </td>
            <td className="num">{formatEur(r.employerSocialSecurity)}</td>
          </tr>
          <tr>
            <td>
              <strong>Imposto autónomo (5% sobre ajudas)</strong>
              <span className="row-desc">
                {' '}
                Imposto extra que a empresa paga sobre as ajudas de custo. Na prática é cobrado
                junto com o IRC (uma vez por ano), mas convém guardar este valor todos os meses
                para não haver surpresas.
              </span>
            </td>
            <td className="num">{formatEur(r.autonomousTaxOnAllowances)}</td>
          </tr>
          <tr>
            <td>
              <strong>IRC (provisão)</strong>
              <span className="row-desc"> Estimativa para o lucro deste mês; liquidação é anual.</span>
            </td>
            <td className="num">{formatEur(r.ircProvision)}</td>
          </tr>
          <tr className="total-row">
            <td>
              <strong>Subtotal impostos / contribuições</strong>
            </td>
            <td className="num">{formatEur(r.totalTaxReserveForCompany)}</td>
          </tr>
          {result.netProfit > 0.01 && (
            <>
              <tr className="profit-row">
                <td>
                  <strong>Lucro líquido (após IRC)</strong>
                  <span className="row-desc">
                    {' '}Dinheiro que sobra na empresa depois de pagar tudo. Não é para gastar como
                    pessoa — fica na conta da empresa como poupança ou reserva.
                  </span>
                </td>
                <td className="num">{formatEur(result.netProfit)}</td>
              </tr>
              <tr className="grand-total-row">
                <td>
                  <strong>Total a manter na conta da empresa</strong>
                </td>
                <td className="num">{formatEur(r.totalTaxReserveForCompany + result.netProfit)}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {result.netProfit > 0.01 && (
        <p className="profit-hint">
          O lucro líquido de <strong>{formatEur(result.netProfit)}</strong> fica na conta de{' '}
          {names.companyShort}. Este valor não é «dinheiro no bolso» — só podes usá-lo pessoalmente
          através de distribuição de dividendos (sujeita a tributação adicional) ou reinvestimento
          na empresa. Se não precisares deste lucro, considera aumentar as ajudas de custo até
          ao valor sugerido.
        </p>
      )}
      <p className="disclaimer">
        O IVA paga-se ao Estado a cada <strong>3 meses</strong> e o IRC uma vez por
        ano — mas convém ir pondo de lado todos os meses para não haver surpresas.
        Confirma os prazos exactos com o contabilista.
      </p>
    </section>
  )
}
