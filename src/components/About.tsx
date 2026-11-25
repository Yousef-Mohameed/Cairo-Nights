import { Link } from 'react-router-dom'
import { CalendarCheck, Lamp } from 'lucide-react'
import Reveal from './Reveal'
import { cafe } from '../data/cafe'

function About() {
  const { owner } = cafe
  const photos = cafe.gallery.slice(0, 2)

  return (
    <div className="bg-night-soft">
      {/* الهيدر */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0b0f1a_0%,#141a2b_100%)] px-5 pt-16 pb-20 text-center">
        <div className="relative z-10">
          <Reveal>
            <p className="mb-2 tracking-[3px] text-gold-light">٩٦٩م</p>
            <h1 className="font-ruqaa text-[2.6rem] text-gold drop-shadow-[0_0_25px_rgba(217,164,91,0.35)] md:text-[4rem]">
              حكايتنا
            </h1>
          </Reveal>
        </div>
      </section>

      <section id="about" className="bg-arabesque px-4 py-14 md:px-5 md:py-[80px]">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="text-start">
              <Lamp className="mb-4 size-10 text-gold" />
              <h2 className="font-ruqaa mb-4 text-[2rem] text-gold-light md:text-[2.4rem]">
                ومن يومها والقاهرة بتسهر
              </h2>
              <p className="mb-4 leading-loose">
                في سنة ٩٦٩م اتأسست القاهرة، ومن يومها وليالي القاهرة مشهورة بالسهر والحكايات.
                جينا نرجّعلك الجو ده: كوباية شاي، وفانوس منوّر، ولمّة حلوة.
              </p>
              <p className="leading-loose opacity-90">
                مكان دافي على نور الفوانيس والطوب القديم، فيه شاي وقهوة وسحلب بطعم زمان،
                وشاشات نتفرج فيها على أهم الماتشات وسط الشلة.
              </p>
            </div>
          </Reveal>

          {photos.length > 0 && (
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                {photos.map((name, i) => (
                  <img
                    key={name}
                    src={`/images/${name}`}
                    alt="صورة من ليالي القاهرة"
                    loading="lazy"
                    className={
                      'aspect-[3/4] w-full rounded-2xl border border-gold/30 object-cover shadow-[0_10px_40px_rgba(0,0,0,0.35)] ' +
                      (i === 1 ? 'mt-8' : '')
                    }
                  />
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {owner.photo && (
          <Reveal>
            <div className="mx-auto mt-14 flex w-fit flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-brown px-10 py-6 text-center">
              <img
                src={`/images/${owner.photo}`}
                alt={owner.name || owner.title}
                loading="lazy"
                className="size-28 rounded-full border-2 border-gold object-cover object-top shadow-[0_0_25px_rgba(217,164,91,0.3)] sm:size-32"
              />
              <div>
                {owner.name && <h3 className="font-bold text-gold-light">{owner.name}</h3>}
                <p className="text-sm opacity-90">{owner.title}</p>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className="mt-14 text-center">
            <p className="mb-5 text-lg">جاهز للسهرة؟</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact#booking"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.4)] transition duration-300 hover:scale-105 hover:bg-gold-light"
              >
                <CalendarCheck className="size-5" />
                احجز طاولتك
              </Link>
              <Link
                to="/menu"
                className="inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
              >
                شوف المنيو
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

export default About
