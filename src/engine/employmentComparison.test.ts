import { describe, expect, it } from 'vitest'
import {
  compareWithPermanentContract,
  EMPLOYMENT_PAYMENTS_PER_YEAR,
} from './employmentComparison'
import { RATES, MIN_BASE_SALARY, type SimulationInput } from './types'

const baseInput: SimulationInput = {
  companyName: '',
  employeeName: '',
  dailyRate: 175,
  workingDays: 20,
  baseSalary: MIN_BASE_SALARY,
  accountantFee: 115,
  expenseAllowance: 0,
}

describe('compareWithPermanentContract', () => {
  it('custo anual do empregador iguala o orçamento da consultoria', () => {
    const c = compareWithPermanentContract(baseInput)!
    const employerCost =
      c.grossMonthly * EMPLOYMENT_PAYMENTS_PER_YEAR * (1 + RATES.employerSs) +
      c.mealAllowanceAnnual
    expect(employerCost).toBeCloseTo(c.annualBudget, 2)
    expect(c.annualBudget).toBeCloseTo(175 * 20 * 12, 2)
  })

  it('líquido anual = 14 pagamentos líquidos + refeição', () => {
    const c = compareWithPermanentContract(baseInput)!
    expect(c.netAnnual).toBeCloseTo(
      c.netPerPayment * EMPLOYMENT_PAYMENTS_PER_YEAR + c.mealAllowanceAnnual,
      2,
    )
    expect(c.netMonthlyAvg).toBeCloseTo(c.netAnnual / 12, 2)
  })

  it('descontos coerentes: bruto − SS − IRS = líquido por pagamento', () => {
    const c = compareWithPermanentContract(baseInput)!
    expect(c.netPerPayment).toBeCloseTo(
      c.grossMonthly - c.employeeSsPerPayment - c.irsPerPayment,
      2,
    )
    expect(c.employeeSsPerPayment).toBeCloseTo(c.grossMonthly * RATES.employeeSs, 2)
  })

  it('devolve null sem faturação suficiente', () => {
    expect(compareWithPermanentContract({ ...baseInput, dailyRate: 0 })).toBeNull()
    expect(
      compareWithPermanentContract({ ...baseInput, dailyRate: 10, workingDays: 1 }),
    ).toBeNull()
  })
})
