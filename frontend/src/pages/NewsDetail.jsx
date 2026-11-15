import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Flame,
  FlaskConical,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { getNews, news } from '../data/news'

/* =========================================================
   COMPOSANTS (même charte que la page Investigations)
========================================================= */

function SectionTitle({ icon: Icon, children }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-bold text-[#142B4A]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1769AA]">
        <Icon size={19} />
      </span>
      {children}
    </h3>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-left">
      <div className="flex items-center gap-2 text-slate-500">
        <CalendarDays size={17} />
        <span className="text-xs font-medium">{label}</span>
      </div>

      <p className="mt-3 text-sm font-semibold text-[#142B4A]">{value}</p>
    </div>
  )
}

/* =========================================================
   PAGE
========================================================= */

export default function NewsDetail() {
  const { id } = useParams()
  const item = getNews(id)

  if (!item) return <Navigate to="/" replace />

  const others = news.filter((n) => n.id !== item.id)

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFD] text-left">
      <div className="w-full px-5 py-7 text-left md:px-8 md:py-9">
        <div className="w-full space-y-6 text-left">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1769AA] transition hover:text-blue-900"
          >
            <ArrowLeft size={18} />
            Back to home
          </Link>

          {/* Image et titre */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="bg-gradient-to-br from-[#07172D] via-[#103B65] to-[#087EAA]">
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
                className="h-64 w-full object-cover md:h-80"
              />
            </div>

            {item.imageCaption && (
              <p className="border-b border-slate-100 px-5 py-3 text-left text-xs leading-5 text-slate-500">
                {item.imageCaption}
              </p>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#1769AA]">
                  {item.category}
                </span>

                <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={15} />
                  {item.date}
                </span>
              </div>

              <h1 className="mt-5 text-left text-2xl font-bold leading-tight text-[#142B4A] md:text-3xl">
                {item.headline}
              </h1>

              <p className="mt-4 max-w-4xl text-left text-base leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          </div>

          {/* Chiffres clés */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {item.facts.map((fact) => (
              <InfoCard key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </section>

          {/* Récit */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <SectionTitle icon={FlaskConical}>What happened</SectionTitle>

            <div className="mt-6 space-y-5">
              {item.summary.map((paragraph, index) => (
                <p
                  key={`${item.id}-paragraph-${index}`}
                  className="text-left text-sm leading-7 text-slate-600 md:text-base md:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Leçons */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
            <SectionTitle icon={CheckCircle2}>{item.lessonsTitle}</SectionTitle>

            <ul className="mt-5 space-y-4">
              {item.lessons.map((lesson, index) => (
                <li
                  key={`${item.id}-lesson-${index}`}
                  className="flex items-start gap-3 text-left text-sm leading-6 text-slate-600 md:text-base"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#1769AA]" />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Lien avec la recherche */}

          <section className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck size={25} className="mt-1 shrink-0 text-[#1769AA]" />

              <div className="text-left">
                <h3 className="text-lg font-bold text-[#142B4A]">
                  Why does this matter for combustion research?
                </h3>

                <p className="mt-3 text-left text-sm leading-7 text-slate-600 md:text-base">
                  {item.relevance}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    to="/investigations"
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1769AA] transition hover:border-blue-300"
                  >
                    <Flame size={16} />
                    See related investigations
                  </Link>

                  <Link
                    to="/ai-assistant"
                    state={{ question: item.askQuestion }}
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-[#071D49] transition hover:bg-yellow-300"
                  >
                    <Sparkles size={16} />
                    Ask Luminar AI
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Source NASA */}

          <div className="flex justify-start">
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D91] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#082F70]"
            >
              Explore NASA source
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Autres actualités */}

          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-[#142B4A]">More stories</h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.id}
                  to={`/news/${other.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="h-40 w-full overflow-hidden bg-gradient-to-br from-[#07172D] via-[#103B65] to-[#087EAA]">
                    <img
                      src={other.image}
                      alt={other.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold text-[#1769AA]">{other.category}</span>

                    <h3 className="mt-2 text-left text-lg font-bold leading-snug text-[#142B4A]">
                      {other.title}
                    </h3>

                    <p className="mt-2 text-left text-sm leading-6 text-slate-500">
                      {other.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                      <span className="text-sm font-semibold text-[#1769AA]">Read the story</span>

                      <ArrowUpRight
                        size={19}
                        className="text-[#1769AA] transition group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}