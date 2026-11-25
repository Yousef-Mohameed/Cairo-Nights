import { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, QrCode } from 'lucide-react'
import { cafe } from '../data/cafe'

function QrPage() {
  const [table, setTable] = useState('')
  const [base, setBase] = useState(`${window.location.origin}/menu`)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const clean = table.trim()
  const url = clean ? `${base}?table=${encodeURIComponent(clean)}` : base

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = clean ? `qr-table-${clean}.png` : 'qr-menu.png'
    a.click()
  }

  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[70px]">
      <h1 className="font-ruqaa mb-3 flex items-center justify-center gap-3 text-[2.2rem] text-gold md:text-[2.8rem]">
        <QrCode className="size-8" />
        باركود المنيو
      </h1>
      <p className="mx-auto mb-8 max-w-md">
        اكتب رقم الطاولة، نزّل الباركود واطبعه وحطه على الطاولة. الزبون هيفتح المنيو ورقم طاولته هيتكتب لوحده في الطلب.
      </p>

      <div className="mx-auto max-w-sm rounded-3xl border border-gold/30 bg-brown/70 p-6">
        <input
          type="number"
          min={1}
          max={999}
          value={table}
          onChange={(e) => setTable(e.target.value)}
          placeholder="رقم الطاولة (اتركه فاضي للباركود العام)"
          className="mb-4 w-full rounded-xl border border-gold/30 bg-night/70 px-4 py-3 text-center text-cream outline-none placeholder:text-cream/40 focus:border-gold"
        />

        <div className="mx-auto w-fit rounded-2xl bg-white p-3">
          <QRCodeCanvas
            ref={canvasRef}
            value={url}
            size={512}
            level="M"
            marginSize={1}
            fgColor="#0b0f1a"
            bgColor="#ffffff"
            style={{ width: 224, height: 224 }}
          />
        </div>

        <p className="mt-4 font-ruqaa text-2xl text-gold">{cafe.name}</p>
        {clean && <p className="text-gold-light">طاولة {clean}</p>}

        <button
          onClick={download}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-bold text-night transition hover:scale-105 hover:bg-gold-light"
        >
          <Download className="size-5" />
          نزّل الباركود
        </button>

        <input
          dir="ltr"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="mt-5 w-full rounded-xl border border-gold/20 bg-night/70 px-3 py-2 text-xs text-cream/70 outline-none focus:border-gold"
          aria-label="رابط المنيو"
        />
        <p className="mt-2 text-xs opacity-70">
          افتح الصفحة دي من الموقع بعد النشر على Vercel، عشان الرابط يبقى الدومين الحقيقي مش localhost.
        </p>
      </div>
    </section>
  )
}

export default QrPage