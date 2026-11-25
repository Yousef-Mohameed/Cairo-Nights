import { Link } from 'react-router-dom'
import { Clock, MapPin, MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import Lantern from './Lantern'
import { cafe } from '../data/cafe'
import OpenStatus from './OpenStatus'
function VisitCTA() {
  const firstHours = cafe.hours[0]

  return (
    <section className="bg-night px-4 py-14 md:px-5 md:py-[80px]">
      <Reveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold/40 bg-[linear-gradient(135deg,#4a3222_0%,#2a2140_100%)] px-6 py-12 text-center shadow-[0_0_60px_rgba(217,164,91,0.15)] md:py-16">
          <Lantern className="absolute top-0 left-[8%] w-7 animate-float motion-reduce:animate-none sm:w-10" />
          <Lantern className="absolute top-0 right-[8%] w-7 animate-float motion-reduce:animate-none [animation-delay:2s] sm:w-10" />

          <div className="relative z-10">
            <h2 className="font-ruqaa mb-3 text-[2.4rem] text-gold drop-shadow-[0_0_25px_rgba(217,164,91,0.35)] md:text-[3.4rem]">
              سهرتك مستنياك
            </h2>
            <p className="mx-auto mb-6 max-w-md">احجز طاولتك دلوقتي وتعالى اقعد على نور الفوانيس</p>

            {(cafe.address || firstHours) && (
              <div className="mb-8 flex flex-col items-center gap-2 text-gold-light">
                {cafe.address && (
                  <p className="flex items-center gap-2">
                    <MapPin className="size-5 shrink-0" />
                    {cafe.address}
                  </p>
                )}
               {firstHours && (
  <>
    <p className="flex items-center gap-2">
      <Clock className="size-5 shrink-0" />
      {firstHours.days}: {firstHours.time}
    </p>
    <OpenStatus />
  </>
)}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${cafe.whatsapp}?text=${encodeURIComponent('أهلاً، عاوز أحجز طاولة')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3 font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.35)] transition duration-300 hover:scale-105"
              >
                <MessageCircle className="size-5" />
                احجز على واتساب
              </a>
              <Link
                to="/contact"
                className="inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
              >
                كل طرق التواصل
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default VisitCTA