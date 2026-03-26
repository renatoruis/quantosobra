import {
  MIN_BASE_SALARY,
  RATES,
  type SimulationInput,
  type SimulationResult,
} from './types'
import { estimateMonthlyIrsRetention } from './irs'

const IRS_SIGNIFICANT_RATIO = 0.12

function formatEurPlain(v: number): string {
  return v.toFixed(2).replace('.', ',')
}

function emptyResult(
  valid: boolean,
  errors: string[],
  warnings: string[],
): SimulationResult {
  return {
    valid,
    errors,
    warnings,
    monthlyRevenue: 0,
    vatCollected: 0,
    totalInvoiceValue: 0,
    baseSalary: 0,
    employerSs: 0,
    expenseAllowance: 0,
    allowanceTax: 0,
    accountantFeeExVat: 0,
    accountantVatOnFees: 0,
    accountantFeeTotal: 0,
    totalCompanyCosts: 0,
    profitBeforeTax: 0,
    ircTax: 0,
    netProfit: 0,
    employeeSs: 0,
    annualGrossSalaryEquivalent: 0,
    irsTaxMonthly: 0,
    netSalary: 0,
    totalPersonalIncome: 0,
    totalTaxesSum: 0,
    taxes: {
      vat: 0,
      employerSs: 0,
      employeeSs: 0,
      irs: 0,
      irc: 0,
      allowanceTax: 0,
    },
    effectiveTaxRateOnInvoiceWithVat: 0,
    effectiveTaxRateOnRevenueExVat: 0,
  }
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (input.baseSalary < MIN_BASE_SALARY) {
    errors.push(
      `O salário base não pode ser inferior ao mínimo legal (${MIN_BASE_SALARY} €).`,
    )
    return emptyResult(false, errors, warnings)
  }

  if (input.dailyRate < 0 || input.workingDays < 0) {
    errors.push('Tarifa diária e dias trabalhados devem ser valores não negativos.')
    return emptyResult(false, errors, warnings)
  }
  if (input.accountantFee < 0 || input.expenseAllowance < 0) {
    errors.push('Honorários e ajudas de custo devem ser valores não negativos.')
    return emptyResult(false, errors, warnings)
  }

  const monthlyRevenue = input.dailyRate * input.workingDays
  const vatCollected = monthlyRevenue * RATES.vat
  const totalInvoiceValue = monthlyRevenue + vatCollected

  const baseSalary = input.baseSalary
  const employerSs = baseSalary * RATES.employerSs
  const expenseAllowance = input.expenseAllowance
  const allowanceTax = expenseAllowance * RATES.allowanceAutonomous
  const accountantFeeExVat = input.accountantFee
  const accountantVatOnFees = accountantFeeExVat * RATES.vat
  const accountantFeeTotal = accountantFeeExVat + accountantVatOnFees

  const totalCompanyCosts =
    baseSalary +
    employerSs +
    expenseAllowance +
    allowanceTax +
    accountantFeeTotal

  const profitBeforeTax = monthlyRevenue - totalCompanyCosts
  const ircTax = profitBeforeTax > 0 ? profitBeforeTax * RATES.irc : 0
  const netProfit = profitBeforeTax - ircTax

  const employeeSs = baseSalary * RATES.employeeSs
  const annualGrossSalaryEquivalent = baseSalary * 12
  const irsTaxMonthly = estimateMonthlyIrsRetention(baseSalary)
  const netSalary = baseSalary - employeeSs - irsTaxMonthly
  const totalPersonalIncome = netSalary + expenseAllowance

  const taxes = {
    vat: vatCollected,
    employerSs,
    employeeSs,
    irs: irsTaxMonthly,
    irc: ircTax,
    allowanceTax,
  }

  const totalTaxesSum =
    taxes.vat +
    taxes.employerSs +
    taxes.employeeSs +
    taxes.irs +
    taxes.irc +
    taxes.allowanceTax

  const effectiveTaxRateOnInvoiceWithVat =
    totalInvoiceValue > 0
      ? (totalInvoiceValue - totalPersonalIncome) / totalInvoiceValue
      : 0

  const effectiveTaxRateOnRevenueExVat =
    monthlyRevenue > 0
      ? (monthlyRevenue - totalPersonalIncome) / monthlyRevenue
      : 0

  if (profitBeforeTax < 0) {
    warnings.push(`Atenção: a facturação deste mês (valor sem IVA) é inferior ao total de custos da empresa.

Em termos simples: o que a empresa paga ou regista como custo (salário bruto, Segurança Social do empregador, contabilista, ajudas de custo e imposto autónomo sobre ajudas…) é mais do que o que entra pela prestação de serviços, antes do IVA. Por isso o resultado é negativo antes do imposto sobre o lucro das sociedades (IRC) — na prática, neste cenário a actividade não cobre as despesas.

O que podes tentar: aumentar tarifa ou dias trabalhados, ou reduzir custos (salário, ajudas, honorários), sempre alinhado com o teu contabilista.`)
  }

  if (irsTaxMonthly > baseSalary * IRS_SIGNIFICANT_RATIO && baseSalary > 0) {
    warnings.push(
      `O IRS que o simulador estimou (${formatEurPlain(irsTaxMonthly)}/mês) parece alto para um ordenado bruto de ${formatEurPlain(baseSalary)} €. ` +
      'Isto pode acontecer com ordenados acima de ~1 500 €, onde os escalões de IRS sobem rapidamente. ' +
      'Este valor é apenas uma estimativa simplificada — o IRS real depende de deduções, ' +
      'número de dependentes e tabelas de retenção na fonte. Confirma com o contabilista o valor correcto para o teu recibo.',
    )
  }

  return {
    valid: true,
    errors,
    warnings,
    monthlyRevenue,
    vatCollected,
    totalInvoiceValue,
    baseSalary,
    employerSs,
    expenseAllowance,
    allowanceTax,
    accountantFeeExVat,
    accountantVatOnFees,
    accountantFeeTotal,
    totalCompanyCosts,
    profitBeforeTax,
    ircTax,
    netProfit,
    employeeSs,
    annualGrossSalaryEquivalent,
    irsTaxMonthly,
    netSalary,
    totalPersonalIncome,
    totalTaxesSum,
    taxes,
    effectiveTaxRateOnInvoiceWithVat,
    effectiveTaxRateOnRevenueExVat,
  }
}

