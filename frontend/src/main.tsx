import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { PortailAuthProvider } from './context/PortailAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <PortailAuthProvider>
          <App />
        </PortailAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
