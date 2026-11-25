import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CalendarDays, Trophy, Tv } from 'lucide-react'
import Reveal from './Reveal'
import LoadingBlock from './LoadingBlock'
import TeamCrest from './TeamCrest'
import { getMatches } from '../data/getMatches'
import { bookingLink, competitionNames } from '../data/matchHelpers'

type Match = {
  id: number | string
  title: string
  teamA: string
  teamB: string
  teamACrest?: string
  teamBCrest?: string
  date: string
  day: string
  time: string
}

// ماتشات يدوية تظهر لو الـ API فشل أو مفيش ماتشات
const manualMatches: Match[] = []

function getStatus(iso: string, now: number): { live: boolean; text: string } {
  const diff = new Date(iso).getTime() - now
  if (diff <= 0 && diff > -2 * 60 * 60 * 1000) return { live: true, text: 'شغال دلوقتي' }
  if (diff <= 0) return { live: false, text: 'خلص' }
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return { live: false, text: `يبدأ بعد ${mins} دقيقة` }
  const hours = Math.floor(mins / 60)
  if (hours < 24) return { live: false, text: `يبدأ بعد ${hours} ساعة` }
  return { live: false, text: `يبدأ بعد ${Math.floor(hours / 24)} يوم` }
}

function TeamBadge({ name, crest }: { name: string; crest?: string }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center sm:w-36">
      <TeamCrest name={name} crest={crest} className="size-14 sm:size-16" />
      <span className="text-sm font-bold sm:text-lg">{name}</span>
    </div>
  )
}

