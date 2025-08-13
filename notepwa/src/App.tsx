import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Privacy from './pages/Privacy'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Detail from './pages/Detail'
import My from './pages/My'
import { useAppStore } from './store'
import './App.css'

function RequirePrivacy() {
  const accepted = useAppStore((s) => s.privacyAccepted)
  if (!accepted) {
    return <Navigate to="/privacy" replace />
  }
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route element={<RequirePrivacy />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/my" element={<My />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
