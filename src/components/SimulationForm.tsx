import type { SimulationInput } from '../engine/types'
import { MIN_BASE_SALARY } from '../engine/types'

type Props = {
  value: SimulationInput
  onChange: (next: SimulationInput) => void
}

const fields: {
  key: keyof SimulationInput
  label: string
  type: 'text' | 'number'
  step?: string
  min?: string
  hint?: string
  placeholder?: string
}[] = [
  {
    key: 'companyName',
    label: 'Nome da empresa',
    type: 'text',
    placeholder: 'Ex.: TechPT Lda',
    hint: 'Serve apenas para personalizar os textos abaixo.',
  },
  {
    key: 'employeeName',
    label: 'Nome do colaborador',
    type: 'text',
    placeholder: 'Ex.: João Silva',
    hint: 'Serve apenas para personalizar os textos abaixo.',
  },
  {
    key: 'dailyRate',
    label: 'Tarifa diária (€ / dia)',
    type: 'number',
    step: '0.01',
    min: '0',
  },
  {
    key: 'workingDays',
    label: 'Dias úteis trabalhados (mês)',
    type: 'number',
    step: '1',
    min: '0',
  },
  {
    key: 'baseSalary',
    label: 'Ordenado base mensal bruto (€)',
    type: 'number',
    step: '1',
    min: String(MIN_BASE_SALARY),
    hint: `Mínimo legal: ${MIN_BASE_SALARY} €`,
  },
  {
    key: 'accountantFee',
    label: 'Contabilista sem IVA (€ / mês)',
    type: 'number',
    step: '0.01',
    min: '0',
    hint: 'O simulador acrescenta 23% de IVA automaticamente.',
  },
  {
    key: 'expenseAllowance',
    label: 'Ajudas de custo totais (€ / mês)',
    type: 'number',
    step: '0.01',
    min: '0',
  },
]

export function SimulationForm({ value, onChange }: Props) {
  return (
    <section className="card form-section">
      <p className="section-eyebrow">Começa aqui</p>
      <h2>Os teus dados</h2>
      <p className="form-privacy">
        Não guardamos nenhuma informação — tudo funciona apenas no teu navegador.
        Os nomes servem só para tornar as explicações mais claras.
      </p>
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.key} className="field">
            <span className="field-label">{f.label}</span>
            <input
              type={f.type}
              step={f.step}
              min={f.min}
              placeholder={f.placeholder}
              value={
                f.type === 'number'
                  ? Number.isNaN(value[f.key] as number)
                    ? ''
                    : (value[f.key] as number)
                  : (value[f.key] as string)
              }
              onChange={(e) => {
                const raw = e.target.value
                if (f.type === 'number') {
                  const n = parseFloat(raw)
                  onChange({
                    ...value,
                    [f.key]: raw === '' || Number.isNaN(n) ? 0 : n,
                  })
                } else {
                  onChange({ ...value, [f.key]: raw })
                }
              }}
            />
            {f.hint ? <span className="field-hint">{f.hint}</span> : null}
          </label>
        ))}
      </div>
    </section>
  )
}
