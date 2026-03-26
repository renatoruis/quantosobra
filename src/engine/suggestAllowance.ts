import { calculateSimulation } from './calculateSimulation'
import { MIN_BASE_SALARY, RATES, type SimulationInput } from './types'

/**
 * “Margem” antes de ajudas: facturação sem IVA menos salário, TS empregador e contabilista.
 * Cada euro de ajudas custa 1,05 € à empresa (ajuda + imposto autónomo 5%).
 */
export function headroomBeforeAllowance(input: SimulationInput): number {
  const monthlyRevenue = input.dailyRate * input.workingDays
  const employerSs = input.baseSalary * RATES.employerSs
  const accountantTotal =
    input.accountantFee * (1 + RATES.vat)
  return monthlyRevenue - input.baseSalary - employerSs - accountantTotal
}

/**
 * Máximo de ajudas de custo tal que o lucro antes de IRC não seja negativo (com o modelo actual).
 * Maximiza o líquido pessoal (salário líquido + ajudas) porque o salário líquido não depende das ajudas.
 *
 * Usa arredondamento **por defeito** aos cêntimos: `Math.round` podia sugerir 2301,43 € quando a
 * margem é 2416,50 €, mas 2301,43 × 1,05 > 2416,50 — o lucro ficava **ligeiramente negativo**.
 */
export function maxAllowanceForNonNegativeProfit(headroom: number): number {
  if (headroom <= 0) return 0
  const raw = headroom / (1 + RATES.allowanceAutonomous)
  return Math.floor(raw * 100) / 100
}

export type AllowanceSuggestion = {
  suggestedAllowance: number
  headroom: number
  currentAllowance: number
  currentTotalPersonal: number
  suggestedTotalPersonal: number
  deltaPersonal: number
  suggestedResult: ReturnType<typeof calculateSimulation> | null
  explanation: string
}

export function suggestAllowanceForMaxNetPersonal(
  input: SimulationInput,
): AllowanceSuggestion {
  const headroom = headroomBeforeAllowance(input)
  const suggestedAllowance = maxAllowanceForNonNegativeProfit(headroom)

  const suggestedInput: SimulationInput = {
    ...input,
    expenseAllowance: suggestedAllowance,
  }

  if (input.baseSalary < MIN_BASE_SALARY) {
    return {
      suggestedAllowance,
      headroom,
      currentAllowance: input.expenseAllowance,
      currentTotalPersonal: 0,
      suggestedTotalPersonal: 0,
      deltaPersonal: 0,
      suggestedResult: null,
      explanation:
        'Introduz um salário base válido (mínimo legal) para calcular a sugestão de ajudas.',
    }
  }

  let suggestedResult: ReturnType<typeof calculateSimulation> | null =
    calculateSimulation(suggestedInput)
  if (!suggestedResult.valid) suggestedResult = null

  const current = calculateSimulation(input)
  const currentTotalPersonal = current.valid ? current.totalPersonalIncome : 0
  const suggestedTotalPersonal = suggestedResult?.totalPersonalIncome ?? 0
  const deltaPersonal = suggestedTotalPersonal - currentTotalPersonal

  let explanation =
    'Com o salário e a facturação que indicaste, este valor de ajudas maximiza o dinheiro na tua conta pessoal sem deixar a empresa com lucro negativo (neste modelo).'
  if (headroom <= 0) {
    explanation =
      'Neste cenário não há margem na empresa para ajudas de custo sem prejuízo — aumenta a facturação, reduz custos ou rever o salário.'
  } else if (Math.abs(suggestedAllowance - input.expenseAllowance) < 0.01) {
    explanation =
      'O valor actual de ajudas de custo já está alinhado com a sugestão (máximo possível sem lucro negativo).'
  }

  return {
    suggestedAllowance,
    headroom,
    currentAllowance: input.expenseAllowance,
    currentTotalPersonal,
    suggestedTotalPersonal,
    deltaPersonal,
    suggestedResult,
    explanation,
  }
}
