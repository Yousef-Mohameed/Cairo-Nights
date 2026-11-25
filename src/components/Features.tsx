import { Link } from 'react-router-dom'
import { Coffee, Lamp, Tv, type LucideIcon } from 'lucide-react'
import Reveal from './Reveal'

const features: { icon: LucideIcon; title: string; text: string; to: string }[] = [
  { icon: Lamp, title: 'أجواء الفوانيس', text: 'مكان دافي على نور الفوانيس والطوب القديم', to: '/gallery' },
  { icon: Coffee, title: 'مشروبات أصيلة', text: 'شاي وقهوة وسحلب بطعم زمان', to: '/menu' },
  { icon: Tv, title: 'ماتشات على الشاشة', text: 'اتفرج على أهم الماتشات وسط الشلة', to: '/matches' },
]

function Features() {
  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[80px]">
      <Reveal>
        <p className="font-ruqaa text-[5rem] leading-none text-gold/90 drop-shadow-[0_0_30px_rgba(217,164,91,0.35)] md:text-[8rem]">
          ٩٦٩
        </p>
        <h2 className="font-ruqaa mb-4 text-[2rem] text-gold-light md:text-[2.6rem]">
          ومن يومها والقاهرة بتسهر
        </h2>
        <p className="mx-auto mb-12 max-w-2xl leading-loose">
          في سنة ٩٦٩م اتأسست القاهرة، ومن يومها وليالي القاهرة مشهورة بالسهر والحكايات.
          جينا نرجّعلك الجو ده: كوباية شاي، وفانوس منوّر، ولمّة حلوة.
        </p>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <Reveal key={f.title} delay={i * 0.1} className="h-full">
              <Link
                to={f.to}
                aria-label={f.title}
                className="group block h-full rounded-2xl border border-gold/30 bg-brown/70 px-5 py-8 transition duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <Icon className="mx-auto mb-4 size-11 text-gold transition duration-300 group-hover:scale-110" />
                <h3 className="mb-2 text-lg font-bold text-gold-light">{f.title}</h3>
                <p className="text-sm opacity-90">{f.text}</p>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <Reveal delay={0.2}>
        <Link
          to="/about"
          className="mt-10 inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
        >
          اقرا حكايتنا
        </Link>
      </Reveal>
    </section>
  )
}

export default Features