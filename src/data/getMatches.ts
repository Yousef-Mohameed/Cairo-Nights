export type ApiMatch = {
  id: number
  utcDate: string
  competition: { code: string; name: string }
  homeTeam: { shortName: string; name: string }
  awayTeam: { shortName: string; name: string }
}

// اكتب هنا البطولات اللي الكافيه بيعرضها بس
const COMPETITIONS = 'PL,PD,CL'
const TTL = 10 * 60 * 1000 // 10 دقايق
const CACHE_KEY = 'matches-cache-v1'

type Cached = { at: number; matches: ApiMatch[] }

let inflight: Promise<ApiMatch[]> | null = null

const toDateParam = (d: Date) => d.toISOString().slice(0, 10)

function readCache(): Cached | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Cached) : null
  } catch {
    return null
  }
}

function writeCache(matches: ApiMatch[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), matches }))
  } catch {
    // لو التخزين مش متاح مش مشكلة
  }
}

export function getMatches(): Promise<ApiMatch[]> {
  const cached = readCache()
  if (cached && Date.now() - cached.at < TTL) return Promise.resolve(cached.matches)

  // لو في طلب شغال دلوقتي نستنى نفس النتيجة بدل ما نبعت طلب تاني
  if (inflight) return inflight

  const from = new Date()
  const to = new Date()
  to.setDate(to.getDate() + 7)

  inflight = fetch(
    `/api/football/matches?dateFrom=${toDateParam(from)}&dateTo=${toDateParam(to)}&competitions=${COMPETITIONS}`,
    { signal: AbortSignal.timeout(10000) },
  )
    .then((res) => {
      if (!res.ok) throw new Error('API error ' + res.status)
      return res.json()
    })
    .then((data: { matches: ApiMatch[] }) => {
      writeCache(data.matches)
      return data.matches
    })
    .catch((err) => {
      // لو الطلب فشل (زي 429) نعرض آخر بيانات محفوظة بدل ما الصفحة تفضى
      if (cached) return cached.matches
      throw err
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}