export const MIN_BASE_SALARY = 920

export const RATES = {
  vat: 0.23,
  employerSs: 0.2375,
  employeeSs: 0.11,
  allowanceAutonomous: 0.05,
  irc: 0.21,
} as const

export type SimulationInput = {
  companyName: string
  employeeName: string
  dailyRate: number
  workingDays: number
  baseSalary: number
  /** Honorários de contabilidade sem IVA (o simulador acrescenta 23% de IVA ao custo). */
  accountantFee: number
  expenseAllowance: number
}

export type SimulationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
  monthlyRevenue: number
  vatCollected: number
  totalInvoiceValue: number
  baseSalary: number
  employerSs: number
  expenseAllowance: number
  allowanceTax: number
  /** Honorários contabilista (base sem IVA), igual ao input. */
  accountantFeeExVat: number
  /** IVA 23% sobre a factura do contabilista. */
  accountantVatOnFees: number
  /** Total a pagar ao contabilista (base + IVA). */
  accountantFeeTotal: number
  totalCompanyCosts: number
  profitBeforeTax: number
  ircTax: number
  netProfit: number
  employeeSs: number
  annualGrossSalaryEquivalent: number
  irsTaxMonthly: number
  netSalary: number
  totalPersonalIncome: number
  totalTaxesSum: number
  taxes: {
    vat: number
    employerSs: number
    employeeSs: number
    irs: number
    irc: number
    allowanceTax: number
  }
  effectiveTaxRateOnInvoiceWithVat: number
  effectiveTaxRateOnRevenueExVat: number
}
