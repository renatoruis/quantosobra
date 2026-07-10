/**
 * Limites de isenção (IRS + Segurança Social) para ajudas de custo em Portugal.
 *
 * Valores confirmados para 2026 (fontes: Portaria de atualização das ajudas de custo;
 * OE — subsídio de refeição isento 6,15 € dinheiro / 10,46 € cartão):
 * - Km em viatura própria: 0,40 €/km, com mapa de itinerário obrigatório.
 * - Ajuda de custo diária nacional (trabalhadores em geral): 62,75 €/dia,
 *   apenas para deslocações a mais de 20 km do domicílio necessário.
 * - Ajuda de custo diária no estrangeiro (trabalhadores em geral): 89,35 €/dia.
 * - Subsídio de refeição não acumula com ajuda de custo diária no mesmo dia.
 *
 * Nota IRC: a tributação autónoma de 5 % (art. 88.º/9 CIRC) incide sobre ajudas de custo
 * e kms não faturados ao cliente. O simulador aplica 5 % à totalidade das ajudas —
 * hipótese conservadora (ver RATES.allowanceAutonomous).
 */
export const ALLOWANCE_LIMITS_YEAR = 2026

export const ALLOWANCE_LIMITS = {
  /** €/km em viatura própria, isento até este valor. */
  kmOwnVehicle: 0.4,
  /** Ajuda de custo diária, deslocações nacionais (trabalhadores em geral). */
  dailyNational: 62.75,
  /** Ajuda de custo diária, deslocações ao estrangeiro (trabalhadores em geral). */
  dailyInternational: 89.35,
  /** Subsídio de refeição isento — pago em dinheiro. */
  mealCash: 6.15,
  /** Subsídio de refeição isento — pago em cartão/vale refeição. */
  mealCard: 10.46,
} as const

export type MealMode = 'cash' | 'card'

export type ProfileAssumptions = {
  /** Kms percorridos em cada dia de deslocação (não é todos os dias úteis). */
  kmPerDay: number
  /** Dias por mês com deslocação em viatura própria. */
  kmDaysPerMonth: number
  nationalTripDaysPerMonth: number
  meal: MealMode
}

/** Premissas de quantidade por perfil de risco (num só sítio, fáceis de afinar). */
export const PROFILE_ASSUMPTIONS: Record<'conservador' | 'moderado', ProfileAssumptions> = {
  conservador: {
    kmPerDay: 100,
    kmDaysPerMonth: 8,
    nationalTripDaysPerMonth: 2,
    meal: 'card',
  },
  moderado: {
    kmPerDay: 200,
    kmDaysPerMonth: 15,
    nationalTripDaysPerMonth: 8,
    meal: 'card',
  },
}
