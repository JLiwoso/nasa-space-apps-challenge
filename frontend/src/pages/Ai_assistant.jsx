import { useEffect, useRef, useState } from 'react'
import {
  Send,
  User,
  Bot,
  Loader2,
  FileText,
  Globe,
  Database,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { askRag } from '../api'

const GREETING = {
  role: 'assistant',
  isGreeting: true,
  content:
    "Hello! Welcome to Luminar AI. I'm your intelligent space science assistant. I can help you explore NASA experiments, understand scientific discoveries, and navigate space research data. What would you like to discover today?",
}

const SUGGESTIONS = [
  'What is the BASS experiment and what did it find?',
  'Which experiments studied flame spread in microgravity?',
  'Where can I find papers about cool flames?',
  'How are spacecraft materials tested for fire safety?',
]

const SOURCE_STYLE = {
  pdf: { icon: FileText, label: 'PDF' },
  web: { icon: Globe, label: 'Web' },
  psi: { icon: Database, label: 'NASA PSI' },
  psi_resource: { icon: Database, label: 'NASA PSI' },
}

/* ---------- Texte enrichi : **gras**, listes, citations [n] cliquables ---------- */

function Inline({ text, sources }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\d+(?:\s*,\s*\d+)*\])/g)

  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }

    if (/^\[\d+(?:\s*,\s*\d+)*\]$/.test(part)) {
      const numbers = part.slice(1, -1).split(',').map((n) => Number(n.trim()))

      return (
        <span key={i}>
          {numbers.map((n) => {
            const source = sources?.find((s) => s.n === n)
            if (!source?.url) return <span key={n}>[{n}]</span>

            return (
              <a
                key={n}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                title={source.title}
                className="mx-0.5 inline-flex items-center justify-center
                  min-w-[20px] h-5 px-1.5 rounded-md bg-blue-50
                  text-[11px] font-semibold text-[#0B3D91]
                  hover:bg-[#0B3D91] hover:text-white transition-colors no-underline align-middle"
              >
                {n}
              </a>
            )
          })}
        </span>
      )
    }

    return part
  })
}

