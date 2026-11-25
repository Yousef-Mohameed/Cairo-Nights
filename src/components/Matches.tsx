import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Trophy, Tv } from 'lucide-react'
import Reveal from './Reveal'
import LoadingBlock from './LoadingBlock'
import { getMatches, type ApiMatch } from '../data/getMatches'

type Match = {
  id: number | string
  title: string
  teamA: string
  teamB: string
  date: string
  day: string
  time: string
}

// ماتشات يدوية تظهر لو الـ API فشل أو مفيش ماتشات
const manualMatches: Match[] = []

const competitionNames: Record<string, string> = {
  PL: 'الدوري الإنجليزي',
  PD: 'الدوري الإسباني',
  BL1: 'الدوري الألماني',
  SA: 'الدوري الإيطالي',
  FL1: 'الدوري الفرنسي',
  CL: 'دوري أبطال أوروبا',
  EC: 'أمم أوروبا',
  WC: 'كأس العالم',
}

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

function TeamBadge({ name }: { name: string }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 text-center sm:w-36">
      <div className="flex size-14 items-center justify-center rounded-full border border-gold/60 bg-night text-2xl font-bold text-gold shadow-[0_0_18px_rgba(217,164,91,0.25)] sm:size-16">
        {name.charAt(0)}
      </div>
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
    getMatches()
      .then((list: ApiMatch[]) => {
        const mapped: Match[] = list.map((m) => {
          const date = new Date(m.utcDate)
          return {
            id: m.id,
            title: competitionNames[m.competition.code] ?? m.competition.name,
            teamA: m.homeTeam.shortName || m.homeTeam.name,
            teamB: m.awayTeam.shortName || m.awayTeam.name,
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
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
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
                        <div className="flex items-center justify-between gap-2 rounded-2xl border border-gold/30 bg-brown/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.3)] sm:p-6">
                          <TeamBadge name={m.teamA} />

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

                          <TeamBadge name={m.teamB} />
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