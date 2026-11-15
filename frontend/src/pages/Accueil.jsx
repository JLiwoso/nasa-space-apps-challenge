import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { news } from '../data/news'

const AUTO_DELAY = 5000 // passage automatique à la story suivante (ms)

function Accueil() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = () => {
    setCurrent((prev) => (prev + 1) % news.length)
  }

  const previous = () => {
    setCurrent((prev) => (prev - 1 + news.length) % news.length)
  }

  // Défilement automatique : le minuteur repart de zéro à chaque changement
  // (clic sur une flèche, sur un indicateur, ou passage automatique)
  // et il est suspendu tant que la souris est sur le carrousel.
  useEffect(() => {
    if (paused) return undefined
    const timer = setTimeout(next, AUTO_DELAY)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused])

  const story = news[current]

  return (
    <section className="w-full px-6 py-6 text-left">
      <div
        className="relative w-full h-[520px] overflow-hidden rounded-2xl
          bg-gradient-to-br from-[#07172D] via-[#103B65] to-[#087EAA]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >

        {/* Image (lien externe : si elle ne charge pas, le dégradé reste) */}
        <img
          key={story.id}
          src={story.image}
          alt={story.title}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-10 md:p-14 max-w-4xl text-left text-white">

          {/* Category */}
          <div className="mb-4 text-left">
            <span className="text-xs font-bold tracking-[3px] uppercase text-[#0B3D91]">
              {story.category}
            </span>

            <div className="w-12 h-[2px] bg-red-500 mt-2"></div>
          </div>

          {/* Main title */}
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mt-4 mb-5 text-left leading-tight">
            {story.title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-white leading-relaxed max-w-xl text-left">
            {story.description}
          </p>

          {/* Learn more */}
          <Link
            to={`/news/${story.id}`}
            className="inline-flex items-center gap-2 mt-7 text-[#FFD700] font-semibold hover:text-[#FFE566] transition-colors"
          >
            Learn more
            <ArrowUpRight size={19} />
          </Link>
        </div>

        {/* Previous */}
        <button
          onClick={previous}
          aria-label="Previous story"
          className="absolute left-5 top-1/2 -translate-y-1/2
          w-12 h-12 rounded-full bg-white/20 backdrop-blur-md
          border border-white/30 text-white flex items-center justify-center
          hover:bg-white/40 transition-all"
        >
          <ChevronLeft size={26} />
        </button>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next story"
          className="absolute right-5 top-1/2 -translate-y-1/2
          w-12 h-12 rounded-full bg-white/20 backdrop-blur-md
          border border-white/30 text-white flex items-center justify-center
          hover:bg-white/40 transition-all"
        >
          <ChevronRight size={26} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 right-10 flex gap-2">
          {news.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrent(index)}
              aria-label={`Go to story ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? 'w-8 bg-white'
                  : 'w-3 bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

export default Accueil