function RichText({ text, sources }) {
  const blocks = []
  let list = null

  text.split('\n').forEach((raw) => {
    const line = raw.trimEnd()
    const bullet = line.match(/^\s*[-•*]\s+(.*)/)

    if (bullet) {
      if (!list) {
        list = []
        blocks.push({ type: 'ul', items: list })
      }
      list.push(bullet[1])
      return
    }

    list = null
    if (!line.trim()) return
    blocks.push({ type: 'p', text: line.replace(/^#{1,6}\s*/, '') })
  })

  return (
    <div className="space-y-3 text-[15px] leading-7 text-left">
      {blocks.map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="list-disc pl-5 space-y-1">
            {block.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} sources={sources} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={block.text} sources={sources} />
          </p>
        )
      )}
    </div>
  )
}

/* ---------- Liste des sources avec liens ---------- */

function Sources({ sources }) {
  if (!sources?.length) return null

  const sorted = [...sources].sort((a, b) => Number(b.cited) - Number(a.cited))

  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
        Sources
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sorted.map((source) => {
          const style = SOURCE_STYLE[source.type] || SOURCE_STYLE.web
          const Icon = style.icon

          return (
            <a
              key={source.n}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className={`group flex items-start gap-3 rounded-xl border px-3 py-2.5
                transition-colors hover:border-[#0B3D91] hover:bg-blue-50/40
                ${source.cited ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-white'}`}
            >
              <span className="w-6 h-6 shrink-0 rounded-md bg-white border border-gray-200
                flex items-center justify-center text-[11px] font-semibold text-[#0B3D91]">
                {source.n}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
                  {source.title}
                </p>

                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                  <Icon size={12} />
                  {style.label}
                  {source.page ? ` · page ${source.page}` : ''}
                </p>
              </div>

              <ArrowUpRight
                size={15}
                className="shrink-0 mt-0.5 text-gray-300 group-hover:text-[#0B3D91]"
              />
            </a>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

function Assistant() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([GREETING])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const prefilled = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const question = text.trim()
    if (!question || loading) return

    // les 4 derniers tours (hors message d'accueil et erreurs) servent de contexte
    const history = messages
      .filter((m) => !m.isGreeting && !m.error)
      .slice(-4)
      .map(({ role, content }) => ({ role, content }))

    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setMessage('')
    setLoading(true)

    try {
      const data = await askRag(question, history)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.message, error: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  // question préremplie depuis la page de recherche ("Ask Luminar AI"), envoyée une seule fois
  useEffect(() => {
    const question = location.state?.question
    if (!question || prefilled.current) return
    prefilled.current = true
    navigate(location.pathname, { replace: true, state: null })
    send(question)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
    send(message)
  }

  const onlyGreeting = messages.length === 1

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-white overflow-hidden">

      {/* Messages : seul cet espace défile */}
      <main
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain
          px-6 md:px-10 py-8"
      >
        <div className="w-full space-y-10">

          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full items-start gap-3 ${
                item.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >

              {/* Icône Assistant */}
              {item.role === 'assistant' && (
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center
                  ${item.error ? 'bg-red-50' : 'bg-gray-100'}`}>
                  {item.error ? (
                    <AlertCircle size={18} className="text-red-500" />
                  ) : (
                    <Bot size={18} className="text-gray-600" />
                  )}
                </div>
              )}

              {/* Icône utilisateur */}
              {item.role === 'user' && (
                <div className="w-8 h-8 shrink-0 rounded-full
                  bg-blue-50 flex items-center justify-center order-2">
                  <User size={17} className="text-[#0B3D91]" />
                </div>
              )}

              {/* Contenu du message */}
              <div
                className={`w-fit max-w-[75%] text-left ${
                  item.role === 'user'
                    ? 'bg-[#0B3D91] text-white rounded-2xl rounded-br-sm px-5 py-3'
                    : item.error
                      ? 'text-red-600 pt-1'
                      : 'text-gray-800 pt-1'
                }`}
              >
                {item.role === 'assistant' && !item.error ? (
                  <RichText text={item.content} sources={item.sources} />
                ) : (
                  <p className="text-[15px] leading-7 whitespace-pre-line text-left">
                    {item.content}
                  </p>
                )}

                {item.role === 'assistant' && <Sources sources={item.sources} />}

                {/* Suggestions affichées uniquement au démarrage */}
                {item.isGreeting && onlyGreeting && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-[13px] text-[#0B3D91] bg-blue-50 hover:bg-blue-100
                          rounded-full px-4 py-2 transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Indicateur de réponse en cours */}
          {loading && (
            <div className="flex w-full items-start gap-3 justify-start">
              <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100
                flex items-center justify-center">
                <Bot size={18} className="text-gray-600" />
              </div>

              <div className="pt-1 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Luminar is searching NASA data...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Barre de saisie : reste fixe en bas */}
      <footer className="shrink-0 px-6 md:px-10 pb-5 pt-3 bg-white">
        <form
          onSubmit={handleSend}
          className="w-full flex items-center gap-3
            border border-gray-200 rounded-2xl px-4 py-3
            bg-white shadow-sm focus-within:border-gray-400"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            maxLength={2000}
            placeholder="Ask Luminar anything about space science..."
            className="flex-1 min-w-0 outline-none text-sm
              text-gray-800 placeholder:text-gray-400 bg-transparent
              disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            aria-label="Send message"
            className="w-10 h-10 shrink-0 rounded-xl
              bg-[#0B3D91] text-white
              flex items-center justify-center
              hover:bg-blue-800 transition-colors
              disabled:opacity-40 disabled:hover:bg-[#0B3D91]"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </footer>

    </div>
  )
}

export default Assistant