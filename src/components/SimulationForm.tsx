import type { SimulationInput } from '../engine/types'
import { MIN_BASE_SALARY } from '../engine/types'
import { PrivacyModal } from './PrivacyModal'

type Props = {
  value: SimulationInput
  onChange: (next: SimulationInput) => void
}

type NumberFieldDef = {
  key: keyof SimulationInput
  label: string
  step: string
  min: string
  hint?: string
  title?: string
}

const numberFields: NumberFieldDef[] = [
  {
    key: 'dailyRate',
    label: 'Tarifa diária (€)',
    step: '0.01',
    min: '0',
    title: 'Quanto faturas à consultoria por dia de trabalho, sem IVA.',
  },
  {
    key: 'workingDays',
    label: 'Dias no mês',
    step: '1',
    min: '0',
    title: 'Dias úteis trabalhados e faturados neste mês.',
  },
  {
    key: 'baseSalary',
    label: 'Salário bruto (€)',
    step: '1',
    min: String(MIN_BASE_SALARY),
    hint: `Mínimo legal: ${MIN_BASE_SALARY} €`,
  },
  {
    key: 'accountantFee',
    label: 'Contabilista (€, s/ IVA)',
    step: '0.01',
    min: '0',
    title: 'O simulador acrescenta 23% de IVA automaticamente.',
  },
  {
    key: 'expenseAllowance',
    label: 'Ajudas de custo (€)',
    step: '0.01',
    min: '0',
    title: 'Reembolso de despesas (kms, diárias, refeição) — entra na conta pessoal sem descontos.',
  },
]

export function SimulationForm({ value, onChange }: Props) {
  return (
    <section className="card form-section">
      <h2>Os teus dados</h2>
      <div className="form-grid form-grid-compact">
        {numberFields.map((f) => (
          <label key={f.key} className="field" title={f.title}>
            <span className="field-label">{f.label}</span>
            <input
              type="number"
              step={f.step}
              min={f.min}
              value={
                Number.isNaN(value[f.key] as number) ? '' : (value[f.key] as number)
              }
              onChange={(e) => {
                const n = parseFloat(e.target.value)
                onChange({
                  ...value,
                  [f.key]: e.target.value === '' || Number.isNaN(n) ? 0 : n,
                })
              }}
            />
            {f.hint ? <span className="field-hint">{f.hint}</span> : null}
          </label>
        ))}
      </div>
      <details className="form-names">
        <summary>Personalizar nomes (empresa pessoal e pessoa física)</summary>
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Nome da empresa pessoal (B2B)</span>
            <input
              type="text"
              placeholder="Ex.: TechPT Lda"
              value={value.companyName}
              onChange={(e) => onChange({ ...value, companyName: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="field-label">Teu nome (pessoa física)</span>
            <input
              type="text"
              placeholder="Ex.: João Silva"
              value={value.employeeName}
              onChange={(e) => onChange({ ...value, employeeName: e.target.value })}
            />
          </label>
        </div>
      </details>
      <PrivacyModal />
    </section>
  )
}
