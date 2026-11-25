import type { MenuItem } from '../data/menu'
import { setFlavor, useFlavor } from '../lib/flavor'

type Props = { item: MenuItem }

function FlavorButtons({ item }: Props) {
  const selected = useFlavor(item.id, item.options)

  if (!item.options || item.options.length === 0) return null

  return (
    <div role="radiogroup" className="my-3 flex flex-wrap justify-center gap-2">
      {item.options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === selected}
          onClick={() => setFlavor(item.id, o)}
          className={
            'cursor-pointer rounded-lg border px-3 py-1 text-sm ' +
            (o === selected
              ? 'border-gold bg-gold font-bold text-night'
              : 'border-gold/40 text-cream hover:bg-gold/15')
          }
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default FlavorButtons