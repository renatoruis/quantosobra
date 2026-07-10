import { Link } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import { ALLOWANCE_LIMITS, ALLOWANCE_LIMITS_YEAR } from '../engine/allowanceLimits'
import { formatEur } from '../format'

export function ContextoPage() {
  return (
    <div className="app-shell contexto-page">
      <SiteHeader />

      <div className="contexto-hero card">
        <p className="section-eyebrow">Perceber o simulador</p>
        <h1 className="contexto-h1">Como funciona e para que serve</h1>
        <p className="contexto-lead">
          Aqui explicamos, em linguagem simples, o que este simulador faz, para quem é,
          que contas faz por trás e quais são as suas limitações.
        </p>
      </div>

      <div className="contexto-grid">
        <section className="card contexto-card">
          <span className="contexto-card-num">1</span>
          <h2>Para quem é</h2>
          <p>
            Se tens uma <strong>empresa em Portugal</strong> (normalmente uma unipessoal ou
            sociedade em que és o único sócio e trabalhador) e facturas serviços a uma consultoria,
            este simulador é para ti.
          </p>
          <p>
            Especialmente pensado para profissionais de TI (developers, DevOps, tech leads)
            que vieram do estrangeiro e precisaram de abrir empresa para trabalhar em
            Portugal — o equivalente ao «PJ» para quem vem do Brasil.
          </p>
          <p>
            Não precisas de ser contabilista — basta preencheres os campos e o simulador
            mostra tudo de forma visual.
          </p>
        </section>

        <section className="card contexto-card contexto-card-warn">
          <span className="contexto-card-num">!</span>
          <h2>Limitações</h2>
          <ul>
            <li>
              <strong>Não substitui o contabilista</strong> — é uma ferramenta de planeamento,
              não uma declaração oficial.
            </li>
            <li>
              <strong>Não cobre todos os casos</strong> — existem isenções, regimes especiais
              e benefícios fiscais que não estão contemplados.
            </li>
            <li>
              <strong>Os valores são estimativas</strong> — servem para teres uma ideia
              aproximada, não para preencher declarações.
            </li>
          </ul>
        </section>

        <section className="card contexto-card contexto-card-full">
          <h2>Como são feitas as contas</h2>
          <p className="contexto-card-lead">
            Todas as contas são <strong>mensais</strong> e servem para{' '}
            <strong>planeamento</strong>. Aqui vai o passo a passo:
          </p>
          <div className="contexto-steps">
            <div className="contexto-step">
              <span className="contexto-step-num">1</span>
              <div>
                <h3>Quanto facturas à consultoria</h3>
                <p>
                  O simulador multiplica a <strong>tarifa diária</strong> pelos{' '}
                  <strong>dias trabalhados</strong> para calcular a receita mensal.
                  Acrescenta <strong>23% de IVA</strong> (taxa do continente) — mas
                  atenção: o IVA <strong>não é lucro da empresa</strong>, é dinheiro
                  que a empresa cobra e depois entrega ao Estado.
                </p>
              </div>
            </div>
            <div className="contexto-step">
              <span className="contexto-step-num">2</span>
              <div>
                <h3>Custos da empresa</h3>
                <p>A empresa tem vários custos obrigatórios todos os meses:</p>
                <ul>
                  <li><strong>Ordenado bruto</strong> — o salário antes de descontos (mínimo de 920 €).</li>
                  <li><strong>Seg. Social (empresa)</strong> — 23,75% do ordenado bruto.</li>
                  <li><strong>Seg. Social (trabalhador)</strong> — 11% descontados no recibo.</li>
                  <li><strong>Ajudas de custo</strong> — a empresa paga um imposto extra de 5%.</li>
                  <li><strong>Contabilista</strong> — indicas sem IVA, o simulador acrescenta 23%.</li>
                </ul>
              </div>
            </div>
            <div className="contexto-step">
              <span className="contexto-step-num">3</span>
              <div>
                <h3>Lucro e IRC (imposto da empresa)</h3>
                <p>
                  O que sobra da receita depois de pagar todos os custos é o{' '}
                  <strong>lucro</strong>. Sobre esse lucro, a empresa paga{' '}
                  <strong>21% de IRC</strong>. Se não houver lucro, não há IRC.
                </p>
              </div>
            </div>
            <div className="contexto-step">
              <span className="contexto-step-num">4</span>
              <div>
                <h3>IRS (imposto pessoal)</h3>
                <p>
                  O simulador estima o IRS com base no ordenado anual. Até cerca de
                  1 000 €/mês o IRS é praticamente zero. Acima disso, aplica escalões
                  progressivos — quem ganha mais, paga percentagem maior.
                </p>
              </div>
            </div>
            <div className="contexto-step">
              <span className="contexto-step-num">5</span>
              <div>
                <h3>O que chega à tua conta</h3>
                <p>
                  O valor final é: <strong>ordenado líquido</strong> (ordenado bruto
                  menos Seg. Social e IRS) mais <strong>ajudas de custo</strong>.
                  É este o número mais importante do simulador.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card contexto-card">
          <span className="contexto-card-num" style={{ background: 'var(--company)' }}>€</span>
          <h2>O que a empresa deve guardar</h2>
          <p>
            Nem todo o dinheiro que entra na conta da empresa é para gastar. O simulador
            mostra quanto convém <strong>reservar à parte</strong> para pagar ao Estado:
          </p>
          <ul>
            <li><strong>IVA</strong> — pago a cada 3 meses</li>
            <li><strong>Segurança Social</strong> — paga todos os meses</li>
            <li><strong>IRC</strong> — pago uma vez por ano</li>
            <li><strong>Imposto sobre ajudas</strong> — junto com o IRC</li>
          </ul>
          <p>Isto evita surpresas na altura de pagar impostos.</p>
        </section>

        <section className="card contexto-card contexto-card-full">
          <span className="contexto-card-num" style={{ background: 'var(--accent)' }}>+</span>
          <h2>Ajudas de custo, kms e os perfis de risco</h2>
          <p>
            Ajudas de custo e kms entram na tua conta pessoal <strong>sem IRS nem
            Segurança Social</strong> — desde que fiquem dentro dos limites de isenção
            e correspondam a deslocações reais e documentadas (mapa de itinerário /
            boletim de deslocação). Cada euro de ajudas custa 1,05 € à empresa, porque
            há um imposto autónomo de 5% sobre ajudas não faturadas à consultoria — o
            simulador aplica sempre esses 5%, a hipótese mais conservadora.
          </p>
          <h3>Limites isentos em {ALLOWANCE_LIMITS_YEAR}</h3>
          <ul>
            <li>
              <strong>Kms em viatura própria</strong> — {formatEur(ALLOWANCE_LIMITS.kmOwnVehicle)}/km.
            </li>
            <li>
              <strong>Ajuda de custo diária (nacional)</strong> —{' '}
              {formatEur(ALLOWANCE_LIMITS.dailyNational)}/dia, para deslocações a mais de
              20 km do domicílio.
            </li>
            <li>
              <strong>Ajuda de custo diária (estrangeiro)</strong> —{' '}
              {formatEur(ALLOWANCE_LIMITS.dailyInternational)}/dia.
            </li>
            <li>
              <strong>Subsídio de refeição</strong> — {formatEur(ALLOWANCE_LIMITS.mealCash)}/dia
              em dinheiro ou {formatEur(ALLOWANCE_LIMITS.mealCard)}/dia em cartão refeição.
              Não acumula com a ajuda de custo diária no mesmo dia.
            </li>
          </ul>
          <h3>Os três perfis do simulador</h3>
          <ul>
            <li>
              <strong>Conservador</strong> — kms realistas (casa↔consultoria) e
              poucas deslocações, tudo fácil de justificar. Risco fiscal mínimo.
            </li>
            <li>
              <strong>Moderado</strong> — usa os limites isentos no máximo plausível.
              Continua legal, mas exige documentação consistente todos os meses.
            </li>
            <li>
              <strong>Agressivo</strong> — o máximo que a margem da empresa permite. A
              parte acima dos limites isentos é sinalizada: se a Autoridade Tributária a
              requalificar, paga IRS e Segurança Social como se fosse salário (mais
              eventuais coimas e juros).
            </li>
          </ul>
          <p>
            Em qualquer perfil, o valor final é uma <strong>decisão tua com o teu
            contabilista</strong> — o simulador mostra o impacto, não substitui o
            enquadramento profissional.
          </p>
        </section>

        <section className="card contexto-card">
          <span className="contexto-card-num" style={{ background: 'var(--state)' }}>%</span>
          <h2>Taxas efectivas</h2>
          <p>
            O resumo mostra duas percentagens que te ajudam a perceber «quanto se perde»
            em impostos:
          </p>
          <ul>
            <li>
              <strong>Sobre a factura com IVA</strong> — de tudo o que a consultoria paga, que
              percentagem não chega à tua conta.
            </li>
            <li>
              <strong>Sobre o valor sem IVA</strong> — da receita real dos serviços, que
              percentagem vai para impostos e contribuições.
            </li>
          </ul>
        </section>
      </div>

      <p className="contexto-back">
        <Link to="/">← Voltar ao simulador</Link>
      </p>

      <SiteFooter />
    </div>
  )
}
