import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EnseignantDashboard from './pages/EnseignantDashboard'
import Filieres from './pages/Filieres'
import Classes from './pages/Classes'
import Eleves from './pages/Eleves'
import Notes from './pages/Notes'
import Absences from './pages/Absences'
import Paiements from './pages/Paiements'
import MonEspace from './pages/MonEspace'
import EspaceParent from './pages/EspaceParent'
import Parents from './pages/Parents'
import EmploisDuTemps from './pages/EmploisDuTemps'
import Rapports from './pages/Rapports'
import Parametres from './pages/Parametres'

// Gardien général pour utilisateurs connectés
function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

// Gardien pour Admin uniquement
function AdminRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

// Gardien pour Admin ET Enseignant (Staff scolaire)
function StaffRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'admin' && user.role !== 'enseignant') return <Navigate to="/login" replace />
  return children
}

// Gardien pour Enseignant uniquement (Dashboard spécifique)
function EnseignantRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'enseignant') return <Navigate to="/login" replace />
  return children
}

// Gardien pour Élève uniquement
function EleveRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'eleve') return <Navigate to="/login" replace />
  return children
}

// Gardien pour Parent uniquement
function ParentRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (!token) return <Navigate to="/login" replace />
  if (user.role !== 'parent') return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* PAGES ACCESSIBLES AU STAFF (ADMIN & ENSEIGNANT) */}
        <Route path="/eleves" element={<StaffRoute><Eleves /></StaffRoute>} />
        <Route path="/filieres" element={<StaffRoute><Filieres /></StaffRoute>} />
        <Route path="/classes" element={<StaffRoute><Classes /></StaffRoute>} />
        <Route path="/notes" element={<StaffRoute><Notes /></StaffRoute>} />
        <Route path="/absences" element={<StaffRoute><Absences /></StaffRoute>} />

        {/* DASHBOARDS SPÉCIFIQUES */}
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/enseignant" element={<EnseignantRoute><EnseignantDashboard /></EnseignantRoute>} />
        
        {/* PAGES ADMIN UNIQUEMENT */}
        <Route path="/parents" element={<AdminRoute><Parents /></AdminRoute>} />
        <Route path="/paiements" element={<AdminRoute><Paiements /></AdminRoute>} />
        <Route path="/rapports" element={<AdminRoute><Rapports /></AdminRoute>} />
        <Route path="/parametres" element={<AdminRoute><Parametres /></AdminRoute>} />
        
        {/* ÉLÈVE & PARENT */}
        <Route path="/mon-espace" element={<EleveRoute><MonEspace /></EleveRoute>} />
        <Route path="/parent" element={<ParentRoute><EspaceParent /></ParentRoute>} />

        {/* ACCÈS TOUS UTILISATEURS CONNECTÉS */}
        <Route path="/emplois-du-temps" element={<PrivateRoute><EmploisDuTemps /></PrivateRoute>} />
        
        {/* REDIRECTION INTELLIGENTE ACCUEIL */}
        <Route path="/" element={
          !user.role ? <Navigate to="/login" replace /> :
          user.role === 'admin' ? <Navigate to="/dashboard" replace /> :
          user.role === 'enseignant' ? <Navigate to="/enseignant" replace /> :
          user.role === 'parent' ? <Navigate to="/parent" replace /> :
          <Navigate to="/mon-espace" replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}
