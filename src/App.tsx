import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import RequireAuth from './features/RequireAuth'
import Dashboard from './pages/Dashboard'
import Articles from './pages/Articles'
import ArticleDetails from './pages/Articles/Details'
import Register from './pages/Register'
import Profiles from './pages/Profiles'
import ManageArticles from './pages/Articles/Manage'
import Category from './pages/Category'
import Landing from './pages/Landing'

function App() {
  

  return (
    <Routes>
      
      <Route path="/">
        <Route index element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:documentId" element={<ArticleDetails />} />
            <Route path="/articles/manage" element={<ManageArticles />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/category" element={<Category />} />
          </Route>
        </Route>
      </Route>
      
    </Routes>
  )
}

export default App