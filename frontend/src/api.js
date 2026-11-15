// Client du backend RAG (dossier rag/). Adresse configurable dans frontend/.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function headers() {
  const h = { 'Content-Type': 'application/json' }
  if (import.meta.env.VITE_API_KEY) h['X-API-Key'] = import.meta.env.VITE_API_KEY
  return h
}

async function request(path, options = {}, timeoutMs = 120000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: headers(),
      signal: controller.signal,
    })
    if (!res.ok) {
      let detail = ''
      try {
        const body = await res.json()
        detail = typeof body.detail === 'string' ? body.detail : ''
      } catch {
        /* corps non JSON */
      }
      throw new Error(detail || `Server error (${res.status})`)
    }
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The server took too long to answer. Please try again.')
    }
    if (err instanceof TypeError) {
      throw new Error('Cannot reach the Luminar server. Make sure the backend is running.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Pose une question au RAG.
 * history : [{ role: 'user' | 'assistant', content: string }]
 * -> { answer, sources: [{ n, cited, type, title, page, url, score, snippet }] }
 */
export function askRag(question, history = []) {
  return request('/ask', {
    method: 'POST',
    body: JSON.stringify({ question, history }),
  })
}

/** Liste des investigations PSI : [{ id, name, url, doi_url, size, platform, license, publications[] }] */
export function getInvestigations() {
  return request('/investigations', { method: 'GET' }, 15000)
}

/**
 * Recherche sans LLM (barre de recherche).
 * type : 'pdf' | 'web' | 'psi' | 'psi_resource' | undefined
 * -> { query, investigations: [{ id, name, url, doi_url, research_area, size, publications }],
 *      chunks: [{ id, type, title, page, url, score, snippet, psi_id }] }
 */
export function searchChunks(q, { k = 8, type } = {}) {
  const params = new URLSearchParams({ q, k: String(k) })
  if (type) params.set('type', type)
  return request(`/search?${params}`, { method: 'GET' }, 20000)
}

/** Compteurs de l'index -> { chunks, vectors, dimensions, embed_model, by_type, by_investigation, investigations, publications } */
export function getStats() {
  return request('/stats', { method: 'GET' }, 15000)
}

/** Explorateur de chunks -> { total, offset, items: [{ id, type, title, page, url, psi_id, snippet, text }] } */
export function getChunks({ type, psi_id, q, offset = 0, limit = 20 } = {}) {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) })
  if (type) params.set('type', type)
  if (psi_id) params.set('psi_id', psi_id)
  if (q) params.set('q', q)
  return request(`/chunks?${params}`, { method: 'GET' }, 15000)
}