import { useEffect, useRef, useMemo } from 'react'
import { formatEur } from '../format'

type Props = {
  open: boolean
  onClose: () => void
  suggestedAllowance: number
  workingDays: number
}

type Row = {
  description: string
  details: string
  monthly: number
}

function buildDistribution(budget: number, workingDays: number): Row[] {
  const mealPerDay = 6
  const meal = Math.min(mealPerDay * workingDays, budget)

  const internetBase = 45
  const internet = Math.min(internetBase, Math.max(budget - meal, 0))

  const travelBase = Math.min(0.36 * 30 * 2 * 5, Math.max(budget - meal - internet, 0))
  const travel = Math.round(travelBase * 100) / 100

  const meetingBase = Math.min(120, Math.max(budget - meal - internet - travel, 0))
  const meeting = Math.round(meetingBase * 100) / 100

  const equipBase = Math.min(50, Math.max(budget - meal - internet - travel - meeting, 0))
  const equip = Math.round(equipBase * 100) / 100

  const coworkBase = Math.max(budget - meal - internet - travel - meeting - equip, 0)
  const cowork = Math.round(coworkBase * 100) / 100

  const rows: Row[] = []

  if (meal > 0)
    rows.push({
      description: 'Subsídio de refeição',
      details: `${formatEur(mealPerDay)}/dia × ${workingDays} dias`,
      monthly: Math.round(meal * 100) / 100,
    })
  if (travel > 0)
    rows.push({
      description: 'Deslocação ao cliente',
      details: 'Km em viatura própria ou transportes',
      monthly: travel,
    })
  if (internet > 0)
    rows.push({
      description: 'Internet / telecomunicações',
      details: 'Factura em nome da empresa',
      monthly: internet,
    })
  if (meeting > 0)
    rows.push({
      description: 'Reunião presencial noutra cidade',
      details: 'Comboio/avião + táxi + refeição',
      monthly: meeting,
    })
  if (equip > 0)
    rows.push({
      description: 'Material informático (amortização)',
      details: 'Portátil, monitor, teclado — amortizado em 3 anos',
      monthly: equip,
    })
  if (cowork > 0)
    rows.push({
      description: 'Co-working / espaço de trabalho',
      details: 'Espaço pontual ou fixo',
      monthly: cowork,
    })

  return rows
}

const referenceExamples: { description: string; range: string }[] = [
  { description: 'Subsídio de refeição', range: '€ 120 – 132 / mês (€ 6/dia)' },
  { description: 'Deslocação ao cliente (km)', range: '€ 0,36 / km' },
  { description: 'Reunião presencial noutra cidade', range: '€ 80 – 150 / viagem' },
  { description: 'Estadia em deslocação', range: '€ 50 – 120 / noite' },
  { description: 'Internet e telecomunicações', range: '€ 30 – 60 / mês' },
  { description: 'Material informático (amortização)', range: 'Variável (3 anos)' },
  { description: 'Co-working / espaço de trabalho', range: '€ 100 – 300 / mês' },
]

export function AllowanceExamplesModal({
  open,
  onClose,
  suggestedAllowance,
  workingDays,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const handler = () => onClose()
    el.addEventListener('close', handler)
    return () => el.removeEventListener('close', handler)
  }, [onClose])

  const distribution = useMemo(
    () => buildDistribution(suggestedAllowance, workingDays),
    [suggestedAllowance, workingDays],
  )
  const distributionTotal = distribution.reduce((sum, r) => sum + r.monthly, 0)

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Ajudas de custo — sugestão calculada</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="modal-highlight">
          <span className="modal-highlight-label">Valor sugerido pelo sistema</span>
          <span className="modal-highlight-value">{formatEur(suggestedAllowance)}</span>
          <span className="modal-highlight-sub">por mês</span>
        </div>

        <p className="modal-lead">
          Com base na tua facturação e custos, o sistema calculou o valor máximo de ajudas
          de custo que a empresa pode pagar <strong>sem ficar com prejuízo</strong>. Abaixo
          tens um exemplo de como esse valor poderia ser distribuído em despesas reais:
        </p>

        {distribution.length > 0 && (
          <div className="modal-table-wrap">
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th>Detalhe</th>
                  <th className="num">Valor / mês</th>
                </tr>
              </thead>
              <tbody>
                {distribution.map((row) => (
                  <tr key={row.description}>
                    <td>
                      <strong>{row.description}</strong>
                    </td>
                    <td>{row.details}</td>
                    <td className="num">{formatEur(row.monthly)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <strong>Total desta distribuição</strong>
                  </td>
                  <td className="num">
                    <strong>{formatEur(distributionTotal)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <h3 className="modal-section-title">Valores de referência para TI</h3>
        <p className="modal-lead" style={{ marginTop: 0 }}>
          Estes são os intervalos típicos de despesas para profissionais de TI em Portugal:
        </p>
        <div className="modal-table-wrap">
          <table className="modal-table modal-table-ref">
            <thead>
              <tr>
                <th>Despesa</th>
                <th className="num">Intervalo típico</th>
              </tr>
            </thead>
            <tbody>
              {referenceExamples.map((ex) => (
                <tr key={ex.description}>
                  <td>{ex.description}</td>
                  <td className="num">{ex.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="modal-disclaimer">
          Os valores são indicativos. As ajudas de custo devem corresponder a{' '}
          <strong>despesas efectivas e documentadas</strong>, e cumprir os limites legais
          da Autoridade Tributária. Quando ultrapassam os limites isentos, ficam sujeitas
          a tributação. Confirma sempre com o contabilista.
        </p>
      </div>
    </dialog>
  )
}
