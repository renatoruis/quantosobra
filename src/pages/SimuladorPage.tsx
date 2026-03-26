import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { calculateSimulation } from '../engine/calculateSimulation'
import type { SimulationInput } from '../engine/types'
import { MIN_BASE_SALARY } from '../engine/types'
import { displayNames } from '../format'
import { SimulationForm } from '../components/SimulationForm'
import { PersonalOutcome } from '../components/PersonalOutcome'
import { CompanyReserves } from '../components/CompanyReserves'
import { AllowanceSuggestion } from '../components/AllowanceSuggestion'
import { Dashboard } from '../components/Dashboard'
import { BreakdownTables } from '../components/BreakdownTables'
import { CashFlowDiagram } from '../components/CashFlowDiagram'
import { Timeline } from '../components/Timeline'
import { Alerts } from '../components/Alerts'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'

const defaultInput: SimulationInput = {
  companyName: 'Empresa X',
  employeeName: 'Fulano',
  dailyRate: 175,
  workingDays: 20,
  baseSalary: MIN_BASE_SALARY,
  accountantFee: 115,
  expenseAllowance: 0,
}

export function SimuladorPage() {
  const [input, setInput] = useState<SimulationInput>(defaultInput)

  const result = useMemo(() => calculateSimulation(input), [input])
  const names = useMemo(() => displayNames(input), [input])

  const applySuggestedAllowance = useCallback((value: number) => {
    setInput((prev) => ({ ...prev, expenseAllowance: value }))
  }, [])

  return (
    <div className="app-shell">
      <SiteHeader />

      <div className="hero-block card hero-card">
        <h1 className="hero-title">Quanto sobra para ti ao fim do mês?</h1>
        <ul className="hero-bullets">
          <li>
            <strong>O que é:</strong> um simulador para profissionais de TI (developers,
            DevOps, tech leads...) que trabalham por empresa B2B em Portugal e querem
            perceber <strong>quanto chega à conta pessoal</strong> depois de impostos.
          </li>
          <li>
            <strong>Para quem:</strong> especialmente para quem veio do estrangeiro
            (ex.: Brasil) e precisa de abrir empresa para facturar ao cliente — o
            equivalente ao «PJ» em Portugal.
          </li>
          <li>
            <strong>O que obténs:</strong> o valor líquido na tua conta, quanto guardar
            para impostos e uma sugestão de ajudas de custo para pagar o mínimo
            de impostos <strong>dentro da lei</strong>.
          </li>
        </ul>
        <p className="hero-more">
          <Link to="/contexto" className="hero-link">
            Sabe mais: como funciona e quais as limitações →
          </Link>
        </p>
      </div>

      <main className="app-main">
        <SimulationForm value={input} onChange={setInput} />
        <Alerts errors={result.errors} warnings={result.warnings} />

        {result.valid && (
          <div className="domain-legend" aria-label="Legenda de cores">
            <span className="legend-item legend-company">Empresa</span>
            <span className="legend-item legend-person">Pessoal</span>
            <span className="legend-item legend-state">Estado</span>
            <span className="legend-item legend-client">Cliente</span>
          </div>
        )}

        <PersonalOutcome result={result} names={names} />
        <CompanyReserves result={result} names={names} />
        <Dashboard result={result} names={names} />
        <CashFlowDiagram result={result} names={names} />
        <BreakdownTables result={result} names={names} />
        <AllowanceSuggestion
          input={input}
          valid={result.valid}
          names={names}
          onApplySuggestedAllowance={applySuggestedAllowance}
        />
        <Timeline />
      </main>

      <SiteFooter />
    </div>
  )
}
