import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, FlaskConical, Loader2, Search as SearchIcon, Sparkles } from 'lucide-react'
import useSearch from '../hooks/useSearch'
import { typeOf } from '../components/sourceTypes'

const FILTERS = [
  { value: undefined, label: 'All sources' },
  { value: 'psi', label: 'NASA PSI' },
  { value: 'psi_resource', label: 'PSI resources' },
  { value: 'pdf', label: 'PDF' },
  { value: 'web', label: 'Web' },
]

function Search() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') || ''
  const [type, setType] = useState(undefined)

  const { data, loading, error } = useSearch(q, { k: 20, type, delay: 0 })

  const askAi = () => navigate('/ai-assistant', { state: { question: q } })

  return (
    <div className="h-full w-full overflow-y-auto bg-[#F8FAFD] text-left">
      <div className="w-full max-w-5xl mx-auto px-5 py-7 md:px-8 md:py-9">

        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1769AA]">
          <SearchIcon size={15} /> Search results
        </p>

        <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[#142B4A] break-words">
          {q ? <>“{q}”</> : 'Search NASA data'}
        </h1>

        {!q && (
          <p className="mt-3 text-sm text-slate-500">
            Type a query in the search bar above: an experiment name, a topic such as “cool flames”, or a PSI id.
          </p>
        )}

        {q && (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setType(f.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    type === f.value
                      ? 'bg-[#0B3D91] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-[#1769AA]'
                  }`}
                >
                  {f.label}
                </button>
              ))}

              <button
                type="button"
                onClick={askAi}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-[#071D49] hover:bg-yellow-300"
              >
                <Sparkles size={15} /> Ask Luminar AI
              </button>
            </div>

            {loading && (
              <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={16} className="animate-spin" /> Searching NASA data...
              </p>
            )}

            {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

            {data && !loading && (
              <>
                {data.investigations.length > 0 && (
                  <section className="mt-8">
                    <h2 className="text-lg font-bold text-[#142B4A]">Investigations</h2>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.investigations.map((inv) => (
                        <a
                          key={inv.id}
                          href={inv.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200 hover:shadow-md transition"
                        >
                          <span className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FlaskConical size={19} className="text-[#0B3D91]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-[#142B4A]">{inv.name}</span>
                            <span className="block text-xs text-slate-400 mt-1">
                              {[inv.id, inv.research_area, inv.size].filter(Boolean).join(' · ')}
                            </span>
                            <span className="block text-xs text-slate-400">{inv.publications} linked resources</span>
                          </span>
                          <ArrowUpRight size={16} className="text-slate-300" />
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                <section className="mt-8">
                  <h2 className="text-lg font-bold text-[#142B4A]">
                    Related passages
                    <span className="ml-2 text-sm font-normal text-slate-400">({data.chunks.length})</span>
                  </h2>

                  {data.chunks.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No passage found{type ? ' for this source type' : ''}. Try another query or a different filter.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {data.chunks.map((chunk) => {
                        const { icon: Icon, label } = typeOf(chunk.type)

                        return (
                          <article key={chunk.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Icon size={14} />
                              <span className="font-semibold">{label}</span>
                              {chunk.page && <span>· page {chunk.page}</span>}
                              <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-[#0B3D91]">
                                {Math.round(chunk.score * 100)}% match
                              </span>
                            </div>

                            <h3 className="mt-2 text-sm font-bold text-[#142B4A]">{chunk.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{chunk.snippet}…</p>

                            {chunk.url && (
                              <a
                                href={chunk.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0B3D91] hover:text-red-600"
                              >
                                Open source <ArrowUpRight size={13} />
                              </a>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}

        <p className="mt-10 text-xs text-slate-400">
          Looking for the full list of experiments? Browse <Link to="/nasa-data" className="text-[#1769AA] hover:underline">NASA Data</Link>.
        </p>
      </div>
    </div>
  )
}

export default Search