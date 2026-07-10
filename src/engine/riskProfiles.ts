import { calculateSimulation } from './calculateSimulation'
import {
  headroomBeforeAllowance,
  maxAllowanceForNonNegativeProfit,
} from './suggestAllowance'
import {
  ALLOWANCE_LIMITS,
  PROFILE_ASSUMPTIONS,
  type ProfileAssumptions,
} from './allowanceLimits'
import type { SimulationInput, SimulationResult } from './types'

export type RiskProfileId = 'conservador' | 'moderado' | 'agressivo'

export type AllowanceItem = {
  kind: 'km' | 'dailyNational' | 'mealCash' | 'mealCard' | 'excess'
  label: string
  /** Ex.: "15 km/dia × 20 dias × 0,40 €" */
  detail: string
  monthly: number
}

export type RiskProfile = {
  id: RiskProfileId
  label: string
  /** Uma frase que resume o perfil. */
  tagline: string
  items: AllowanceItem[]
  /** Soma dos itens dentro dos limites isentos. */
  exemptTotal: number
  /** Parte acima dos limites isentos (só no agressivo). */
  excessTotal: number
  /** Valor a aplicar em expenseAllowance (= soma de items.monthly). */
  totalAllowance: number
  /** true quando a composição foi cortada para a empresa não ficar com lucro negativo. */
  cappedByHeadroom: boolean
  result: SimulationResult
  /** result.totalPersonalIncome, 0 se inválido. */
  netPersonal: number
  /** 1–2 frases de risco em linguagem clara. */
  riskNote: string
}

const cents = (v: number) => Math.round(v * 100) / 100
const floorCents = (v: number) => Math.floor(v * 100) / 100

function formatEurPlain(v: number): string {
  return v.toFixed(2).replace('.', ',')
}

type Composition = { items: AllowanceItem[]; total: number }

function buildExemptComposition(
  input: SimulationInput,
  assumptions: ProfileAssumptions,
): Composition {
  const workingDays = Math.max(0, input.workingDays)
  const tripDays = Math.min(assumptions.nationalTripDaysPerMonth, workingDays)
  // A diária já cobre refeições: dias com ajuda de custo não contam subsídio de refeição.
  const mealDays = workingDays - tripDays
  const mealRate =
    assumptions.meal === 'card' ? ALLOWANCE_LIMITS.mealCard : ALLOWANCE_LIMITS.mealCash

  const items: AllowanceItem[] = []

  const kmDays = Math.min(assumptions.kmDaysPerMonth, workingDays)
  const kmMonthly = cents(assumptions.kmPerDay * kmDays * ALLOWANCE_LIMITS.kmOwnVehicle)
  if (kmMonthly > 0) {
    items.push({
      kind: 'km',
      label: 'Kms em viatura própria',
      detail: `${assumptions.kmPerDay} km × ${kmDays} dias de deslocação × ${formatEurPlain(ALLOWANCE_LIMITS.kmOwnVehicle)} €`,
      monthly: kmMonthly,
    })
  }

  const dailyMonthly = cents(tripDays * ALLOWANCE_LIMITS.dailyNational)
  if (dailyMonthly > 0) {
    items.push({
      kind: 'dailyNational',
      label: 'Ajudas de custo diárias (nacional)',
      detail: `${tripDays} dias de deslocação × ${formatEurPlain(ALLOWANCE_LIMITS.dailyNational)} €`,
      monthly: dailyMonthly,
    })
  }

  const mealMonthly = cents(mealDays * mealRate)
  if (mealMonthly > 0) {
    items.push({
      kind: assumptions.meal === 'card' ? 'mealCard' : 'mealCash',
      label: `Subsídio de refeição (${assumptions.meal === 'card' ? 'cartão' : 'dinheiro'})`,
      detail: `${mealDays} dias × ${formatEurPlain(mealRate)} €`,
      monthly: mealMonthly,
    })
  }

  const total = cents(items.reduce((sum, item) => sum + item.monthly, 0))
  return { items, total }
}

