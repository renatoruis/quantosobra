/**
 * IRS anual estimado por fatias (taxas marginais simplificadas, continente).
 * Não inclui parcelas a abater nem situações específicas — apenas aproximação.
 */
const ANNUAL_SLICES: { upper: number; rate: number }[] = [
  { upper: 7479, rate: 0.145 },
  { upper: 11284, rate: 0.23 },
  { upper: 15992, rate: 0.265 },
  { upper: 20700, rate: 0.285 },
  { upper: 26355, rate: 0.35 },
  { upper: 38255, rate: 0.37 },
  { upper: 50450, rate: 0.435 },
  { upper: 78370, rate: 0.45 },
  { upper: Infinity, rate: 0.48 },
]

const IRS_LOW_MONTHLY_THRESHOLD = 1000

export function estimateAnnualIrsFromGross(annualGross: number): number {
  if (annualGross <= 0) return 0
  let tax = 0
  let lower = 0
  for (const slice of ANNUAL_SLICES) {
    if (annualGross <= lower) break
    const top = Math.min(annualGross, slice.upper)
    const inSlice = top - lower
    if (inSlice > 0) {
      tax += inSlice * slice.rate
    }
    lower = slice.upper
  }
  return Math.round(tax * 100) / 100
}

/**
 * Retenção mensal aproximada: IRS anual / 12.
 * Para salário mensal até ~1000 €, assume-se IRS mensal nulo (estimativa conservadora do plano).
 */
export function estimateMonthlyIrsRetention(baseSalaryMonthly: number): number {
  if (baseSalaryMonthly <= IRS_LOW_MONTHLY_THRESHOLD) return 0
  const annual = baseSalaryMonthly * 12
  const annualTax = estimateAnnualIrsFromGross(annual)
  return Math.round((annualTax / 12) * 100) / 100
}
