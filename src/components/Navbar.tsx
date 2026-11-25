import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CalendarCheck, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/matches', label: 'الماتشات' },
  { to: '/menu', label: 'المنيو' },
  { to: '/gallery', label: 'المعرض' },
  { to: '/about', label: 'حكايتنا' },
  { to: '/contact', label: 'تواصل معانا' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-gold' : 'text-cream hover:text-gold'

function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const panelRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // القايمة المفتوحة بتقفل لما تضغط في أي حتة برّاها، أو تدوس Escape
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || burgerRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const bookBtn =
    'inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-night shadow-[0_0_18px_rgba(217,164,91,0.35)] transition duration-300 hover:scale-105 hover:bg-gold-light'

  return (
    <header className="sticky top-0 z-50 border-b border-gold bg-night-soft/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-5 py-3 md:px-15 md:py-4">
        <Link
          to="/"
          onClick={() => {
            close()
            // لو انت أصلًا في الرئيسية، اطلع لأول الصفحة
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="font-ruqaa text-2xl text-gold md:text-3xl"
        >
          ليالي القاهرة
        </Link>

        {/* القايمة على الشاشات الكبيرة */}
        <nav className="hidden gap-x-6 md:flex" aria-label="التنقل الرئيسي">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contact#booking" onClick={close} className={bookBtn}>
            <CalendarCheck className="size-4" />
            احجز طاولة
          </Link>
          <button
            ref={burgerRef}
            type="button"
            aria-label={open ? 'اقفل القايمة' : 'افتح القايمة'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-gold/50 text-gold transition hover:bg-gold/15 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* القايمة على الموبايل */}
      {open && (
        <nav
          ref={panelRef}
          aria-label="التنقل الرئيسي"
          className="flex flex-col border-t border-gold/30 bg-night-soft px-5 py-2 md:hidden"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={close}
              className={({ isActive }) =>
                'border-b border-gold/15 py-3 text-lg last:border-b-0 ' + linkClass({ isActive })
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Navbar
 