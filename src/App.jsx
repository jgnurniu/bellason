import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Register  from './pages/Register'

import NewRequest from './pages/client/NewRequest'
import MyRequests from './pages/client/MyRequests'

import Feed       from './pages/provider/Feed'
import LeadDetail from './pages/provider/LeadDetail'
import MyLeads    from './pages/provider/MyLeads'
import Profile    from './pages/provider/Profile'

function App() {
  const { user, role, loading } = useAuth()

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#0a0010' }} />

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Perfil público — cualquiera puede ver el perfil de una proveedora */}
        <Route path="/perfil/:id" element={<Profile />} />

        {/* Cliente */}
        <Route path="/nueva-solicitud" element={
          user && role === 'client' ? <NewRequest /> : <Navigate to="/login" />
        } />
        <Route path="/mis-solicitudes" element={
          user && role === 'client' ? <MyRequests /> : <Navigate to="/login" />
        } />

        {/* Proveedor */}
        <Route path="/solicitudes" element={
          user && role === 'provider' ? <Feed /> : <Navigate to="/login" />
        } />
        <Route path="/solicitudes/:id" element={
          user && role === 'provider' ? <LeadDetail /> : <Navigate to="/login" />
        } />
        <Route path="/mis-leads" element={
          user && role === 'provider' ? <MyLeads /> : <Navigate to="/login" />
        } />

        {/* Mi perfil — proveedora ve su propio perfil (sin :id en URL) */}
        <Route path="/mi-perfil" element={
          user && role === 'provider' ? <Profile /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App