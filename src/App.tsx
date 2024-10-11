import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import RequireAuth from './features/RequireAuth'
import Dashboard from './pages/Dashboard'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path='dashboard' element={<Dashboard/>}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App