/** Corta a composição proporcionalmente para caber em maxTotal, mantendo soma exacta. */
function capComposition(composition: Composition, maxTotal: number): Composition {
  if (composition.total <= maxTotal || composition.total <= 0) return composition
  const factor = maxTotal / composition.total
  const items: AllowanceItem[] = []
  let allocated = 0
  composition.items.forEach((item, index) => {
    const isLast = index === composition.items.length - 1
    const monthly = isLast
      ? cents(maxTotal - allocated)
      : floorCents(item.monthly * factor)
    allocated = cents(allocated + monthly)
    if (monthly > 0) {
      items.push({ ...item, detail: `${item.detail} (ajustado à margem)`, monthly })
    }
  })
  return { items, total: cents(items.reduce((sum, item) => sum + item.monthly, 0)) }
}

function toProfile(
  id: RiskProfileId,
  label: string,
  tagline: string,
  composition: Composition,
  input: SimulationInput,
  extras: { exemptTotal: number; excessTotal: number; cappedByHeadroom: boolean; riskNote: string },
): RiskProfile {
  const result = calculateSimulation({ ...input, expenseAllowance: composition.total })
  return {
    id,
    label,
    tagline,
    items: composition.items,
    exemptTotal: extras.exemptTotal,
    excessTotal: extras.excessTotal,
    totalAllowance: composition.total,
    cappedByHeadroom: extras.cappedByHeadroom,
    result,
    netPersonal: result.valid ? result.totalPersonalIncome : 0,
    riskNote: extras.riskNote,
  }
}

/**
 * Constrói os 3 perfis de risco de ajudas de custo/kms.
 * Todos respeitam a margem da empresa (nunca sugerem lucro negativo).
 */
export function buildRiskProfiles(input: SimulationInput): RiskProfile[] {
  const headroom = headroomBeforeAllowance(input)
  const maxAllowance = maxAllowanceForNonNegativeProfit(headroom)

  const conservadorRaw = buildExemptComposition(input, PROFILE_ASSUMPTIONS.conservador)
  const conservador = capComposition(conservadorRaw, maxAllowance)

  const moderadoRaw = buildExemptComposition(input, PROFILE_ASSUMPTIONS.moderado)
  const moderado = capComposition(moderadoRaw, maxAllowance)

  // Agressivo: máximo que a margem permite; o que exceder o tecto isento é sinalizado.
  const exemptCeiling = moderadoRaw.total
  const aggressiveTotal = maxAllowance
  const aggressiveExcess = cents(Math.max(0, aggressiveTotal - exemptCeiling))
  let aggressiveComposition: Composition
  if (aggressiveExcess > 0) {
    aggressiveComposition = {
      items: [
        ...moderadoRaw.items,
        {
          kind: 'excess',
          label: 'Acima dos limites isentos',
          detail: 'Sem enquadramento nos limites de isenção',
          monthly: aggressiveExcess,
        },
      ],
      total: cents(exemptCeiling + aggressiveExcess),
    }
  } else {
    aggressiveComposition = capComposition(moderadoRaw, aggressiveTotal)
  }

  return [
    toProfile(
      'conservador',
      'Conservador',
      'Só valores modestos e fáceis de justificar.',
      conservador,
      input,
      {
        exemptTotal: conservador.total,
        excessTotal: 0,
        cappedByHeadroom: conservador.total < conservadorRaw.total,
        riskNote:
          'Valores dentro dos limites isentos, com quantidades realistas. Basta manter mapas de itinerário e boletins de deslocação.',
      },
    ),
    toProfile(
      'moderado',
      'Moderado',
      'Limites isentos usados no máximo plausível.',
      moderado,
      input,
      {
        exemptTotal: moderado.total,
        excessTotal: 0,
        cappedByHeadroom: moderado.total < moderadoRaw.total,
        riskNote:
          'Tudo dentro dos limites isentos, mas no tecto: exige documentação consistente todos os meses (kms e deslocações reais).',
      },
    ),
    toProfile(
      'agressivo',
      'Agressivo',
      'O máximo que a margem da empresa permite.',
      aggressiveComposition,
      input,
      {
        exemptTotal: cents(Math.min(aggressiveTotal, exemptCeiling)),
        excessTotal: aggressiveExcess,
        cappedByHeadroom: false,
        riskNote:
          aggressiveExcess > 0
            ? `${formatEurPlain(aggressiveExcess)} € acima dos limites isentos: se a AT requalificar, esse valor paga IRS e Segurança Social como salário.`
            : 'A margem da empresa não chega ao tecto isento — neste cenário o agressivo equivale ao moderado.',
      },
    ),
  ]
}
