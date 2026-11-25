export type MatchItem = {
  id: number | string
  title: string
  teamA: string
  teamB: string
  date: string
  day: string
  time: string
}

type ManualMatch = {
  title: string
  teamA: string
  teamB: string
  // التاريخ بتوقيت القاهرة مع الفرق الزمني: الشتا +02:00 والصيف +03:00
  date: string
}

// ضيف الماتشات هنا. مثال (شيل علامة // لو عاوز تجرّبه):
// { title: 'دوري الأمم الأوروبية', teamA: 'فرنسا', teamB: 'إيطاليا', date: '2026-11-26T21:45:00+02:00' },
const manual: ManualMatch[] = []

const TWO_HOURS = 2 * 60 * 60 * 1000

export function mergeMatches(api: MatchItem[]): MatchItem[] {
  const cutoff = Date.now() - TWO_HOURS

  const extra = manual
    .filter((m) => new Date(m.date).getTime() > cutoff)
    .map((m, i): MatchItem => {
      const d = new Date(m.date)
      return {
        id: `manual-${i}`,
        title: m.title,
        teamA: m.teamA,
        teamB: m.teamB,
        date: d.toISOString(),
        day: d.toLocaleDateString('ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          timeZone: 'Africa/Cairo',
        }),
        time: d.toLocaleTimeString('ar-EG', {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Africa/Cairo',
        }),
      }
    })

  return [...api, ...extra].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}