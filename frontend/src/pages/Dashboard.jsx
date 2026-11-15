import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Atom,
  BarChart3,
  Database,
  Flame,
  Globe2,
  Microscope,
  ShieldAlert,
  Sparkles,
  Telescope,
  TrendingUp,
  Waves,
  Zap
} from 'lucide-react'
import { getInvestigations } from '../api'

const researchAreas = [
  {
    title: 'Spacecraft Fire Safety',
    description: 'Prevention and behavior of fire aboard spacecraft.',
    icon: ShieldAlert,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: 'bg-red-500'
  },
  {
    title: 'Droplet Combustion',
    description: 'Study of droplet combustion under microgravity conditions.',
    icon: Waves,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    accent: 'bg-blue-700'
  },
  {
    title: 'Gaseous Combustion',
    description: 'Premixed and non-premixed gaseous combustion.',
    icon: Flame,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    accent: 'bg-orange-500'
  },
  {
    title: 'Supercritical Fluids',
    description: 'Behavior of reactive fluids under supercritical conditions.',
    icon: Atom,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    accent: 'bg-yellow-500'
  },
  {
    title: 'Solid Fuels',
    description: 'Combustion and flame propagation in solid materials.',
    icon: Zap,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    accent: 'bg-indigo-600'
  }
]

function StatCard({ title, value, description, icon: Icon, color, bg }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-[#0B3D91] mt-2">
            {value}
          </h2>
        </div>

        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${bg}`}>
          <Icon size={22} className={color} />
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">{description}</p>
    </div>
  )
}

function SectionTitle({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
        <Icon size={19} className="text-[#0B3D91]" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

function Dashboard() {
  const [investigations, setInvestigations] = useState([])

  // Investigations PSI indexées par le backend (silencieux si le serveur est éteint)
  useEffect(() => {
    getInvestigations()
      .then((data) => setInvestigations(Array.isArray(data) ? data : []))
      .catch(() => setInvestigations([]))
  }, [])

  return (
    <div className="h-full overflow-y-auto bg-[#F4F6FA]">
      <div className="max-w-[1600px] mx-auto px-5 pt-3 pb-5 md:px-8 md:pt-4 md:pb-8 space-y-7">

        {/* Header */}
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Research Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Explore combustion science and microgravity research.
          </p>
        </div>

        {/* Statistics */}
        <section>
          <SectionTitle
            title="Research Overview"
            subtitle="Overview of the research program"
            icon={BarChart3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Investigations"
              value="24"
              description="Results from the NASA PSI combustion search"
              icon={Database}
              color="text-[#0B3D91]"
              bg="bg-blue-50"
            />


            <StatCard
              title="Research Areas"
              value="05"
              description="Scientific combustion research domains"
              icon={Microscope}
              color="text-yellow-700"
              bg="bg-yellow-50"
            />


          </div>
        </section>


        {/* Research domains */}
        <section>
          <SectionTitle
            title="Combustion Research Areas"
            subtitle="Key scientific domains under investigation"
            icon={Telescope}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {researchAreas.map((area, index) => {
              const Icon = area.icon

              return (
                <div
                  key={area.title}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${area.bg} group-hover:scale-105 transition-transform`}>
                    <Icon size={22} className={area.color} />
                  </div>

                  <p className="text-xs text-gray-400 font-semibold mt-5">
                    DOMAIN 0{index + 1}
                  </p>

                  <h3 className="text-sm font-bold text-gray-900 mt-1">
                    {area.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recent investigations */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <SectionTitle
              title="Recent Investigations"
              subtitle="Explore NASA PSI research data"
              icon={Database}
            />

            <a
              href="https://psi.nasa.gov/physci/repo/search?q=combustion&data_source=psi&data_type=investigation"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#0B3D91] hover:text-red-600 inline-flex items-center gap-1"
            >
              Explore Repository
              <ArrowUpRight size={15} />
            </a>
          </div>

          {investigations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
              {investigations.slice(0, 6).map((inv) => (
                <div
                  key={inv.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col"
                >
                  <p className="text-xs font-semibold text-gray-400 tracking-wider">
                    {inv.id}
                  </p>

                  <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug">
                    {inv.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2">
                    {[inv.platform, inv.size, inv.research_area].filter(Boolean).join(' · ')}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {inv.publications?.length || 0} linked resources
                  </p>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                    {inv.url && (
                      <a
                        href={inv.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#0B3D91] hover:text-red-600 inline-flex items-center gap-1"
                      >
                        PSI page
                        <ArrowUpRight size={13} />
                      </a>
                    )}

                    {inv.doi_url && (
                      <a
                        href={inv.doi_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-[#0B3D91] hover:text-red-600 inline-flex items-center gap-1"
                      >
                        Dataset DOI
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                <Database size={25} className="text-[#0B3D91]" />
              </div>

              <h3 className="text-sm font-bold text-gray-800 mt-4">
                No Investigations Loaded Yet
              </h3>

              <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                Investigations will appear here once the Luminar backend is
                running and its NASA PSI metadata has been indexed.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-5 pb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>

            <p className="text-xs font-bold text-[#0B3D91] tracking-wider">
              LUMINAR
            </p>

            <span className="text-xs text-gray-400">
              | Combustion Research Platform
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Research Data Source: NASA Physical Sciences Informatics
          </p>
        </footer>

      </div>
    </div>
  )
}

export default Dashboard