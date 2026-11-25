import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Images,
  Megaphone,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import Reveal from './Reveal'
import { cafe } from '../data/cafe'

const cards: { to: string; icon: LucideIcon; title: string; text: string }[] = [
  { to: '/matches', icon: Trophy, title: 'ماتشات الأسبوع', text: 'اعرف إيه اللي على شاشتنا' },
  { to: '/menu', icon: UtensilsCrossed, title: 'المنيو', text: 'مشروبات وحلويات بطعم زمان' },
  { to: '/contact', icon: CalendarCheck, title: 'احجز طاولتك', text: 'الحجز بيوصلنا على واتساب' },
  { to: '/gallery', icon: Images, title: 'معرض الصور', text: 'لمحة من المكان والقعدة' },
]

function Explore() {
  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[70px]">
      {cafe.announcement && (
        <Reveal>
          <div className="mx-auto mb-10 flex max-w-3xl items-center justify-center gap-3 rounded-full border border-gold bg-gold/15 px-6 py-3 font-bold text-gold-light">
            <Megaphone className="size-5 shrink-0" />
            <span>{cafe.announcement}</span>
          </div>
        </Reveal>
      )}

      <Reveal>
        <h2 className="font-ruqaa mb-10 text-[2.2rem] text-gold md:text-[2.8rem]">
          اتفضل على ليالي القاهرة
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon
          return (
            <Reveal key={c.to} delay={i * 0.08} className="h-full">
              <Link
                to={c.to}
                className="group block h-full rounded-2xl border border-gold/30 bg-brown/70 px-5 py-8 transition duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.3)]"
              >
                <Icon className="mx-auto mb-4 size-10 text-gold transition duration-300 group-hover:scale-110" />
                <h3 className="mb-1 text-lg font-bold text-gold-light">{c.title}</h3>
                <p className="text-sm opacity-90">{c.text}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

export default Explore