export function Timeline() {
  return (
    <section className="card timeline-section">
      <h2>Calendário fiscal — quando se paga o quê</h2>
      <ul className="timeline-list">
        <li>
          <div className="timeline-header">
            <strong>Salário à pessoa física</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Todos os meses — último dia útil (ou data do contrato).</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>Declaração de remunerações (Seg. Social)</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Até ao <strong>dia 10</strong> do mês seguinte.</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>Seg. Social + IRS retido</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            Até ao <strong>dia 20</strong> do mês seguinte — Seg. Social (23,75% + 11%)
            e IRS descontado no recibo, num único prazo.
          </span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IVA (regime trimestral)</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            4 vezes por ano: até <strong>20 fev</strong>, <strong>20 mai</strong>,{' '}
            <strong>22 set</strong> e <strong>20 nov</strong>.
          </span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IRC — Modelo 22</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Até <strong>31 de maio</strong> do ano seguinte.</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IRC — pagamentos por conta</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            Até <strong>31 jul</strong>, <strong>30 set</strong> e <strong>15 dez</strong>,
            com base no IRC do ano anterior.
          </span>
        </li>
      </ul>
    </section>
  )
}
