import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="app-footer site-footer">
      <p>
        Os valores apresentados são estimativas para planeamento — não substituem
        o contabilista nem declarações oficiais.{' '}
        <Link to="/contexto">Sabe mais sobre como funciona</Link>.
      </p>
    </footer>
  )
}
