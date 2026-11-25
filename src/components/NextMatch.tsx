import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Timer } from 'lucide-react'
import Reveal from './Reveal'
import TeamCrest from './TeamCrest'
import { getMatches, type ApiMatch } from '../data/getMatches'
import { bookingLink, competitionNames } from '../data/matchHelpers'

const MATCH_LENGTH = 2 * 60 * 60 * 1000 // نعتبر الماتش شغال لمدة ساعتين

const two = (n: number) =>
  n.toLocaleString('ar-EG', { minimumIntegerDigits: 2, useGrouping: false })

function Team({ name, crest }: { name: string; crest?: string }) {
  return (
    <div className="flex w-24 flex-col items-center gap-2 sm:w-32">
      <TeamCrest name={name} crest={crest} className="size-14 sm:size-16" />
      <span className="text-sm font-bold sm:text-lg">{name}</span>
    </div>
  )
}

function NextMatch() {
  const [match, setMatch] = useState<ApiMatch | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false
    getMatches()
      .then((list) => {
        if (cancelled) return
        const t = Date.now()
        const next = list
          .filter((m) => new Date(m.utcDate).getTime() > t - MATCH_LENGTH)
          .sort((a, b) => a.utcDate.localeCompare(b.utcDate))[0]
        setMatch(next ?? null)
      })
      .catch(() => {
        /* لو فشل التحميل بنخفي القسم وخلاص */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!match) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [match])

  if (!match) return null

  const kickoff = new Date(match.utcDate).getTime()
  if (now > kickoff + MATCH_LENGTH) return null

  const diff = kickoff - now
  const live = diff <= 0
  const teamA = match.homeTeam.shortName || match.homeTeam.name
  const teamB = match.awayTeam.shortName || match.awayTeam.name

  const units: [number, string][] = [
    [Math.floor(diff / 86400000), 'يوم'],
    [Math.floor((diff % 86400000) / 3600000), 'ساعة'],
    [Math.floor((diff % 3600000) / 60000), 'دقيقة'],
    [Math.floor((diff % 60000) / 1000), 'ثانية'],
  ]

  return (
    <section className="bg-night-soft px-4 py-10 md:px-5 md:py-14">
      <Reveal>
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/40 bg-brown/70 px-4 py-7 text-center shadow-[0_0_40px_rgba(217,164,91,0.15)] sm:px-8">
          {live ? (
            <p className="mb-1 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-1 text-sm font-bold text-red-300">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
              </span>
              شغال دلوقتي على شاشتنا
            </p>
          ) : (
            <p className="mb-1 inline-flex items-center gap-2 text-gold-light">
              <Timer className="size-5" />
              أقرب ماتش على شاشتنا
            </p>
          )}
          <p className="mb-5 text-sm opacity-80">
            {competitionNames[match.competition.code] ?? match.competition.name}
          </p>

          <div className="mb-6 flex items-center justify-center gap-3 sm:gap-8">
            <Team name={teamA} crest={match.homeTeam.crest} />
            <span className="font-ruqaa text-3xl text-gold">×</span>
            <Team name={teamB} crest={match.awayTeam.crest} />
          </div>

          {!live && (
            <div className="mx-auto mb-6 grid max-w-sm grid-cols-4 gap-2 sm:gap-3">
              {units.map(([value, label]) => (
                <div key={label} className="rounded-xl border border-gold/30 bg-night/60 py-3">
                  <div className="text-2xl font-bold text-gold sm:text-3xl">{two(value)}</div>
                  <div className="text-xs opacity-80">{label}</div>
                </div>
              ))}
            </div>
          )}

          <Link
            to={bookingLink(teamA, teamB, match.utcDate)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.4)] transition duration-300 hover:scale-105 hover:bg-gold-light"
          >
            <CalendarCheck className="size-5" />
            احجز طاولتك للماتش
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export default NextMatch