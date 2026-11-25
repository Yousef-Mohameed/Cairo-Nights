import { Minus, Plus } from 'lucide-react'
import { menu, type MenuItem } from '../data/menu'
import { addItem, cartKey, removeItem, useCart } from '../lib/cart'
import { useFlavor } from '../lib/flavor'

// الأسماء المتكررة (زي براد شاي لفردين / لأربعة) بنضيفلها الملاحظة في الطلب عشان تفرق
const nameCount: Record<string, number> = {}
for (const cat of menu) {
  for (const i of cat.items) nameCount[i.name] = (nameCount[i.name] ?? 0) + 1
}

type Props = { item: MenuItem }

function AddToCart({ item }: Props) {
  const { lines } = useCart()
  const chosen = useFlavor(item.id, item.options)
  const qty = lines.find((l) => l.key === cartKey(item.id, chosen))?.qty ?? 0

  const label =
    item.name +
    (item.note && nameCount[item.name] > 1 ? ` (${item.note})` : '') +
    (chosen ? ` - ${chosen}` : '')

  const input = { id: item.id, label, price: item.price, option: chosen }

  return (
    <div className="mt-2 mb-3 flex justify-center">
      {qty === 0 ? (
        <button
          onClick={() => addItem(input)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gold px-3 py-1.5 text-sm font-bold text-gold transition hover:bg-gold hover:text-night"
        >
          <Plus className="size-4" />
          ضيف للطلب
        </button>
      ) : (
        <div className="inline-flex items-center gap-3 rounded-full border border-gold bg-night/60 p-1">
          <button
            aria-label="قلّل"
            onClick={() => removeItem(cartKey(item.id, chosen))}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-5 text-center font-bold">{qty}</span>
          <button
            aria-label="زوّد"
            onClick={() => addItem(input)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold transition hover:bg-gold hover:text-night"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default AddToCart