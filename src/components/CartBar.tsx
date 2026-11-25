import { useState } from 'react'
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { addItem, clearCart, removeItem, tableFromQr, useCart } from '../lib/cart'
import { cafe } from '../data/cafe'

function CartBar() {
  const { lines, count, total } = useCart()
  const [open, setOpen] = useState(false)
  const [place, setPlace] = useState(tableFromQr ? `طاولة ${tableFromQr}` : '')
  const [notes, setNotes] = useState('')

  if (count === 0) return null

  const dec = (name: string) => {
    const isLast = lines.length === 1 && lines[0].qty === 1
    removeItem(name)
    if (isLast) setOpen(false)
  }

  const send = () => {
    const body = lines.map((l) => `- ${l.name} × ${l.qty} = ${l.qty * l.price} ج.م`).join('\n')
    const msg =
      `طلب جديد من الموقع:\n${body}\nالإجمالي: ${total} ج.م` +
      (place.trim() ? `\nالمكان: ${place.trim()}` : '') +
      (notes.trim() ? `\nملاحظات: ${notes.trim()}` : '')
    window.open(`https://wa.me/${cafe.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 start-5 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-gold px-4 py-3 font-bold text-night shadow-[0_0_25px_rgba(217,164,91,0.5)] transition duration-300 hover:scale-105"
      >
        <span className="relative">
          <ShoppingBag className="size-6" />
          <span className="absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full bg-night text-xs text-gold">
            {count}
          </span>
        </span>
        <span>{total} ج.م</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-gold/40 bg-brown p-5 text-start sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-ruqaa text-3xl text-gold">طلبك</h3>
              <button
                aria-label="إغلاق"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full bg-night/60 p-2 text-cream"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.name} className="flex items-center justify-between gap-3 rounded-xl bg-night/50 p-3">
                  <div>
                    <p className="font-bold">{l.name}</p>
                    <p className="text-sm text-gold-light">{l.qty * l.price} ج.م</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-gold/40 p-1">
                    <button
                      aria-label="قلّل"
                      onClick={() => dec(l.name)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold hover:bg-gold hover:text-night"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-5 text-center font-bold">{l.qty}</span>
                    <button
                      aria-label="زوّد"
                      onClick={() => addItem(l.name, l.price)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-gold/15 text-gold hover:bg-gold hover:text-night"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="رقم الطاولة أو العنوان (اختياري)"
              className="mt-4 w-full rounded-xl border border-gold/30 bg-night/70 px-4 py-3 text-cream outline-none placeholder:text-cream/40 focus:border-gold"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات (اختياري)"
              className="mt-3 min-h-16 w-full rounded-xl border border-gold/30 bg-night/70 px-4 py-3 text-cream outline-none placeholder:text-cream/40 focus:border-gold"
            />

            <div className="mt-4 flex items-center justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-gold">{total} ج.م</span>
            </div>

            <button
              onClick={send}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-lg font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.35)] transition duration-300 hover:scale-[1.02]"
            >
              <MessageCircle className="size-6" />
              ابعت الطلب على واتساب
            </button>
            <button
              onClick={() => {
                clearCart()
                setOpen(false)
              }}
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 text-sm text-cream/70 hover:text-gold"
            >
              <Trash2 className="size-4" />
              فضّي الطلب
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default CartBar