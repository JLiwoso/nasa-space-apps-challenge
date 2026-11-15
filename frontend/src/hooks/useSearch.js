import { useEffect, useRef, useState } from 'react'
import { searchChunks } from '../api'

/**
 * Recherche avec délai (debounce). Ignore les réponses périmées.
 * -> { data: { investigations, chunks } | null, loading, error }
 */
export default function useSearch(query, { k = 6, type, delay = 350 } = {}) {
  const [state, setState] = useState({ data: null, loading: false, error: null })
  const lastRequest = useRef(0)

  useEffect(() => {
    const q = query.trim()

    if (q.length < 2) {
      lastRequest.current += 1
      setState({ data: null, loading: false, error: null })
      return undefined
    }

    const id = ++lastRequest.current
    setState((s) => ({ ...s, loading: true, error: null }))

    const timer = setTimeout(async () => {
      try {
        const data = await searchChunks(q, { k, type })
        if (id === lastRequest.current) setState({ data, loading: false, error: null })
      } catch (err) {
        if (id === lastRequest.current) setState({ data: null, loading: false, error: err.message })
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [query, k, type, delay])

  return state
}