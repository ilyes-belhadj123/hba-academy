import { Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/RequireAdmin/RequireAdmin'
import { CataloguePage } from './pages/CataloguePage'
import { FormationDetailPage } from './pages/FormationDetailPage'
import { HomePage } from './pages/HomePage'
import { PreuvesSocialesPage } from './pages/PreuvesSocialesPage'
import { AdminFormationsPage } from './pages/admin/AdminFormationsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminTemoignagesPage } from './pages/admin/AdminTemoignagesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/formations/:id" element={<FormationDetailPage />} />
      <Route path="/preuves-sociales" element={<PreuvesSocialesPage />} />
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
    </Routes>
  )
}

export default App
