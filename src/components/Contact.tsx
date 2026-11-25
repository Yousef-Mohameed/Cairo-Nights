import {
  Camera,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  type LucideIcon,
} from 'lucide-react'
import Reveal from './Reveal'
import BookingForm from './BookingForm'
import Lantern from './Lantern'
import OpenStatus from './OpenStatus'
import { cafe } from '../data/cafe'

type Action = {
  href: string
  icon: LucideIcon
  title: string
  value: string
  external: boolean
  ltr?: boolean
}

function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(cafe.mapQuery)}&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cafe.mapQuery)}`
  const hasInfo = cafe.address !== '' || cafe.hours.length > 0

  const actions: Action[] = [
    { href: `tel:${cafe.phone}`, icon: Phone, title: 'اتصل بينا', value: cafe.phone, external: false, ltr: true },
    { href: `https://wa.me/${cafe.whatsapp}`, icon: MessageCircle, title: 'واتساب', value: 'كلمنا واحجز بسرعة', external: true },
    ...(cafe.facebook
      ? [{ href: cafe.facebook, icon: ExternalLink, title: 'فيسبوك', value: 'تابع صفحتنا', external: true }]
      : []),
    ...(cafe.instagram
      ? [{ href: cafe.instagram, icon: Camera, title: 'إنستجرام', value: 'شوف صورنا', external: true }]
      : []),
  ]

  return (
    <div className="bg-night-soft">
      {/* الهيدر */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0b0f1a_0%,#141a2b_100%)] px-5 pt-16 pb-28 text-center">
        <Lantern className="absolute top-0 left-[10%] w-8 animate-float motion-reduce:animate-none sm:w-11" />
        <Lantern className="absolute top-0 right-[12%] w-7 animate-float motion-reduce:animate-none [animation-delay:2s] sm:w-10" />

        <div className="relative z-10">
          <Reveal>
            <p className="mb-2 tracking-[3px] text-gold-light">ليالي القاهرة</p>
            <h1 className="font-ruqaa mb-3 text-[2.6rem] text-gold drop-shadow-[0_0_25px_rgba(217,164,91,0.35)] md:text-[4rem]">
              تواصل معانا
            </h1>
            <p className="mx-auto max-w-md">
              كلمنا أو احجز طاولتك، وإحنا هنجهزلك سهرة على نور الفوانيس
            </p>
          </Reveal>
        </div>
      </section>

      <div className="bg-arabesque px-4 pb-16 md:px-5">
        {/* كروت التواصل السريع */}
        <div className="relative z-10 mx-auto -mt-14 grid max-w-5xl gap-4 [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
          {actions.map((a, i) => {
            const Icon = a.icon
            return (
              <Reveal key={a.title} delay={i * 0.08} className="h-full">
                <a
                  href={a.href}
                  target={a.external ? '_blank' : undefined}
                  rel={a.external ? 'noreferrer' : undefined}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-gold/30 bg-brown p-5 text-start shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_0_35px_rgba(217,164,91,0.35)]"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold transition duration-300 group-hover:bg-gold group-hover:text-night">
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block font-bold text-gold-light">{a.title}</span>
                    <span className="block text-sm opacity-90" dir={a.ltr ? 'ltr' : undefined}>
                      {a.value}
                    </span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>

        {/* الحجز + العنوان والخريطة */}
        <div
          className={
            'mx-auto mt-12 grid max-w-5xl items-start gap-6 ' + (hasInfo ? 'lg:grid-cols-2' : '')
          }
        >
          <div id="booking" className="scroll-mt-24">
            <Reveal>
              <BookingForm />
            </Reveal>
          </div>

          {hasInfo && (
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-gold/30 bg-brown/70 p-6 text-start sm:p-8">
                <h3 className="font-ruqaa mb-5 text-3xl text-gold">زورنا</h3>

                <div className="space-y-5">
                  {cafe.address && (
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <MapPin className="size-5" />
                      </span>
                      <p className="pt-1.5">{cafe.address}</p>
                    </div>
                  )}

                  {cafe.hours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <Clock className="size-5" />
                      </span>
                      <div className="pt-1.5">
                        {cafe.hours.map((h) => (
                          <p key={h.days}>
                            <span className="font-bold text-gold-light">{h.days}:</span> {h.time}
                          </p>
                        ))}
                        <OpenStatus className="mt-2" />
                      </div>
                    </div>
                  )}
                </div>

                {cafe.address && (
                  <>
                    <iframe
                      title="موقع الكافيه"
                      src={mapSrc}
                      loading="lazy"
                      className="mt-6 h-64 w-full rounded-2xl border border-gold/30"
                    />
                    <a
                      href={directions}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-bold text-night transition hover:scale-105 hover:bg-gold-light"
                    >
                      <Navigation className="size-5" />
                      اتجاهات للكافيه
                    </a>
                  </>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact