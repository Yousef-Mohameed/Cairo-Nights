import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Calendar,
  CalendarCheck,
  Clock,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Trophy,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cafe } from '../data/cafe'

const occasions = ['سهرة عادية', 'نتفرج على ماتش', 'عيد ميلاد', 'لمّة أصحاب']

const toLocalISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const isDate = (v: string | null) => !!v && /^\d{4}-\d{2}-\d{2}$/.test(v)
const isTime = (v: string | null) => !!v && /^\d{2}:\d{2}$/.test(v)

const inputClass =
  'w-full rounded-xl border border-gold/30 bg-night/70 py-3 ps-11 pe-4 text-cream outline-none transition placeholder:text-cream/40 focus:border-gold focus:shadow-[0_0_18px_rgba(217,164,91,0.25)] [color-scheme:dark]'

function Field({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-gold-light">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-gold" />
        {children}
      </span>
    </label>
  )
}

function BookingForm() {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  // لو جاي من زرار "احجز للماتش" بنملا الفورم بالماتش واليوم والساعة
  const [params] = useSearchParams()
  const matchName = (params.get('match') ?? '').slice(0, 80)
  const fromDate = params.get('date')
  const fromTime = params.get('time')

  const [name, setName] = useState('')
  const [date, setDate] = useState(() =>
    isDate(fromDate) && fromDate! >= toLocalISO(today) ? fromDate! : '',
  )
  const [time, setTime] = useState(() => (isTime(fromTime) ? fromTime! : ''))
  const [guests, setGuests] = useState(2)
  const [occasion, setOccasion] = useState(matchName ? 'نتفرج على ماتش' : '')
  const [notes, setNotes] = useState(matchName ? `الماتش: ${matchName}` : '')

  const text =
    (setter: (v: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter(e.target.value)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const msg =
      `أهلاً ${cafe.name}، عاوز أحجز طاولة:\n` +
      `الاسم: ${name}\n` +
      `التاريخ: ${date}\n` +
      `الساعة: ${time}\n` +
      `عدد الأفراد: ${guests}` +
      (occasion ? `\nالمناسبة: ${occasion}` : '') +
      (notes ? `\nملاحظات: ${notes}` : '')
    window.open(`https://wa.me/${cafe.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const quickDate = (d: Date) =>
    'cursor-pointer rounded-full border px-4 py-1 text-sm transition ' +
    (date === toLocalISO(d)
      ? 'border-gold bg-gold font-bold text-night'
      : 'border-gold/40 text-cream hover:bg-gold/15')

  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded-3xl border border-gold/30 bg-brown/70 text-start shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-3 border-b border-gold/30 bg-night/50 px-6 py-5 sm:px-8">
        <span className="flex size-11 items-center justify-center rounded-full bg-gold/15 text-gold">
          <CalendarCheck className="size-6" />
        </span>
        <div>
          <h3 className="font-ruqaa text-3xl leading-none text-gold">احجز طاولتك</h3>
          <p className="mt-1 text-sm opacity-80">املا البيانات والحجز هيوصلنا على واتساب</p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        {matchName && (
          <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
            <Trophy className="mt-0.5 size-5 shrink-0 text-gold" />
            <div className="text-sm">
              <p className="font-bold text-gold-light">حجز للماتش: {matchName}</p>
              <p className="opacity-80">الساعة دي ميعاد بداية الماتش، عدّلها لو عايز تيجي بدري.</p>
            </div>
          </div>
        )}

        <Field icon={User} label="الاسم">
          <input className={inputClass} placeholder="اسمك" required value={name} onChange={text(setName)} />
        </Field>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-bold text-gold-light">التاريخ والساعة</span>
            <div className="flex gap-2">
              <button type="button" className={quickDate(today)} onClick={() => setDate(toLocalISO(today))}>
                النهاردة
              </button>
              <button type="button" className={quickDate(tomorrow)} onClick={() => setDate(toLocalISO(tomorrow))}>
                بكرة
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <span className="relative block">
              <Calendar className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-gold" />
              <input
                className={inputClass}
                type="date"
                required
                min={toLocalISO(today)}
                value={date}
                onChange={text(setDate)}
                aria-label="التاريخ"
              />
            </span>
            <span className="relative block">
              <Clock className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-gold" />
              <input
                className={inputClass}
                type="time"
                required
                value={time}
                onChange={text(setTime)}
                aria-label="الساعة"
              />
            </span>
          </div>
        </div>

        <div>
          <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-gold-light">
            <Users className="size-4 text-gold" />
            عدد الأفراد
          </span>
          <div className="flex w-fit items-center gap-4 rounded-full border border-gold/30 bg-night/70 p-1.5">
            <button
              type="button"
              aria-label="قلّل"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-6 text-center text-xl font-bold">{guests}</span>
            <button
              type="button"
              aria-label="زوّد"
              onClick={() => setGuests((g) => Math.min(30, g + 1))}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div>
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-gold-light">
            <Sparkles className="size-4 text-gold" />
            المناسبة (اختياري)
          </span>
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(occasion === o ? '' : o)}
                className={
                  'cursor-pointer rounded-full border px-4 py-1.5 text-sm transition ' +
                  (occasion === o
                    ? 'border-gold bg-gold font-bold text-night'
                    : 'border-gold/40 text-cream hover:bg-gold/15')
                }
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="min-h-20 w-full rounded-xl border border-gold/30 bg-night/70 px-4 py-3 text-cream outline-none transition placeholder:text-cream/40 focus:border-gold focus:shadow-[0_0_18px_rgba(217,164,91,0.25)]"
          placeholder="أي ملاحظات تانية؟ (اختياري)"
          value={notes}
          onChange={text(setNotes)}
        />

        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-lg font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.35)] transition duration-300 hover:scale-[1.02]"
        >
          <MessageCircle className="size-6" />
          ابعت الحجز على واتساب
        </button>
      </div>
    </form>
  )
}

export default BookingForm