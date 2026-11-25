import { useState } from 'react'
import { Flame, Minus, Plus, Search } from 'lucide-react'
import { categories, items, type Category } from '../data/menu'
import { addItem, removeItem, useCart } from '../lib/cart'

const allItems = Object.values(items).flat()

function Menu() {
  const [active, setActive] = useState<Category>('hot')
  const [query, setQuery] = useState('')
  const [cheap, setCheap] = useState(false)
  const { cart } = useCart()

  const searching = query.trim() !== ''
  const base = searching
    ? allItems.filter((i) => i.name.includes(query.trim()))
    : items[active]
  const visible = cheap ? base.filter((i) => i.price <= 50) : base

  return (
    <section id="menu" className="bg-night-soft bg-arabesque px-4 py-12 text-center md:px-5 md:py-[70px]">
      <h2 className="font-ruqaa mb-3 text-[2.2rem] text-gold md:text-[2.6rem]">المنيو</h2>
      <p className="mb-7 text-sm opacity-80">دوس "ضيف للطلب" وابعت طلبك على واتساب</p>

      <div className="mx-auto mb-6 flex max-w-xl flex-wrap items-center justify-center gap-3">
        <span className="relative block min-w-56 flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-gold" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="دوّر على صنف..."
            className="w-full rounded-full border border-gold/40 bg-night/70 py-2.5 ps-11 pe-4 text-cream outline-none placeholder:text-cream/40 focus:border-gold"
          />
        </span>
        <button
          onClick={() => setCheap(!cheap)}
          className={
            'cursor-pointer rounded-full border border-gold px-4 py-2 text-sm transition ' +
            (cheap ? 'bg-gold font-bold text-night' : 'bg-transparent text-cream hover:bg-gold/15')
          }
        >
          تحت 50 جنيه
        </button>
      </div>

      <div className="mb-9 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActive(cat.id)
              setQuery('')
            }}
            className={
              'cursor-pointer rounded-full border border-gold px-4 py-2 text-[0.9rem] sm:px-6 sm:py-2.5 sm:text-base ' +
              (cat.id === active && !searching
                ? 'bg-gold font-bold text-night'
                : 'bg-transparent text-cream hover:bg-gold/15')
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 opacity-80">مفيش أصناف بالشكل ده.</p>
      ) : (
        <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-5">
          {visible.map((item) => {
            const Icon = item.icon
            const qty = cart[item.name]?.qty ?? 0
            return (
              <div
                key={item.name}
                className="group relative rounded-2xl border border-gold/40 bg-brown px-2.5 py-5 transition duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_30px_rgba(217,164,91,0.3)] sm:px-4 sm:py-7"
              >
                {item.popular && (
                  <span className="absolute end-2 top-2 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-bold text-night">
                    <Flame className="size-3" />
                    الأكتر طلبًا
                  </span>
                )}
                <Icon className="mx-auto mb-3 size-8 text-gold transition duration-300 group-hover:scale-110 sm:size-10" />
                <h3 className="mb-2">{item.name}</h3>
                <p className="font-bold text-gold-light">{item.price} ج.م</p>

                {qty === 0 ? (
                  <button
                    onClick={() => addItem(item.name, item.price)}
                    className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gold px-3 py-1.5 text-sm font-bold text-gold transition hover:bg-gold hover:text-night"
                  >
                    <Plus className="size-4" />
                    ضيف للطلب
                  </button>
                ) : (
                  <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-gold bg-night/60 p-1">
                    <button
                      aria-label="قلّل"
                      onClick={() => removeItem(item.name)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-5 text-center font-bold">{qty}</span>
                    <button
                      aria-label="زوّد"
                      onClick={() => addItem(item.name, item.price)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default Menu