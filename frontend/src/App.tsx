import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ChatWidget } from './components/ChatWidget/ChatWidget'
import { CookieConsentBanner } from './components/CookieConsentBanner/CookieConsentBanner'
import { Footer } from './components/Footer/Footer'
import { RequireAdmin } from './components/RequireAdmin/RequireAdmin'
import { RequirePortail } from './components/RequirePortail/RequirePortail'
import { CataloguePage } from './pages/CataloguePage'
import { HomePage } from './pages/HomePage'

const CertificatVerificationPage = lazy(() =>
  import('./pages/CertificatVerificationPage').then((m) => ({ default: m.CertificatVerificationPage })),
)
const FormateurDetailPage = lazy(() =>
  import('./pages/FormateurDetailPage').then((m) => ({ default: m.FormateurDetailPage })),
)
const FormateursPage = lazy(() => import('./pages/FormateursPage').then((m) => ({ default: m.FormateursPage })))
const FormationDetailPage = lazy(() =>
  import('./pages/FormationDetailPage').then((m) => ({ default: m.FormationDetailPage })),
)
const OrientationPage = lazy(() => import('./pages/OrientationPage').then((m) => ({ default: m.OrientationPage })))
const PreuvesSocialesPage = lazy(() =>
  import('./pages/PreuvesSocialesPage').then((m) => ({ default: m.PreuvesSocialesPage })),
)
const RealisationsPage = lazy(() => import('./pages/RealisationsPage').then((m) => ({ default: m.RealisationsPage })))
const AdminApprenantsPage = lazy(() =>
  import('./pages/admin/AdminApprenantsPage').then((m) => ({ default: m.AdminApprenantsPage })),
)
const AdminFormateursPage = lazy(() =>
  import('./pages/admin/AdminFormateursPage').then((m) => ({ default: m.AdminFormateursPage })),
)
const AdminFormationsPage = lazy(() =>
  import('./pages/admin/AdminFormationsPage').then((m) => ({ default: m.AdminFormationsPage })),
)
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage').then((m) => ({ default: m.AdminLeadsPage })))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })))
const AdminRealisationsPage = lazy(() =>
  import('./pages/admin/AdminRealisationsPage').then((m) => ({ default: m.AdminRealisationsPage })),
)
const AdminStatsPage = lazy(() => import('./pages/admin/AdminStatsPage').then((m) => ({ default: m.AdminStatsPage })))
const AdminTemoignagesPage = lazy(() =>
  import('./pages/admin/AdminTemoignagesPage').then((m) => ({ default: m.AdminTemoignagesPage })),
)
const CGUPage = lazy(() => import('./pages/legal/CGUPage').then((m) => ({ default: m.CGUPage })))
const MentionsLegalesPage = lazy(() =>
  import('./pages/legal/MentionsLegalesPage').then((m) => ({ default: m.MentionsLegalesPage })),
)
const PolitiqueConfidentialitePage = lazy(() =>
  import('./pages/legal/PolitiqueConfidentialitePage').then((m) => ({ default: m.PolitiqueConfidentialitePage })),
)
const PortailDashboardPage = lazy(() =>
  import('./pages/portail/PortailDashboardPage').then((m) => ({ default: m.PortailDashboardPage })),
)
const PortailLoginPage = lazy(() =>
  import('./pages/portail/PortailLoginPage').then((m) => ({ default: m.PortailLoginPage })),
)

function App() {
  const location = useLocation()
  const isPrivateRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portail')

  return (
    <>
      <Suspense fallback={null}>
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
      </Suspense>
      {!isPrivateRoute && <Footer />}
      {!isPrivateRoute && <ChatWidget />}
      {!isPrivateRoute && <CookieConsentBanner />}
    </>
  )
}

export default App
