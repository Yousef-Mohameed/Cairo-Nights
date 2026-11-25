import { Link } from 'react-router-dom'
import { Moon } from 'lucide-react'
import Reveal from './Reveal'
import Lantern from './Lantern'

const stars = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 90}%`,
  delay: `${(i % 7) * 0.5}s`,
  size: i % 3 === 0 ? 3 : 2,
}))

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-4.1rem)] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#2a2140_0%,#0b0f1a_70%)] px-5 pt-5 pb-5 text-center"
    >
      {/* صورة المكان: على الموبايل خلف الكلام بتختفي لتحت، وعلى الشاشات الكبيرة في الشمال بتتلاشى ناحية النص */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-no-repeat opacity-40 [background-image:url('/images/cafe-hero.jpg')] [background-position:88%_center] [mask-image:linear-gradient(to_bottom,black_45%,transparent)] md:right-auto md:w-[55%] md:opacity-60 md:[mask-image:linear-gradient(to_right,black_35%,transparent)]"
      />

      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full bg-gold-light motion-reduce:animate-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      <Lantern className="absolute top-0 left-[8%] w-8 animate-float motion-reduce:animate-none sm:w-12" />
      <Lantern className="absolute top-0 right-[10%] hidden w-10 animate-float motion-reduce:animate-none [animation-delay:1.5s] sm:block" />
      <Lantern className="absolute top-0 right-[28%] hidden w-7 animate-float motion-reduce:animate-none [animation-delay:3s] md:block" />

      <div className="relative z-10 flex flex-col items-center">
        <Reveal>
          <Moon className="mb-2.5 size-12 animate-float text-gold-light drop-shadow-[0_0_18px_rgba(240,201,135,0.7)] motion-reduce:animate-none" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xl text-gold-light">٩٦٩م</p>
        </Reveal>
        <Reveal delay={0.2}>
          <h1 className="font-ruqaa text-shimmer animate-shimmer my-1.5 text-[2.8rem] motion-reduce:animate-none drop-shadow-[0_0_25px_rgba(217,164,91,0.35)] sm:text-[3.4rem] md:text-[5rem]">
            ليالي القاهرة
          </h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mb-4 tracking-[3px] text-gold-light">Cairo Nights 969AD</p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mb-8 text-base md:text-xl">سهرة قاهرية أصيلة، على نور الفوانيس</p>
        </Reveal>
        <Reveal delay={0.5}>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/menu"
              className="inline-block rounded-full bg-gold px-8 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.4)] transition duration-300 hover:scale-105 hover:bg-gold-light"
            >
              شوف المنيو
            </Link>
            <Link
              to="/matches"
              className="inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
            >
              ماتشات الأسبوع
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Hero