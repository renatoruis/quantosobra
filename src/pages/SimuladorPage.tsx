import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { calculateSimulation } from '../engine/calculateSimulation'
import { buildRiskProfiles, type RiskProfile, type RiskProfileId } from '../engine/riskProfiles'
import type { SimulationInput } from '../engine/types'
import { MIN_BASE_SALARY } from '../engine/types'
import { displayNames, formatEur } from '../format'
import { SimulationForm } from '../components/SimulationForm'
import { ResultHero } from '../components/ResultHero'
import { RiskProfileSelector } from '../components/RiskProfileSelector'
import { DetailsTabs } from '../components/DetailsTabs'
import { BreakdownTables } from '../components/BreakdownTables'
import { EmploymentComparison } from '../components/EmploymentComparison'
import { CashFlowDiagram } from '../components/CashFlowDiagram'
import { Timeline } from '../components/Timeline'
import { Alerts } from '../components/Alerts'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'

const defaultInput: SimulationInput = {
  companyName: '',
  employeeName: '',
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
  const profiles = useMemo(() => buildRiskProfiles(input), [input])

  const selectedProfileId: RiskProfileId | 'custom' =
    profiles.find((p) => Math.abs(p.totalAllowance - input.expenseAllowance) < 0.01)?.id ??
    'custom'

  const applyProfile = useCallback((profile: RiskProfile) => {
    setInput((prev) => ({ ...prev, expenseAllowance: profile.totalAllowance }))
  }, [])

  return (
    <div className="app-shell">
      <SiteHeader />

      <p className="tagline">
        Faturas a uma consultoria em Portugal pela tua empresa pessoal (B2B)? Vê quanto
        chega mesmo à tua conta de pessoa física — e como pagar menos impostos com
        ajudas de custo e kms.{' '}
        <Link to="/contexto" className="tagline-link">Como funciona →</Link>
      </p>

      {result.valid && (
        <div className="result-mini" aria-hidden>
          <span>Na tua conta:</span> <strong>{formatEur(result.totalPersonalIncome)}</strong> /mês
        </div>
      )}

      <main className="simulador-layout">
        <div className="simulador-left">
          <SimulationForm value={input} onChange={setInput} />
          <Alerts errors={result.errors} warnings={result.warnings} />
          {result.valid && (
            <RiskProfileSelector
              profiles={profiles}
              selectedId={selectedProfileId}
              onSelect={applyProfile}
            />
          )}
          {result.valid && (
            <DetailsTabs
              tabs={[
                {
                  id: 'fluxo',
                  label: 'Fluxo do dinheiro',
                  content: <CashFlowDiagram result={result} names={names} />,
                },
                {
                  id: 'detalhe',
                  label: 'Detalhe',
                  content: <BreakdownTables result={result} names={names} />,
                },
                {
                  id: 'contrato',
                  label: 'Vs. contrato sem termo',
                  content: <EmploymentComparison input={input} result={result} />,
                },
                {
                  id: 'calendario',
                  label: 'Calendário fiscal',
                  content: <Timeline />,
                },
              ]}
            />
          )}
        </div>
        <div className="simulador-right">
          <ResultHero result={result} names={names} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
