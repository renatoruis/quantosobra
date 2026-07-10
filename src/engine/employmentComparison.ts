import { ALLOWANCE_LIMITS } from './allowanceLimits'
import { estimateAnnualIrsFromGross } from './irs'
import { RATES, type SimulationInput } from './types'

/**
 * Modelo simplificado de contrato de trabalho sem termo em Portugal, com o MESMO
 * custo anual para a consultoria que a faturação B2B (sem IVA):
 * - 14 pagamentos/ano (12 meses + subsídio de férias + subsídio de Natal);
 * - Segurança Social do empregador 23,75% sobre os 14 pagamentos;
 * - subsídio de refeição em cartão no máximo isento (22 dias × 11 meses), sem descontos;
 * - não modela seguro de acidentes de trabalho (~1%) nem outros benefícios.
 */
export const EMPLOYMENT_PAYMENTS_PER_YEAR = 14
export const MEAL_DAYS_PER_MONTH = 22
export const MEAL_MONTHS_PER_YEAR = 11

export type EmploymentComparison = {
  /** Orçamento anual da consultoria = faturação mensal (s/ IVA) × 12. */
  annualBudget: number
  /** Salário bruto por cada um dos 14 pagamentos. */
  grossMonthly: number
  /** Descontos mensais (média por pagamento). */
  employeeSsPerPayment: number
  irsPerPayment: number
  netPerPayment: number
  /** Subsídio de refeição anual (cartão, isento). */
  mealAllowanceAnnual: number
  /** Líquido anual total (14 pagamentos líquidos + refeição). */
  netAnnual: number
  /** Líquido anual ÷ 12 — comparável ao líquido mensal do B2B. */
  netMonthlyAvg: number
}

export function compareWithPermanentContract(
  input: SimulationInput,
): EmploymentComparison | null {
  const annualBudget = input.dailyRate * input.workingDays * 12
  const mealAllowanceAnnual =
    ALLOWANCE_LIMITS.mealCard * MEAL_DAYS_PER_MONTH * MEAL_MONTHS_PER_YEAR
  const budgetForSalary = annualBudget - mealAllowanceAnnual
  if (budgetForSalary <= 0) return null

  const grossMonthly =
    budgetForSalary / (EMPLOYMENT_PAYMENTS_PER_YEAR * (1 + RATES.employerSs))
  const annualGross = grossMonthly * EMPLOYMENT_PAYMENTS_PER_YEAR
  const irsAnnual = estimateAnnualIrsFromGross(annualGross)
  const ssAnnual = annualGross * RATES.employeeSs
  const netAnnual = annualGross - ssAnnual - irsAnnual + mealAllowanceAnnual

  return {
    annualBudget,
    grossMonthly,
    employeeSsPerPayment: ssAnnual / EMPLOYMENT_PAYMENTS_PER_YEAR,
    irsPerPayment: irsAnnual / EMPLOYMENT_PAYMENTS_PER_YEAR,
    netPerPayment: (annualGross - ssAnnual - irsAnnual) / EMPLOYMENT_PAYMENTS_PER_YEAR,
    mealAllowanceAnnual,
    netAnnual,
    netMonthlyAvg: netAnnual / 12,
  }
}
