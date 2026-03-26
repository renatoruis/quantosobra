import { Link, NavLink } from 'react-router-dom'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand">
          <img src="/logo.png" alt="Quanto Sobra" className="site-logo" />
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Simulador
          </NavLink>
          <NavLink
            to="/contexto"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Como funciona
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
