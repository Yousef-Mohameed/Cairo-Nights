import { useState } from 'react'
import { CalendarPlus, Check, Share2 } from 'lucide-react'
import { cafe } from '../data/cafe'

type Props = {
  title: string
  teamA: string
  teamB: string
  date: string
  day: string
  time: string
}

const toCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

function MatchActions({ title, teamA, teamB, date, day, time }: Props) {
  const [copied, setCopied] = useState(false)

  const start = new Date(date)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const label = `${teamA} ضد ${teamB}`

  const calendar =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(`${label} - ${title}`)}` +
    `&dates=${toCalDate(start)}/${toCalDate(end)}` +
    `&details=${encodeURIComponent(`الماتش على شاشة ${cafe.name}`)}`

  const share = async () => {
    const text = `${label} (${title})\n${day} - الساعة ${time}\nهنتفرج عليه في ${cafe.name}`
    const url = `${window.location.origin}/matches`
    try {
      if (navigator.share) {
        await navigator.share({ title: label, text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // الزبون لغى المشاركة
    }
  }

  const btn =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold-light transition hover:bg-gold hover:text-night'

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
      <a href={calendar} target="_blank" rel="noreferrer" className={btn}>
        <CalendarPlus className="size-3.5" />
        ضيف للتقويم
      </a>
      <button type="button" onClick={share} className={btn}>
        {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
        {copied ? 'اتنسخ' : 'شارك'}
      </button>
    </div>
  )
}

export default MatchActions