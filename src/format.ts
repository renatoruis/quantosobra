const eur = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const pct = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatEur(value: number): string {
  return eur.format(value)
}

export function formatPercent(value: number): string {
  return pct.format(value)
}

export type DisplayNames = {
  company: string
  employee: string
  companyShort: string
  employeeShort: string
}

export function displayNames(input: {
  companyName: string
  employeeName: string
}): DisplayNames {
  const company = input.companyName.trim() || 'A empresa'
  const employee = input.employeeName.trim() || 'O trabalhador'
  const companyShort = input.companyName.trim() || 'empresa'
  const employeeShort = input.employeeName.trim() || 'trabalhador'
  return { company, employee, companyShort, employeeShort }
}
