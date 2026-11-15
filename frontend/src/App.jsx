import './App.css'
import { MessageCircle } from 'lucide-react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Accueil from './pages/Accueil'
import Dashboard from './pages/Dashboard'
import Assistant from './pages/Ai_assistant'
import Investigation from './pages/Investigation'
import Search from './pages/Search'
import NewsDetail from './pages/NewsDetail'

function Placeholder({ title }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">
        This section is currently under development.
      </p>
    </div>
  )
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isAssistantPage = location.pathname === '/ai-assistant'

  return (
    <div className="h-screen w-full bg-white overflow-hidden flex flex-col">

      {/* Navbar fixe */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Zone principale */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">

        {/* Sidebar indépendante */}
        <Sidebar />

        {/* Contenu des pages */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<Assistant />} />
            <Route path="/search" element={<Search />} />
            <Route path="/investigations" element={<Investigation />} />
            <Route path="/news" element={<Navigate to="/" replace />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Bouton flottant de l'assistant */}
      {!isAssistantPage && (
        <button
          aria-label="Open AI Assistant"
          onClick={() => navigate('/ai-assistant')}
          className="fixed bottom-6 right-6 z-50 w-16 h-16
            rounded-full bg-[#0B3D91] text-white shadow-lg
            flex items-center justify-center
            hover:bg-blue-800 hover:scale-110 transition-all"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App