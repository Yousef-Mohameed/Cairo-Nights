import { Link } from 'react-router-dom'
import { Flame } from 'lucide-react'
import Reveal from './Reveal'
import MenuPhoto from './MenuPhoto'
import { popularItems } from '../data/menu'

function MenuHighlights() {
  if (popularItems.length === 0) return null

  return (
    <section className="bg-night px-4 py-14 text-center md:px-5 md:py-[80px]">
      <Reveal>
        <h2 className="font-ruqaa mb-3 flex items-center justify-center gap-3 text-[2.2rem] text-gold md:text-[2.8rem]">
          <Flame className="size-8" />
          الأكتر طلبًا
        </h2>
        <p className="mb-10">أصناف زباينا بيرجعولها كل مرة</p>
      </Reveal>

      {/* موبايل: كروت كبيرة تحت بعض. شاشات أكبر: صف بيلف */}
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
        {popularItems.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.1} className="w-full max-w-[320px] sm:w-52">
            <div className="group w-full overflow-hidden rounded-2xl border border-gold/40 bg-brown pb-6 transition duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_30px_rgba(217,164,91,0.3)] sm:pb-5">
              <MenuPhoto
                keys={[item.photo, item.category.photo]}
                alt={item.name}
                Icon={item.category.icon}
                className="mb-3 aspect-[4/3] w-full"
              />
              <h3 className="mb-2 px-2 text-lg sm:text-base">{item.name}</h3>
              <p className="text-lg font-bold text-gold-light sm:text-base">{item.price} ج.م</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <Link
          to="/menu"
          className="mt-10 inline-block rounded-full bg-gold px-8 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.4)] transition duration-300 hover:scale-105 hover:bg-gold-light"
        >
          شوف المنيو كله
        </Link>
      </Reveal>
    </section>
  )
}

export default MenuHighlights
