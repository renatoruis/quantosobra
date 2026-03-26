import { useMemo } from 'react'
import type { SimulationInput } from '../engine/types'
import { compareSensitivity } from '../engine/calculateSimulation'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'

type Props = {
  input: SimulationInput
  valid: boolean
  names: DisplayNames
}

const DEFAULT_SALARY_DELTA = 50
const DEFAULT_ALLOWANCE_DELTA = 25

export function OptimizationSection({ input, valid, names }: Props) {
  const sens = useMemo(
    () =>
      compareSensitivity(input, {
        salaryDelta: DEFAULT_SALARY_DELTA,
        allowanceDelta: DEFAULT_ALLOWANCE_DELTA,
      }),
    [input],
  )

  if (!valid) {
    return (
      <section className="card opt-section muted">
        <h2>Sensibilidade</h2>
        <p>Introduz valores válidos para comparar cenários.</p>
      </section>
    )
  }

  const ds = DEFAULT_SALARY_DELTA
  const da = DEFAULT_ALLOWANCE_DELTA

  return (
    <section className="card opt-section">
      <p className="section-eyebrow">E se mudares um pouco?</p>
      <h2>Pequenas variações (estimativa)</h2>
      <p className="opt-intro">
        Variações de <strong>{formatEur(ds)}</strong> no salário bruto e de{' '}
        <strong>{formatEur(da)}</strong> nas ajudas de custo, mantendo o resto igual.
      </p>
      <div className="opt-grid">
        <div>
          <h3>Salário +{formatEur(ds)}</h3>
          <p>
            Rendimento de {names.employeeShort}:{' '}
            <strong>
              {sens.salaryUp.netPersonal >= 0 ? '+' : ''}
              {formatEur(sens.salaryUp.netPersonal)}
            </strong>
          </p>
          <p>
            Lucro de {names.companyShort}:{' '}
            <strong>
              {sens.salaryUp.netCompany >= 0 ? '+' : ''}
              {formatEur(sens.salaryUp.netCompany)}
            </strong>
          </p>
        </div>
        <div>
          <h3>Salário −{formatEur(ds)}</h3>
          <p>
            Rendimento de {names.employeeShort}:{' '}
            <strong>
              {sens.salaryDown.netPersonal >= 0 ? '+' : ''}
              {formatEur(sens.salaryDown.netPersonal)}
            </strong>
          </p>
          <p>
            Lucro de {names.companyShort}:{' '}
            <strong>
              {sens.salaryDown.netCompany >= 0 ? '+' : ''}
              {formatEur(sens.salaryDown.netCompany)}
            </strong>
          </p>
        </div>
        <div>
          <h3>Ajudas +{formatEur(da)}</h3>
          <p>
            Rendimento de {names.employeeShort}:{' '}
            <strong>
              {sens.allowanceUp.netPersonal >= 0 ? '+' : ''}
              {formatEur(sens.allowanceUp.netPersonal)}
            </strong>
          </p>
          <p>
            Lucro de {names.companyShort}:{' '}
            <strong>
              {sens.allowanceUp.netCompany >= 0 ? '+' : ''}
              {formatEur(sens.allowanceUp.netCompany)}
            </strong>
          </p>
        </div>
        <div>
          <h3>Ajudas −{formatEur(da)}</h3>
          <p>
            Rendimento de {names.employeeShort}:{' '}
            <strong>
              {sens.allowanceDown.netPersonal >= 0 ? '+' : ''}
              {formatEur(sens.allowanceDown.netPersonal)}
            </strong>
          </p>
          <p>
            Lucro de {names.companyShort}:{' '}
            <strong>
              {sens.allowanceDown.netCompany >= 0 ? '+' : ''}
              {formatEur(sens.allowanceDown.netCompany)}
            </strong>
          </p>
        </div>
      </div>
    </section>
  )
}
