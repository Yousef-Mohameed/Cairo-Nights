import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

// زرار يطلعك لأول الصفحة، بيظهر بعد ما تنزل شوية. على الناحية التانية من زرار الواتساب
function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      aria-label="اطلع لأول الصفحة"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 start-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full border border-gold bg-night-soft/90 text-gold shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur transition duration-300 hover:scale-105 hover:bg-gold hover:text-night"
    >
      <ArrowUp className="size-5" />
    </button>
  )
}

export default ScrollToTop
