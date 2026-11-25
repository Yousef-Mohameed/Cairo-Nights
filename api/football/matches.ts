// بنعرّف process هنا عشان Vercel وهو بيبني الـ function ما يشتكيش إنه مش لاقي أنواع Node
declare const process: { env: Record<string, string | undefined> }

const API = 'https://api.football-data.org/v4/matches'

const isDate = (v: string | null) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)
const isCompetitions = (v: string | null) => !!v && /^[A-Z0-9,]+$/.test(v)

export async function GET(request: Request) {
  const key = process.env.FOOTBALL_API_KEY
  if (!key) return Response.json({ error: 'FOOTBALL_API_KEY مش متضاف' }, { status: 500 })

  const q = new URL(request.url).searchParams
  const dateFrom = q.get('dateFrom')
  const dateTo = q.get('dateTo')
  const competitions = q.get('competitions')

  // بنقبل 3 باراميترات بس بشكل محدد، عشان الـ function ماتتحولش لـ proxy مفتوح
  if (!isDate(dateFrom) || !isDate(dateTo) || !isCompetitions(competitions)) {
    return Response.json({ error: 'باراميترات غلط' }, { status: 400 })
  }

  try {
    const params = new URLSearchParams({ dateFrom: dateFrom!, dateTo: dateTo!, competitions: competitions! })
    const upstream = await fetch(`${API}?${params}`, { headers: { 'X-Auth-Token': key } })
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        // كاش 5 دقايق عشان ما نعدّيش حد الطلبات في الخطة المجانية
        'Cache-Control': upstream.ok ? 's-maxage=300, stale-while-revalidate=600' : 'no-store',
      },
    })
  } catch {
    return Response.json({ error: 'تعذر الوصول لخدمة الماتشات' }, { status: 502 })
  }
}