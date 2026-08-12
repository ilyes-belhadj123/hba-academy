import { Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/RequireAdmin/RequireAdmin'
import { CataloguePage } from './pages/CataloguePage'
import { FormationDetailPage } from './pages/FormationDetailPage'
import { HomePage } from './pages/HomePage'
import { AdminFormationsPage } from './pages/admin/AdminFormationsPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/formations/:id" element={<FormationDetailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/formations"
        element={
          <RequireAdmin>
            <AdminFormationsPage />
          </RequireAdmin>
        }
      />
    </Routes>
  )
}

export default App
