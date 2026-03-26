import { useCallback, useMemo, useState } from 'react'
import type { SimulationInput } from '../engine/types'
import { suggestAllowanceForMaxNetPersonal } from '../engine/suggestAllowance'
import type { DisplayNames } from '../format'
import { formatEur } from '../format'
import { AllowanceExamplesModal } from './AllowanceExamplesModal'

type Props = {
  input: SimulationInput
  valid: boolean
  names: DisplayNames
  onApplySuggestedAllowance: (value: number) => void
}

export function AllowanceSuggestion({
  input,
  valid,
  names,
  onApplySuggestedAllowance,
}: Props) {
  const s = useMemo(() => suggestAllowanceForMaxNetPersonal(input), [input])
  const [showExamples, setShowExamples] = useState(false)
  const closeExamples = useCallback(() => setShowExamples(false), [])

  if (!valid) {
    return (
      <section className="card allowance-suggestion muted">
        <h2>Sugestão de ajudas de custo</h2>
        <p className="muted-text">Corrige os parâmetros para ver a sugestão.</p>
      </section>
    )
  }

  const canApply = Math.abs(s.suggestedAllowance - s.currentAllowance) >= 0.01

  return (
    <section className="card allowance-suggestion">
      <p className="section-eyebrow">Maximizar o líquido de {names.employeeShort}</p>
      <h2>Sugestão de ajudas de custo</h2>
      <p className="section-lead">
        Cada euro de ajudas é mais 1 € na conta de {names.employeeShort}, mas custa{' '}
        <strong>1,05 €</strong> a {names.companyShort} (ajuda + 5% de imposto). O simulador calcula o
        valor máximo que {names.companyShort} pode pagar <strong>sem ficar com prejuízo</strong>.
      </p>
      <div className="suggestion-box">
        <div>
          <span className="suggestion-label">Valor sugerido (mensal)</span>
          <span className="suggestion-number">{formatEur(s.suggestedAllowance)}</span>
          <span className="suggestion-rounding-hint">
            Arredondado por defeito para garantir que {names.companyShort} não fica com prejuízo.
          </span>
        </div>
        <div className="suggestion-meta">
          <p>
            Margem antes de ajudas: <strong>{formatEur(s.headroom)}</strong>
          </p>
          {canApply ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onApplySuggestedAllowance(s.suggestedAllowance)}
            >
              Usar este valor no formulário
            </button>
          ) : (
            <p className="ok-inline">Já estás a usar a sugestão.</p>
          )}
        </div>
      </div>
      <p className="suggestion-explain">{s.explanation}</p>
      {s.deltaPersonal !== 0 && canApply ? (
        <p className="delta-line">
          Se aplicar a sugestão, o líquido de {names.employeeShort} passa de{' '}
          <strong>{formatEur(s.currentTotalPersonal)}</strong> para cerca de{' '}
          <strong>{formatEur(s.suggestedTotalPersonal)}</strong> (
          {s.deltaPersonal > 0 ? '+' : ''}
          {formatEur(s.deltaPersonal)}).
        </p>
      ) : null}
      <div className="allowance-examples-row">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowExamples(true)}
        >
          Ver exemplos de ajudas de custo para TI
        </button>
      </div>
      <p className="disclaimer">
        Na prática, as ajudas de custo têm de corresponder a <strong>despesas reais</strong> e
        cumprir as regras das Finanças — confirma sempre com o contabilista.
      </p>
      <AllowanceExamplesModal
        open={showExamples}
        onClose={closeExamples}
        suggestedAllowance={s.suggestedAllowance}
        workingDays={input.workingDays}
      />
    </section>
  )
}
