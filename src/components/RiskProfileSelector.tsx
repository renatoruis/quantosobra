import type { RiskProfile, RiskProfileId } from '../engine/riskProfiles'
import { ALLOWANCE_LIMITS_YEAR } from '../engine/allowanceLimits'
import { formatEur } from '../format'

type Props = {
  profiles: RiskProfile[]
  selectedId: RiskProfileId | 'custom'
  onSelect: (profile: RiskProfile) => void
}

export function RiskProfileSelector({ profiles, selectedId, onSelect }: Props) {
  return (
    <section className="card risk-section">
      <p className="section-eyebrow">Otimiza o teu líquido</p>
      <h2>Ajudas de custo e kms — escolhe o nível de risco</h2>
      <p className="risk-lead">
        Limites isentos de {ALLOWANCE_LIMITS_YEAR}. Clica num perfil para aplicar ao
        simulador.
      </p>
      <div className="risk-cards" role="radiogroup" aria-label="Perfil de risco de ajudas de custo">
        {profiles.map((profile) => {
          const active = profile.id === selectedId
          return (
            <div
              key={profile.id}
              className={`risk-card risk-card-${profile.id}${active ? ' risk-card-active' : ''}`}
            >
              <button
                type="button"
                className="risk-card-main"
                role="radio"
                aria-checked={active}
                onClick={() => onSelect(profile)}
              >
                <span className="risk-card-title">
                  {profile.label}
                  {active && <span className="risk-card-check" aria-hidden> ✓</span>}
                </span>
                <span className="risk-card-tagline">{profile.tagline}</span>
                <span className="risk-card-net">
                  {formatEur(profile.netPersonal)}
                  <span className="risk-card-net-label"> /mês na tua conta</span>
                </span>
                <span className="risk-card-allowance">
                  {formatEur(profile.totalAllowance)} em ajudas + kms
                </span>
                {profile.excessTotal > 0 && (
                  <span className="risk-card-badge">
                    ⚠ {formatEur(profile.excessTotal)} acima dos limites isentos
                  </span>
                )}
                {profile.cappedByHeadroom && (
                  <span className="risk-card-capped">Ajustado à margem da empresa</span>
                )}
              </button>
              <p className="risk-card-note">{profile.riskNote}</p>
              {profile.items.length > 0 && (
                <details className="risk-card-details">
                  <summary>Ver composição</summary>
                  <table className="risk-items-table">
                    <tbody>
                      {profile.items.map((item) => (
                        <tr key={item.kind}>
                          <td>
                            {item.label}
                            <span className="row-desc"> {item.detail}</span>
                          </td>
                          <td className="num">{formatEur(item.monthly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
