import { Route, Routes, useLocation } from 'react-router-dom'
import { ChatWidget } from './components/ChatWidget/ChatWidget'
import { CookieConsentBanner } from './components/CookieConsentBanner/CookieConsentBanner'
import { Footer } from './components/Footer/Footer'
import { RequireAdmin } from './components/RequireAdmin/RequireAdmin'
import { RequirePortail } from './components/RequirePortail/RequirePortail'
import { CataloguePage } from './pages/CataloguePage'
import { CertificatVerificationPage } from './pages/CertificatVerificationPage'
import { FormateurDetailPage } from './pages/FormateurDetailPage'
import { FormateursPage } from './pages/FormateursPage'
import { FormationDetailPage } from './pages/FormationDetailPage'
import { HomePage } from './pages/HomePage'
import { OrientationPage } from './pages/OrientationPage'
import { PreuvesSocialesPage } from './pages/PreuvesSocialesPage'
import { RealisationsPage } from './pages/RealisationsPage'
import { AdminApprenantsPage } from './pages/admin/AdminApprenantsPage'
import { AdminFormateursPage } from './pages/admin/AdminFormateursPage'
import { AdminFormationsPage } from './pages/admin/AdminFormationsPage'
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminRealisationsPage } from './pages/admin/AdminRealisationsPage'
import { AdminStatsPage } from './pages/admin/AdminStatsPage'
import { AdminTemoignagesPage } from './pages/admin/AdminTemoignagesPage'
import { CGUPage } from './pages/legal/CGUPage'
import { MentionsLegalesPage } from './pages/legal/MentionsLegalesPage'
import { PolitiqueConfidentialitePage } from './pages/legal/PolitiqueConfidentialitePage'
import { PortailDashboardPage } from './pages/portail/PortailDashboardPage'
import { PortailLoginPage } from './pages/portail/PortailLoginPage'

function App() {
  const location = useLocation()
  const isPrivateRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portail')

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/formations/:id" element={<FormationDetailPage />} />
        <Route path="/formateurs" element={<FormateursPage />} />
        <Route path="/formateurs/:id" element={<FormateurDetailPage />} />
        <Route path="/preuves-sociales" element={<PreuvesSocialesPage />} />
        <Route path="/realisations" element={<RealisationsPage />} />
        <Route path="/orientation" element={<OrientationPage />} />
        <Route path="/certificats/verifier/:code" element={<CertificatVerificationPage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
        <Route path="/conditions-generales" element={<CGUPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/formations"
          element={
            <RequireAdmin>
              <AdminFormationsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/temoignages"
          element={
            <RequireAdmin>
              <AdminTemoignagesPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/formateurs"
          element={
            <RequireAdmin>
              <AdminFormateursPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/realisations"
          element={
            <RequireAdmin>
              <AdminRealisationsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/apprenants"
          element={
            <RequireAdmin>
              <AdminApprenantsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <RequireAdmin>
              <AdminLeadsPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <RequireAdmin>
              <AdminStatsPage />
            </RequireAdmin>
          }
        />
        <Route path="/portail/login" element={<PortailLoginPage />} />
        <Route
          path="/portail"
          element={
            <RequirePortail>
              <PortailDashboardPage />
            </RequirePortail>
          }
        />
      </Routes>
      {!isPrivateRoute && <Footer />}
      {!isPrivateRoute && <ChatWidget />}
      {!isPrivateRoute && <CookieConsentBanner />}
    </>
  )
}

export default App
