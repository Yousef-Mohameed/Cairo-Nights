import { useMemo, useState } from 'react'
import { Flame, Search, X } from 'lucide-react'
import MenuPhoto from './MenuPhoto'
import { menu, type MenuCategory, type MenuItem } from '../data/menu'

type Active = 'all' | string

function ItemCard({ item, cat }: { item: MenuItem; cat: MenuCategory }) {
  // الأصناف اللي ليها نكهات كتير (زي الميلك شيك) بتاخد عرض عمودين وتتقسم صورة وتفاصيل
  const wide = (item.options?.length ?? 0) > 4

  return (
    <div
      className={
        'group relative flex overflow-hidden rounded-2xl border border-gold/40 bg-brown text-center transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_0_30px_rgba(217,164,91,0.3)] ' +
        (wide ? 'col-span-2 flex-col sm:flex-row' : 'flex-col')
      }
    >
      {item.popular && (
        <span className="absolute end-2 top-2 z-10 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-bold text-night">
          <Flame className="size-3" />
          الأكتر طلبًا
        </span>
      )}

      <div className={'w-full overflow-hidden ' + (wide ? 'aspect-[16/9] sm:aspect-auto sm:w-1/2' : 'aspect-[4/3]')}>
        <MenuPhoto
          keys={[item.photo, cat.photo]}
          alt={item.name}
          Icon={cat.icon}
          className="size-full transition duration-500 group-hover:scale-105"
        />
      </div>

      <div
        className={
          'flex flex-1 flex-col items-center gap-1.5 px-2.5 py-3.5 sm:px-4 ' + (wide ? 'justify-center sm:gap-3 sm:py-6' : '')
        }
      >
        <h3 className={'font-bold leading-snug ' + (wide ? 'text-lg sm:text-xl' : 'text-[0.95rem] sm:text-base')}>
          {item.name}
        </h3>
        {item.note && <p className="text-[0.78rem] leading-snug opacity-75 sm:text-sm">{item.note}</p>}
        {item.options && (
          <div className={'flex flex-wrap justify-center ' + (wide ? 'gap-1.5 sm:gap-2' : 'gap-1')}>
            {item.options.map((o) => (
              <span
                key={o}
                className={
                  'rounded-full border border-gold/40 text-gold-light ' +
                  (wide ? 'px-3 py-1 text-[0.8rem] sm:text-sm' : 'px-2 py-0.5 text-[0.7rem]')
                }
              >
                {o}
              </span>
            ))}
          </div>
        )}
        <p className={'mt-auto pt-1 font-bold text-gold-light ' + (wide ? 'text-lg' : '')}>{item.price} ج.م</p>
      </div>
    </div>
  )
}

function Menu() {
  const [active, setActive] = useState<Active>('all')
  const [query, setQuery] = useState('')

  const sections = useMemo(() => {
    const q = query.trim()
    const base = active === 'all' || q ? menu : menu.filter((c) => c.id === active)
    if (!q) return base
    return base
      .map((c) => ({ ...c, items: c.items.filter((i) => i.name.includes(q) || i.note?.includes(q)) }))
      .filter((c) => c.items.length > 0)
  }, [active, query])

  const chip = (selected: boolean) =>
    'shrink-0 cursor-pointer rounded-full border border-gold px-4 py-2 text-[0.85rem] transition sm:text-[0.95rem] ' +
    (selected ? 'bg-gold font-bold text-night' : 'bg-transparent text-cream hover:bg-gold/15')

  return (
    <section id="menu" className="bg-night-soft bg-arabesque px-4 py-12 text-center md:px-5 md:py-[70px]">
      <h2 className="font-ruqaa mb-6 text-[2.2rem] text-gold md:text-[2.6rem]">المنيو</h2>

      <div className="relative mx-auto mb-5 max-w-md">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-gold" />
        {/* الكلاسات الأخيرة بتخفي علامة X بتاعة المتصفح عشان يفضل زرار المسح بتاعنا بس */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="دوّر على مشروب أو حلو..."
          className="w-full rounded-full border border-gold/50 bg-night/60 py-2.5 pe-10 ps-12 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        {query && (
          <button
            type="button"
            aria-label="مسح البحث"
            onClick={() => setQuery('')}
            className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer text-cream/70 hover:text-gold"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* التصنيفات بتفضل ثابتة تحت النافبار وانت بتنزل في المنيو */}
      <div className="sticky top-[4.1rem] z-30 -mx-4 mb-8 flex gap-2.5 overflow-x-auto bg-night-soft/95 px-5 py-3 backdrop-blur md:top-[4.6rem] md:-mx-5 sm:flex-wrap sm:justify-center sm:overflow-visible">
        <button type="button" onClick={() => setActive('all')} className={chip(active === 'all')}>
          الكل
        </button>
        {menu.map((cat) => (
          <button type="button" key={cat.id} onClick={() => setActive(cat.id)} className={chip(cat.id === active)}>
            {cat.label}
          </button>
        ))}
      </div>

      {sections.length === 0 && <p className="opacity-80">مفيش نتيجة للبحث ده، جرّب كلمة تانية.</p>}

      <div className="mx-auto max-w-[1100px] space-y-12">
        {sections.map((cat) => {
          const Icon = cat.icon
          return (
            <div key={cat.id}>
              <h3 className="font-ruqaa mb-5 flex items-center justify-center gap-2.5 text-[1.6rem] text-gold md:text-[2rem]">
                <Icon className="size-6 md:size-7" />
                {cat.label}
              </h3>
              <div
                className={
                  cat.items.length === 1
                    ? // قسم فيه صنف واحد (زي الميلك شيك): الكارت في نص الصفحة
                      'mx-auto ' + ((cat.items[0].options?.length ?? 0) > 4 ? 'max-w-[640px]' : 'max-w-[260px]')
                    : 'grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] sm:gap-5'
                }
              >
                {cat.items.map((item) => (
                  <ItemCard key={item.id} item={item} cat={cat} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-12 text-sm opacity-70">الأسعار بالجنيه المصري</p>
    </section>
  )
}

export default Menu
