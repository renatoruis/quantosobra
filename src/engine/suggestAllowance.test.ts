import { describe, expect, it } from 'vitest'
import { calculateSimulation } from './calculateSimulation'
import {
  headroomBeforeAllowance,
  maxAllowanceForNonNegativeProfit,
  suggestAllowanceForMaxNetPersonal,
} from './suggestAllowance'
import { MIN_BASE_SALARY } from './types'

describe('suggestAllowance', () => {
  it('calcula margem antes de ajudas', () => {
    const h = headroomBeforeAllowance({
      companyName: '',
      employeeName: '',
      dailyRate: 175,
      workingDays: 20,
      baseSalary: MIN_BASE_SALARY,
      accountantFee: 80,
      expenseAllowance: 0,
    })
    // 3500 - 920 - 218.5 - 80×1,23 = 2263,1
    expect(h).toBeCloseTo(2263.1, 2)
  })

  it('máximo de ajudas com lucro >= 0 respeita factor 1,05', () => {
    const h = 1050
    expect(maxAllowanceForNonNegativeProfit(h)).toBeCloseTo(1000, 2)
  })

  it('arredonda por defeito: não sugere valor que deixe lucro negativo por centésimos', () => {
    const h = 2416.5
    const a = maxAllowanceForNonNegativeProfit(h)
    expect(a * 1.05).toBeLessThanOrEqual(h + 1e-6)
    expect(a).toBeCloseTo(2301.42, 2)
    const input = {
      companyName: '',
      employeeName: '',
      dailyRate: 175,
      workingDays: 21,
      baseSalary: 920,
      accountantFee: 120,
      expenseAllowance: 0,
    }
    const hReal = headroomBeforeAllowance(input)
    const aReal = maxAllowanceForNonNegativeProfit(hReal)
    const r = calculateSimulation({ ...input, expenseAllowance: aReal })
    expect(r.valid).toBe(true)
    expect(r.profitBeforeTax).toBeGreaterThanOrEqual(0)
  })

  it('sugestão aumenta líquido pessoal quando ajudas actuais são baixas', () => {
    const s = suggestAllowanceForMaxNetPersonal({
      companyName: '',
      employeeName: '',
      dailyRate: 200,
      workingDays: 20,
      baseSalary: 1200,
      accountantFee: 80,
      expenseAllowance: 0,
    })
    expect(s.suggestedAllowance).toBeGreaterThan(0)
    expect(s.suggestedTotalPersonal).toBeGreaterThan(s.currentTotalPersonal)
  })
})
