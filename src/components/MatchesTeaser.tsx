import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import Reveal from './Reveal'
import { mergeMatches, type MatchItem } from '../data/manualMatches'

type ApiMatch = {
  id: number
  utcDate: string
  competition: { code: string; name: string }
  homeTeam: { shortName: string; name: string }
  awayTeam: { shortName: string; name: string }
}

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

// لازم تبقى نفس البطولات اللي في Matches.tsx
const COMPETITIONS = 'PL,PD,CL'

const toDateParam = (d: Date) => d.toISOString().slice(0, 10)

function MatchesTeaser() {
  const [matches, setMatches] = useState<MatchItem[]>(() => mergeMatches([]).slice(0, 3))

  useEffect(() => {
    const from = new Date()
    const to = new Date()
    to.setDate(to.getDate() + 7)

    fetch(
      `/api/football/matches?dateFrom=${toDateParam(from)}&dateTo=${toDateParam(to)}&competitions=${COMPETITIONS}`
    )
      .then((res) => {
        if (!res.ok) throw new Error('API error ' + res.status)
        return res.json()
      })
      .then((data: { matches: ApiMatch[] }) => {
        const mapped: MatchItem[] = data.matches.map((m) => {
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
        setMatches(mergeMatches(mapped).slice(0, 3))
      })
      .catch((err) => console.error(err))
  }, [])

  if (matches.length === 0) return null

  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[80px]">
      <Reveal>
        <h2 className="font-ruqaa mb-3 flex items-center justify-center gap-3 text-[2.2rem] text-gold md:text-[2.8rem]">
          <Trophy className="size-8" />
          ماتشات الأسبوع
        </h2>
        <p className="mb-10">أقرب الماتشات على شاشتنا</p>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {matches.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.1} className="h-full">
            <div className="h-full rounded-2xl border border-gold/30 bg-brown/80 px-4 py-6 transition duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.3)]">
              <p className="mb-3 text-sm font-bold text-gold-light">{m.title}</p>
              <div className="mb-3 flex items-center justify-center gap-3 text-lg font-bold">
                <span>{m.teamA}</span>
                <span className="text-gold">VS</span>
                <span>{m.teamB}</span>
              </div>
              <p className="text-sm opacity-90">
                {m.day} - الساعة {m.time}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <Link
          to="/matches"
          className="mt-10 inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
        >
          كل الماتشات
        </Link>
      </Reveal>
    </section>
  )
}

export default MatchesTeaser