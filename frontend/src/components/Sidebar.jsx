
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  House,
  LayoutDashboard,
  Bot,
  Database,
  FlaskConical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { name: 'Home', icon: House, path: '/' },
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
  { name: 'Investigations', icon: FlaskConical, path: '/investigations' },
]

function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className={`sidebar-scroll relative h-full min-h-0 shrink-0
        bg-white border-r border-gray-100 px-3 py-6
        flex flex-col overflow-y-auto overscroll-contain
        transition-all duration-300 ease-in-out
        ${expanded ? 'w-[260px]' : 'w-[76px]'}`}
    >

      {/* Bouton d'agrandissement */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="absolute right-1 top-3 z-20
          w-7 h-7 rounded-full bg-white border border-gray-200
          shadow-sm flex items-center justify-center
          text-gray-500 hover:bg-gray-100 transition-colors"
      >
        {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Navigation */}
      <nav className="space-y-1 mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={!expanded ? item.name : undefined}
              className={({ isActive }) =>
                `w-full flex items-center
                ${expanded ? 'gap-3 px-4' : 'justify-center px-2'}
                py-3 rounded-xl text-sm font-medium
                transition-colors duration-200
                ${
                  isActive
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className="shrink-0 text-gray-500"
              />

              {expanded && (
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
