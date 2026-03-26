export function Timeline() {
  return (
    <section className="card timeline-section">
      <p className="section-eyebrow">Calendário fiscal</p>
      <h2>Quando tens de pagar cada obrigação</h2>
      <p className="section-lead">
        Datas baseadas no calendário fiscal oficial da Autoridade Tributária e Segurança Social
        para empresas em Portugal. Alguns prazos podem variar ligeiramente conforme o mês
        (fins de semana e feriados).
      </p>
      <ul className="timeline-list">
        <li>
          <strong>Salário ao trabalhador</strong>
          <span>Todos os meses — processado no último dia útil do mês (ou data definida no contrato).</span>
        </li>
        <li>
          <strong>Declaração de remunerações (Seg. Social)</strong>
          <span>Até ao <strong>dia 10</strong> do mês seguinte — comunicar à Segurança Social as remunerações pagas.</span>
        </li>
        <li>
          <strong>Pagamento da Segurança Social</strong>
          <span>Até ao <strong>dia 20</strong> do mês seguinte — pagar as contribuições do empregador (23,75%) e do trabalhador (11%).</span>
        </li>
        <li>
          <strong>IRS retido na fonte</strong>
          <span>Até ao <strong>dia 20</strong> do mês seguinte — entregar ao Estado o IRS descontado no recibo de vencimento.</span>
        </li>
        <li>
          <strong>IVA (regime trimestral)</strong>
          <span>
            A declaração periódica e o pagamento são feitos <strong>4 vezes por ano</strong>:{' '}
            até <strong>20 de fevereiro</strong> (4.º trim.),{' '}
            <strong>20 de maio</strong> (1.º trim.),{' '}
            <strong>22 de setembro</strong> (2.º trim.) e{' '}
            <strong>20 de novembro</strong> (3.º trim.).
          </span>
        </li>
        <li>
          <strong>IRC — declaração anual (Modelo 22)</strong>
          <span>Até ao <strong>31 de maio</strong> do ano seguinte — entregar a declaração de IRC e pagar o imposto apurado.</span>
        </li>
        <li>
          <strong>IRC — pagamentos por conta</strong>
          <span>
            Três prestações ao longo do ano: até <strong>31 de julho</strong>,{' '}
            <strong>30 de setembro</strong> e <strong>15 de dezembro</strong>.
            Valores calculados com base no IRC do ano anterior.
          </span>
        </li>
      </ul>
      <p className="disclaimer">
        Datas de referência baseadas no calendário fiscal oficial. Em alguns meses o prazo
        pode ser ajustado em 1–2 dias (fins de semana e feriados). Confirma sempre com o
        contabilista.
      </p>
    </section>
  )
}
