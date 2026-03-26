type Props = {
  errors: string[]
  warnings: string[]
}

export function Alerts({ errors, warnings }: Props) {
  if (errors.length === 0 && warnings.length === 0) return null
  return (
    <div className="alerts">
      {errors.map((e) => (
        <div key={e} className="alert alert-error" role="alert">
          {e}
        </div>
      ))}
      {warnings.map((w) => (
        <div key={w} className="alert alert-warn" role="status">
          {w.split('\n\n').map((block, i) => (
            <p key={i} className="alert-paragraph">
              {block}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
