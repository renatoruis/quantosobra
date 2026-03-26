export function Timeline() {
  return (
    <section className="card timeline-section">
      <p className="section-eyebrow">Calendário fiscal</p>
      <h2>Obrigações da empresa e retenções do salário</h2>
      <p className="section-lead">
        Datas baseadas no calendário fiscal oficial da Autoridade Tributária e Segurança Social.
        Alguns prazos podem variar ligeiramente (fins de semana e feriados).
      </p>
      <ul className="timeline-list">
        <li>
          <div className="timeline-header">
            <strong>Salário ao trabalhador</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Todos os meses — processado no último dia útil do mês (ou data definida no contrato).</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>Declaração de remunerações (Seg. Social)</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Até ao <strong>dia 10</strong> do mês seguinte — comunicar à Segurança Social as remunerações pagas.</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>Seg. Social + IRS retido — dia 20</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            Até ao <strong>dia 20</strong> do mês seguinte — num único prazo, a empresa paga a
            Segurança Social (23,75% do empregador + 11% retido ao trabalhador) e entrega o IRS
            descontado no recibo.
          </span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IVA (regime trimestral)</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            Declaração e pagamento <strong>4 vezes por ano</strong>:{' '}
            até <strong>20 fev</strong> (4.º trim.),{' '}
            <strong>20 mai</strong> (1.º trim.),{' '}
            <strong>22 set</strong> (2.º trim.) e{' '}
            <strong>20 nov</strong> (3.º trim.).
          </span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IRC — declaração anual (Modelo 22)</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>Até ao <strong>31 de maio</strong> do ano seguinte — entregar a declaração de IRC e pagar o imposto apurado.</span>
        </li>
        <li>
          <div className="timeline-header">
            <strong>IRC — pagamentos por conta</strong>
            <span className="timeline-badge badge-company">Empresa</span>
          </div>
          <span>
            Três prestações: até <strong>31 jul</strong>,{' '}
            <strong>30 set</strong> e <strong>15 dez</strong>.
            Valores com base no IRC do ano anterior.
          </span>
        </li>
      </ul>
      <p className="disclaimer">
        Datas de referência baseadas no calendário fiscal oficial. «Retido» significa
        que o valor é descontado ao trabalhador mas processado e entregue pela empresa.
        Confirma sempre com o contabilista.
      </p>
    </section>
  )
}