function Matches() {
  const [matches, setMatches] = useState<Match[]>(manualMatches)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('all')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    getMatches()
      .then((list) => {
        if (cancelled) return
        const mapped: Match[] = list.map((m) => {
          const date = new Date(m.utcDate)
          return {
            id: m.id,
            title: competitionNames[m.competition.code] ?? m.competition.name,
            teamA: m.homeTeam.shortName || m.homeTeam.name,
            teamB: m.awayTeam.shortName || m.awayTeam.name,
            teamACrest: m.homeTeam.crest,
            teamBCrest: m.awayTeam.crest,
            date: m.utcDate,
            day: date.toLocaleDateString('ar-EG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              timeZone: 'Africa/Cairo',
            }),
            time: date.toLocaleTimeString('ar-EG', {
              hour: 'numeric',
              minute: '2-digit',
              timeZone: 'Africa/Cairo',
            }),
          }
        })
        if (mapped.length > 0) setMatches(mapped)
      })
      .catch((err) => {
        if (cancelled) return
        console.error(err)
        setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const competitions = Array.from(new Set(matches.map((m) => m.title)))

  const visible = matches
    .filter((m) => filter === 'all' || m.title === filter)
    .sort((a, b) => a.date.localeCompare(b.date))

  const groups = visible.reduce<{ day: string; items: Match[] }[]>((acc, m) => {
    const last = acc[acc.length - 1]
    if (last && last.day === m.day) last.items.push(m)
    else acc.push({ day: m.day, items: [m] })
    return acc
  }, [])

  const liveCount = visible.filter((m) => getStatus(m.date, now).live).length

  return (
    <div className="bg-night-soft pb-16">
      {/* الهيدر */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0b0f1a_0%,#141a2b_100%)] px-5 py-14 text-center md:py-20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="absolute h-full w-px bg-gold/10" />
          <div className="absolute size-56 rounded-full border-2 border-gold/10 md:size-80" />
          <div className="absolute size-3 rounded-full bg-gold/20" />
        </div>

        <div className="relative z-10">
          <Reveal>
            <div className="mb-3 flex items-center justify-center gap-2 text-gold-light">
              <Tv className="size-5" />
              <span className="tracking-[3px]">على شاشة ليالي القاهرة</span>
            </div>
            <h1 className="font-ruqaa mb-3 flex items-center justify-center gap-3 text-[2.6rem] text-gold drop-shadow-[0_0_25px_rgba(217,164,91,0.35)] md:text-[4rem]">
              ماتشات الأسبوع
              <Trophy className="size-9 md:size-12" />
            </h1>
            <p className="mx-auto max-w-xl">اتفرج على أهم الماتشات وسط الشلة، على نور الفوانيس</p>
            {liveCount > 0 && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1 text-sm font-bold text-red-300">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                </span>
                {liveCount} ماتش شغال دلوقتي
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 md:px-5">
        {/* الفلتر */}
        {competitions.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2.5">
            {['all', ...competitions].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={
                  'cursor-pointer rounded-full border border-gold px-4 py-1.5 text-sm transition sm:text-base ' +
                  (filter === c
                    ? 'bg-gold font-bold text-night'
                    : 'bg-transparent text-cream hover:bg-gold/15')
                }
              >
                {c === 'all' ? 'الكل' : c}
              </button>
            ))}
          </div>
        )}

        {/* المحتوى */}
        {loading ? (
          <LoadingBlock text="بنجيب لك ماتشات الأسبوع..." />
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border border-gold/30 bg-white/5 px-6 py-12 text-center">
            <Trophy className="mx-auto mb-3 size-10 text-gold" />
            <p className="opacity-90">
              {error
                ? 'مش قادرين نحمّل الماتشات دلوقتي. جرّب تاني بعد شوية.'
                : 'مفيش ماتشات متاحة دلوقتي، كلمنا وهنقولك إيه اللي على الشاشة.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.day}>
                <Reveal>
                  <div className="mb-4 flex items-center gap-3 text-gold">
                    <CalendarDays className="size-5" />
                    <h2 className="font-ruqaa text-2xl">{g.day}</h2>
                    <div className="h-px flex-1 bg-gold/30" />
                  </div>
                </Reveal>

                <div className="space-y-4">
                  {g.items.map((m, i) => {
                    const status = getStatus(m.date, now)
                    return (
                      <Reveal key={m.id} delay={i * 0.08}>
                        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-brown/70 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.3)]">
                          <div className="flex items-center justify-between gap-2 p-4 sm:p-6">
                            <TeamBadge name={m.teamA} crest={m.teamACrest} />

                            <div className="flex flex-1 flex-col items-center gap-2 text-center">
                              <span className="rounded-full bg-night/60 px-3 py-0.5 text-xs text-gold-light sm:text-sm">
                                {m.title}
                              </span>
                              <span className="text-2xl font-bold text-gold sm:text-4xl">{m.time}</span>
                              {status.live ? (
                                <span className="flex items-center gap-1.5 text-sm font-bold text-red-400">
                                  <span className="relative flex size-2.5">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                                  </span>
                                  LIVE
                                </span>
                              ) : (
                                <span className="rounded-full bg-gold/15 px-3 py-0.5 text-xs font-bold text-gold-light sm:text-sm">
                                  {status.text}
                                </span>
                              )}
                            </div>

                            <TeamBadge name={m.teamB} crest={m.teamBCrest} />
                          </div>

                          {status.text !== 'خلص' && (
                            <Link
                              to={bookingLink(m.teamA, m.teamB, m.date)}
                              className="flex items-center justify-center gap-2 border-t border-gold/20 bg-night/40 py-2.5 text-sm font-bold text-gold transition hover:bg-gold hover:text-night"
                            >
                              <CalendarCheck className="size-4" />
                              احجز طاولتك للماتش ده
                            </Link>
                          )}
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-14 text-center">
            <Link
              to="/contact"
              className="inline-block rounded-full bg-gold px-8 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.4)] transition duration-300 hover:scale-105 hover:bg-gold-light"
            >
              احجز طاولتك للماتش
            </Link>
            <p className="mt-6 text-[0.8rem] opacity-60">
              Football data provided by football-data.org
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default Matches