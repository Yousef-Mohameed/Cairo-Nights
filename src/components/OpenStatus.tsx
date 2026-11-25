import { useEffect, useState } from 'react'
import { cafe } from '../data/cafe'

// الساعة الحالية بتوقيت القاهرة، مش بتوقيت جهاز الزائر
function cairoHour(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return h + m / 60
}

// بيدعم القفل بعد نص الليل (open=16, close=2)
const isOpen = (now: number, open: number, close: number) =>
  open < close ? now >= open && now < close : now >= open || now < close

function OpenStatus({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(cairoHour)

  useEffect(() => {
    const id = setInterval(() => setNow(cairoHour()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!cafe.schedule) return null
  const open = isOpen(now, cafe.schedule.open, cafe.schedule.close)

  return (
    <span
      className={
        'inline-flex items-center gap-2 rounded-full border border-gold/30 bg-night/50 px-3 py-1 text-sm font-bold ' +
        className
      }
    >
      <span className={'size-2 rounded-full ' + (open ? 'animate-pulse bg-[#25D366]' : 'bg-red-400')} />
      {open ? 'مفتوح دلوقتي' : 'مقفول دلوقتي'}
    </span>
  )
}

export default OpenStatus
