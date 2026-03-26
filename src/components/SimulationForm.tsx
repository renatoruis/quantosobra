import type { SimulationInput } from '../engine/types'
import { MIN_BASE_SALARY } from '../engine/types'

type Props = {
  value: SimulationInput
  onChange: (next: SimulationInput) => void
}

type FieldDef = {
  key: keyof SimulationInput
  label: string
  type: 'text' | 'number'
  step?: string
  min?: string
  hint?: string
  placeholder?: string
}

type FieldGroup = {
  title: string
  fields: FieldDef[]
}

const groups: FieldGroup[] = [
  {
    title: 'Identificação',
    fields: [
      {
        key: 'companyName',
        label: 'Nome da empresa',
        type: 'text',
        placeholder: 'Ex.: TechPT Lda',
        hint: 'Serve apenas para personalizar os textos abaixo.',
      },
      {
        key: 'employeeName',
        label: 'Teu nome (trabalhador)',
        type: 'text',
        placeholder: 'Ex.: João Silva',
        hint: 'Serve apenas para personalizar os textos abaixo.',
      },
    ],
  },
  {
    title: 'Facturação ao cliente',
    fields: [
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
    ],
  },
  {
    title: 'Remuneração e custos',
    fields: [
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
        label: 'Ajudas de custo (€ / mês)',
        type: 'number',
        step: '0.01',
        min: '0',
        hint: 'Reembolso de despesas reais — entra na tua conta pessoal.',
      },
    ],
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
      {groups.map((group) => (
        <fieldset key={group.title} className="form-fieldset">
          <legend className="form-fieldset-legend">{group.title}</legend>
          <div className="form-grid">
            {group.fields.map((f) => (
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
        </fieldset>
      ))}
    </section>
  )
}
