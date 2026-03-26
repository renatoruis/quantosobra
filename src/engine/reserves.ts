import type { SimulationResult } from './types'

/** Valores a considerar na conta da empresa para obrigações fiscais e contributivas (estimativa mensal). */
export type CompanyReserveBreakdown = {
  /** IVA cobrado neste mês — normalmente acumula-se para liquidação trimestral. */
  vatSetAside: number
  /** Contribuição para a Segurança Social (lado empregador). */
  employerSocialSecurity: number
  /** Imposto autónomo de 5% sobre ajudas de custo (lado empresa). */
  autonomousTaxOnAllowances: number
  /** IRC estimado para o período (aqui: mês de actividade). */
  ircProvision: number
  /** Soma dos itens acima — “não é dinheiro para gastar como pessoa”. */
  totalTaxReserveForCompany: number
}

/** Esclarecimento do que cai na conta pessoal vs o que já foi descontado no recibo. */
export type PersonalCashBreakdown = {
  /** Transferência típica do salário (após TS e IRS no recibo). */
  netSalaryToAccount: number
  /** Reembolso de despesas / ajudas de custo (montante em input). */
  allowancesToAccount: number
  /** Líquido total que o simulador usa como “bolso no fim do mês”. */
  totalPersonalCash: number
  /** Valores retidos no salário (já não “aparecem” na conta — saem no desconto). */
  withheldEmployeeSs: number
  withheldIrs: number
}

export function buildCompanyReserveBreakdown(
  result: SimulationResult,
): CompanyReserveBreakdown | null {
  if (!result.valid) return null
  const vatSetAside = result.taxes.vat
  const employerSocialSecurity = result.taxes.employerSs
  const autonomousTaxOnAllowances = result.taxes.allowanceTax
  const ircProvision = result.taxes.irc
  const totalTaxReserveForCompany =
    vatSetAside + employerSocialSecurity + autonomousTaxOnAllowances + ircProvision
  return {
    vatSetAside,
    employerSocialSecurity,
    autonomousTaxOnAllowances,
    ircProvision,
    totalTaxReserveForCompany,
  }
}

export function buildPersonalCashBreakdown(
  result: SimulationResult,
): PersonalCashBreakdown | null {
  if (!result.valid) return null
  return {
    netSalaryToAccount: result.netSalary,
    allowancesToAccount: result.expenseAllowance,
    totalPersonalCash: result.totalPersonalIncome,
    withheldEmployeeSs: result.taxes.employeeSs,
    withheldIrs: result.taxes.irs,
  }
}
