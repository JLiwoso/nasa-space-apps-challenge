import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, FlaskConical, Loader2, Search, X } from 'lucide-react'
import nasa_icon from '../assets/nasa_logo.png'
import useSearch from '../hooks/useSearch'
import { typeOf } from './sourceTypes'

function Navbar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  const { data, loading, error } = useSearch(query, { k: 5 })
  const trimmed = query.trim()
  const showPanel = open && trimmed.length >= 2

  // ferme le menu au clic extérieur ou avec Échap
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const goToResults = () => {
    if (trimmed.length < 2) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    goToResults()
  }

  const empty = data && !data.investigations.length && !data.chunks.length

  return (
    <div className="navbar w-full flex justify-between rounded-2xl border border-gray-200 bg-white shadow-none px-6">
      <div>
        <img src={nasa_icon} alt="NASA Logo" className="w-24 h-24 object-contain" />
      </div>

      <div ref={boxRef} className="relative w-64 md:w-96">

        {showPanel && (
          <div className="absolute right-0 top-full mt-2 w-[min(32rem,90vw)] z-50 max-h-[70vh] overflow-y-auto
            rounded-2xl border border-gray-200 bg-white shadow-xl text-left">

            {error && <p className="px-4 py-4 text-sm text-red-600">{error}</p>}

            {!error && !data && (
              <p className="px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
                <Loader2 size={15} className="animate-spin" /> Searching NASA data...
              </p>
            )}

            {empty && (
              <p className="px-4 py-4 text-sm text-gray-500">No result for “{trimmed}”.</p>
            )}

            {data?.investigations.length > 0 && (
              <div className="p-2">
                <p className="px-2 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Investigations
                </p>

                {data.investigations.map((inv) => (
                  <a
                    key={inv.id}
                    href={inv.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-blue-50"
                  >
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FlaskConical size={16} className="text-[#0B3D91]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-800 truncate">{inv.name}</span>
                      <span className="block text-xs text-gray-400 truncate">
                        {[inv.id, inv.research_area, `${inv.publications} resources`].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    <ArrowUpRight size={15} className="mt-1 text-gray-300" />
                  </a>
                ))}
              </div>
            )}

            {data?.chunks.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <p className="px-2 pt-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Related passages
                </p>

                {data.chunks.map((chunk) => {
                  const { icon: Icon, label } = typeOf(chunk.type)
                  const Row = chunk.url ? 'a' : 'div'

                  return (
                    <Row
                      key={chunk.id}
                      {...(chunk.url
                        ? { href: chunk.url, target: '_blank', rel: 'noreferrer', onClick: () => setOpen(false) }
                        : {})}
                      className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-blue-50"
                    >
                      <span className="w-8 h-8 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Icon size={16} className="text-gray-600" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-gray-800 truncate">{chunk.title}</span>
                        <span className="block text-xs text-gray-500 line-clamp-2">{chunk.snippet}</span>
                        <span className="block text-[11px] text-gray-400 mt-0.5">
                          {label}
                          {chunk.page ? ` · page ${chunk.page}` : ''} · {Math.round(chunk.score * 100)}% match
                        </span>
                      </span>
                    </Row>
                  )
                })}
              </div>
            )}

            {data && !empty && (
              <button
                type="button"
                onClick={goToResults}
                className="w-full border-t border-gray-100 px-4 py-3 text-sm font-semibold text-[#0B3D91] hover:bg-blue-50 rounded-b-2xl"
              >
                See all results for “{trimmed}”
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar