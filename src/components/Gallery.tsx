import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import Reveal from './Reveal'
import { cafe } from '../data/cafe'

function Gallery() {
  // بنخزّن ترتيب الصورة (index) بدل اسمها عشان نقدر نروح للي قبلها وبعدها
  const [selected, setSelected] = useState<number | null>(null)
  const [failed, setFailed] = useState<Set<string>>(new Set())

  // الصور اللي مابتتحملش بتتشال من المعرض بدل ما تظهر أيقونة صورة مكسورة
  const markFailed = (name: string) => setFailed((prev) => new Set(prev).add(name))
  const photos = cafe.gallery.filter((name) => !failed.has(name))

  const current = selected !== null ? photos[selected] : undefined
  const many = photos.length > 1

  const close = useCallback(() => setSelected(null), [])
  const next = useCallback(
    () => setSelected((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  )
  const prev = useCallback(
    () => setSelected((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )

  // Escape يقفل، والأسهم تتنقل. الموقع عربي (RTL) فالسهم الشمال = التالي والسهم اليمين = اللي قبله
  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') next()
      else if (e.key === 'ArrowRight') prev()
    }
    document.addEventListener('keydown', onKey)
    // منع سكرول الصفحة وقت فتح الصورة
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selected, close, next, prev])

  const arrow =
    'absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-night/80 p-2 text-cream transition hover:bg-gold hover:text-night sm:p-3'

  return (
    <section className="bg-night-soft bg-arabesque px-4 py-14 text-center md:px-5 md:py-[70px]">
      <Reveal>
        <h1 className="font-ruqaa mb-3 text-[2.2rem] text-gold md:text-[2.8rem]">معرض الصور</h1>
        <p className="mb-10">لمحة من المكان والقعدة وأحلى أصناف عندنا</p>
      </Reveal>

      {photos.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-gold/30 bg-white/5 px-6 py-12">
          <Images className="mx-auto mb-3 size-10 text-gold" />
          <p className="opacity-90">الصور جاية قريب.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((name, i) => (
            <button
              type="button"
              key={name}
              onClick={() => setSelected(i)}
              aria-label="افتح الصورة"
              className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-gold/30 transition duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(217,164,91,0.3)]"
            >
              <img
                src={`/images/${name}`}
                alt={`صورة ${i + 1} من ليالي القاهرة`}
                loading="lazy"
                onError={() => markFailed(name)}
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            type="button"
            aria-label="إغلاق"
            className="absolute end-5 top-5 z-10 cursor-pointer rounded-full bg-night/80 p-2 text-cream"
            onClick={close}
          >
            <X className="size-6" />
          </button>

          {many && (
            <>
              {/* السابق: على اليمين في الواجهة العربية */}
              <button
                type="button"
                aria-label="الصورة السابقة"
                className={arrow + ' start-3 sm:start-6'}
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
              >
                <ChevronRight className="size-6 sm:size-7" />
              </button>

              {/* التالي: على الشمال */}
              <button
                type="button"
                aria-label="الصورة التالية"
                className={arrow + ' end-3 sm:end-6'}
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
              >
                <ChevronLeft className="size-6 sm:size-7" />
              </button>

              <span className="absolute bottom-5 start-1/2 -translate-x-1/2 rounded-full bg-night/80 px-3 py-1 text-sm text-cream rtl:translate-x-1/2">
                {(selected ?? 0) + 1} / {photos.length}
              </span>
            </>
          )}

          <img
            src={`/images/${current}`}
            alt={`صورة ${(selected ?? 0) + 1} من ليالي القاهرة`}
            className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}

export default Gallery
