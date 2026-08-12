import { Link } from 'react-router-dom'
import './Footer.css'

export function Footer() {
  return (
    <footer className="hba-footer">
      <span>© {new Date().getFullYear()} HBA Academy</span>
      <nav>
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/politique-confidentialite">Politique de confidentialité</Link>
        <Link to="/conditions-generales">CGU</Link>
      </nav>
    </footer>
  )
}
