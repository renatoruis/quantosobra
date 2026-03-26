import { describe, expect, it } from 'vitest'
import { calculateSimulation, compareSensitivity } from './calculateSimulation'
import { MIN_BASE_SALARY } from './types'

describe('calculateSimulation', () => {
  it('recusa salário abaixo do mínimo legal', () => {
    const r = calculateSimulation({
      companyName: 'X',
      employeeName: 'Y',
      dailyRate: 100,
      workingDays: 20,
      baseSalary: 900,
      accountantFee: 50,
      expenseAllowance: 0,
    })
    expect(r.valid).toBe(false)
    expect(r.errors.length).toBeGreaterThan(0)
  })

  it('cenário mínimo legal: salário 920, sem facturação', () => {
    const r = calculateSimulation({
      companyName: 'X',
      employeeName: 'Y',
      dailyRate: 0,
      workingDays: 0,
      baseSalary: MIN_BASE_SALARY,
      accountantFee: 0,
      expenseAllowance: 0,
    })
    expect(r.valid).toBe(true)
    expect(r.monthlyRevenue).toBe(0)
    expect(r.profitBeforeTax).toBeLessThan(0)
    expect(r.irsTaxMonthly).toBe(0)
  })

  it('cenário médio: números redondos e lucro positivo', () => {
    const r = calculateSimulation({
      companyName: 'Empresa Lda',
      employeeName: 'Ana',
      dailyRate: 200,
      workingDays: 20,
      baseSalary: 1500,
      accountantFee: 100,
      expenseAllowance: 200,
    })
    expect(r.valid).toBe(true)
    expect(r.monthlyRevenue).toBe(4000)
    expect(r.vatCollected).toBeCloseTo(920, 2)
    expect(r.totalInvoiceValue).toBeCloseTo(4920, 2)
    expect(r.employerSs).toBeCloseTo(1500 * 0.2375, 2)
    expect(r.employeeSs).toBeCloseTo(1500 * 0.11, 2)
    expect(r.allowanceTax).toBeCloseTo(10, 2)
    expect(r.accountantFeeExVat).toBeCloseTo(100, 2)
    expect(r.accountantVatOnFees).toBeCloseTo(23, 2)
    expect(r.accountantFeeTotal).toBeCloseTo(123, 2)
    expect(r.netSalary).toBeCloseTo(
      1500 - r.employeeSs - r.irsTaxMonthly,
      2,
    )
    expect(r.totalPersonalIncome).toBeCloseTo(r.netSalary + 200, 2)
  })

  it('compareSensitivity devolve deltas coerentes quando válido', () => {
    const input = {
      companyName: 'X',
      employeeName: 'Y',
      dailyRate: 175,
      workingDays: 20,
      baseSalary: 1200,
      accountantFee: 80,
      expenseAllowance: 150,
    }
    const c = compareSensitivity(input, { salaryDelta: 50, allowanceDelta: 25 })
    expect(typeof c.salaryUp.netPersonal).toBe('number')
    expect(typeof c.allowanceUp.netPersonal).toBe('number')
  })
})
