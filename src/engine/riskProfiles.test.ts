import { describe, expect, it } from 'vitest'
import { buildRiskProfiles } from './riskProfiles'
import { suggestAllowanceForMaxNetPersonal } from './suggestAllowance'
import { ALLOWANCE_LIMITS, PROFILE_ASSUMPTIONS } from './allowanceLimits'
import { MIN_BASE_SALARY, type SimulationInput } from './types'

const baseInput: SimulationInput = {
  companyName: '',
  employeeName: '',
  dailyRate: 175,
  workingDays: 20,
  baseSalary: MIN_BASE_SALARY,
  accountantFee: 115,
  expenseAllowance: 0,
}

const sumItems = (items: { monthly: number }[]) =>
  items.reduce((sum, item) => sum + item.monthly, 0)

describe('buildRiskProfiles', () => {
  it('devolve 3 perfis com líquido pessoal crescente', () => {
    const [conservador, moderado, agressivo] = buildRiskProfiles(baseInput)
    expect(conservador.id).toBe('conservador')
    expect(moderado.id).toBe('moderado')
    expect(agressivo.id).toBe('agressivo')
    expect(conservador.netPersonal).toBeLessThanOrEqual(moderado.netPersonal)
    expect(moderado.netPersonal).toBeLessThanOrEqual(agressivo.netPersonal)
  })

  it('conservador e moderado não têm excesso; agressivo com margem alta tem', () => {
    const [conservador, moderado, agressivo] = buildRiskProfiles(baseInput)
    expect(conservador.excessTotal).toBe(0)
    expect(moderado.excessTotal).toBe(0)
    expect(agressivo.excessTotal).toBeGreaterThan(0)
    expect(agressivo.items.some((i) => i.kind === 'excess')).toBe(true)
  })

  it('composição do conservador segue as premissas e os limites isentos', () => {
    const [conservador] = buildRiskProfiles(baseInput)
    const { kmPerDay, kmDaysPerMonth, nationalTripDaysPerMonth, meal } =
      PROFILE_ASSUMPTIONS.conservador
    const km = kmPerDay * Math.min(kmDaysPerMonth, 20) * ALLOWANCE_LIMITS.kmOwnVehicle
    const daily = nationalTripDaysPerMonth * ALLOWANCE_LIMITS.dailyNational
    // Dias com diária não contam subsídio de refeição.
    const mealRate =
      meal === 'card' ? ALLOWANCE_LIMITS.mealCard : ALLOWANCE_LIMITS.mealCash
    const mealTotal = (20 - nationalTripDaysPerMonth) * mealRate
    expect(conservador.totalAllowance).toBeCloseTo(km + daily + mealTotal, 2)
    expect(conservador.cappedByHeadroom).toBe(false)
  })

  it('as ajudas sugeridas nunca tornam o lucro negativo', () => {
    for (const dailyRate of [60, 100, 175, 400]) {
      const profiles = buildRiskProfiles({ ...baseInput, dailyRate })
      for (const profile of profiles) {
        expect(profile.result.valid).toBe(true)
        if (profile.totalAllowance > 0) {
          expect(profile.result.profitBeforeTax).toBeGreaterThanOrEqual(-1e-6)
        }
      }
    }
  })

  it('sem margem (empresa já deficitária), os perfis sugerem 0 de ajudas', () => {
    const profiles = buildRiskProfiles({ ...baseInput, dailyRate: 60 })
    for (const profile of profiles) {
      expect(profile.totalAllowance).toBe(0)
    }
  })

  it('com faturação baixa os perfis são capados pela margem', () => {
    const [conservador, moderado] = buildRiskProfiles({ ...baseInput, dailyRate: 60 })
    expect(moderado.cappedByHeadroom).toBe(true)
    expect(moderado.totalAllowance).toBeLessThan(900)
    expect(conservador.totalAllowance).toBeLessThanOrEqual(moderado.totalAllowance + 1e-6)
  })

  it('totalAllowance é a soma dos itens em todos os perfis', () => {
    for (const dailyRate of [60, 175, 400]) {
      for (const profile of buildRiskProfiles({ ...baseInput, dailyRate })) {
        expect(profile.totalAllowance).toBeCloseTo(sumItems(profile.items), 2)
      }
    }
  })

  it('workingDays = 0 devolve perfis a zero, sem NaN', () => {
    const profiles = buildRiskProfiles({ ...baseInput, workingDays: 0 })
    for (const profile of profiles) {
      expect(Number.isNaN(profile.totalAllowance)).toBe(false)
      expect(profile.totalAllowance).toBe(0)
      expect(profile.netPersonal).toBeGreaterThanOrEqual(0)
    }
  })

  it('agressivo coincide com a sugestão de máximo sem lucro negativo', () => {
    const [, , agressivo] = buildRiskProfiles(baseInput)
    const suggestion = suggestAllowanceForMaxNetPersonal(baseInput)
    expect(agressivo.totalAllowance).toBeCloseTo(suggestion.suggestedAllowance, 2)
  })
})
