import { Link } from 'react-router-dom'
import { Images } from 'lucide-react'
import Reveal from './Reveal'
import { cafe } from '../data/cafe'

function GalleryPreview() {
  if (cafe.gallery.length === 0) return null

  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[80px]">
      <Reveal>
        <h2 className="font-ruqaa mb-3 flex items-center justify-center gap-3 text-[2.2rem] text-gold md:text-[2.8rem]">
          <Images className="size-8" />
          لمحة من المكان
        </h2>
        <p className="mb-10">القعدة والفوانيس وأحلى الأصناف</p>
      </Reveal>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cafe.gallery.slice(0, 4).map((name, i) => (
          <Reveal key={name} delay={i * 0.08}>
            <Link to="/gallery" className="block overflow-hidden rounded-2xl border border-gold/30 transition duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(217,164,91,0.3)]">
              <img
                src={`/images/${name}`}
                alt="صورة من ليالي القاهرة"
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-500 hover:scale-110"
              />
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <Link
          to="/gallery"
          className="mt-10 inline-block rounded-full border border-gold px-8 py-3 font-bold text-gold transition duration-300 hover:scale-105 hover:bg-gold/15"
        >
          شوف كل الصور
        </Link>
      </Reveal>
    </section>
  )
}

export default GalleryPreview