import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Lantern from './Lantern'

const MIN_MS = 1400 // أقل وقت تفضل فيه الشاشة عشان ما تلمّعش وتختفي
const MAX_MS = 4000 // أقصى وقت، حتى لو النت بطيء ما نعطّلش الزائر
const KEY = 'cn-loaded'

// الشاشة بتظهر مرة واحدة بس في الجلسة، مش مع كل تنقل أو ريفرش
function alreadyShown() {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function Loader() {
  const [show, setShow] = useState(() => !alreadyShown())

  useEffect(() => {
    if (!show) return

    document.body.style.overflow = 'hidden'
    const started = performance.now()
    let cancelled = false

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const fontsReady: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve()
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_MS))

    Promise.race([Promise.all([pageReady, fontsReady]), timeout]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started))
      setTimeout(() => {
        if (cancelled) return
        try {
          sessionStorage.setItem(KEY, '1')
        } catch {
          /* مش مشكلة لو التخزين مش شغال */
        }
        setShow(false)
      }, wait)
    })

    return () => {
      cancelled = true
      document.body.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          role="status"
          aria-label="جاري التحميل"
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_30%,#2a2140_0%,#0b0f1a_70%)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Lantern className="w-14 animate-float motion-reduce:animate-none" />
          <p className="font-ruqaa text-shimmer animate-shimmer text-4xl motion-reduce:animate-none">
            ليالي القاهرة
          </p>
          <div dir="ltr" className="h-0.5 w-40 overflow-hidden rounded-full bg-gold/20">
            <div className="h-full w-1/3 animate-loadbar rounded-full bg-gold motion-reduce:animate-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Loader