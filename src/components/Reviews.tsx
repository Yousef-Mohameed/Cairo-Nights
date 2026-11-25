import { Star } from 'lucide-react'
import Reveal from './Reveal'
import { cafe } from '../data/cafe'

function Reviews() {
  if (cafe.reviews.length === 0) return null

  return (
    <section className="bg-night px-4 py-14 text-center md:px-5 md:py-[70px]">
      <Reveal>
        <h2 className="font-ruqaa mb-10 text-[2.2rem] text-gold md:text-[2.8rem]">
          قالوا عننا
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
        {cafe.reviews.map((r, i) => (
          <Reveal key={r.name + i} delay={i * 0.08} className="h-full">
            <div className="h-full rounded-2xl border border-gold/30 bg-white/5 p-6">
              <div className="mb-3 flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="size-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="mb-4 leading-loose">{r.text}</p>
              <p className="font-bold text-gold-light">{r.name}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default Reviews