export type SensitivityDeltas = {
  salaryDelta: number
  allowanceDelta: number
}

export function compareSensitivity(
  base: SimulationInput,
  deltas: SensitivityDeltas,
): {
  salaryUp: { netPersonal: number; netCompany: number }
  salaryDown: { netPersonal: number; netCompany: number }
  allowanceUp: { netPersonal: number; netCompany: number }
  allowanceDown: { netPersonal: number; netCompany: number }
} {
  const ref = calculateSimulation(base)
  if (!ref.valid) {
    return {
      salaryUp: { netPersonal: 0, netCompany: 0 },
      salaryDown: { netPersonal: 0, netCompany: 0 },
      allowanceUp: { netPersonal: 0, netCompany: 0 },
      allowanceDown: { netPersonal: 0, netCompany: 0 },
    }
  }

  const dS = deltas.salaryDelta
  const dA = deltas.allowanceDelta

  const upS = calculateSimulation({ ...base, baseSalary: base.baseSalary + dS })
  const downS = calculateSimulation({
    ...base,
    baseSalary: Math.max(MIN_BASE_SALARY, base.baseSalary - dS),
  })
  const upA = calculateSimulation({
    ...base,
    expenseAllowance: base.expenseAllowance + dA,
  })
  const downA = calculateSimulation({
    ...base,
    expenseAllowance: Math.max(0, base.expenseAllowance - dA),
  })

  return {
    salaryUp: {
      netPersonal: upS.valid ? upS.totalPersonalIncome - ref.totalPersonalIncome : 0,
      netCompany: upS.valid ? upS.netProfit - ref.netProfit : 0,
    },
    salaryDown: {
      netPersonal: downS.valid
        ? downS.totalPersonalIncome - ref.totalPersonalIncome
        : 0,
      netCompany: downS.valid ? downS.netProfit - ref.netProfit : 0,
    },
    allowanceUp: {
      netPersonal: upA.valid ? upA.totalPersonalIncome - ref.totalPersonalIncome : 0,
      netCompany: upA.valid ? upA.netProfit - ref.netProfit : 0,
    },
    allowanceDown: {
      netPersonal: downA.valid
        ? downA.totalPersonalIncome - ref.totalPersonalIncome
        : 0,
      netCompany: downA.valid ? downA.netProfit - ref.netProfit : 0,
    },
  }
}
