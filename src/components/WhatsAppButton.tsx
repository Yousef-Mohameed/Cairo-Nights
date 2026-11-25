import { MessageCircle } from 'lucide-react'
import { cafe } from '../data/cafe'

function WhatsAppButton() {
  const link = `https://wa.me/${cafe.whatsapp}?text=${encodeURIComponent('أهلاً، عاوز أحجز طاولة')}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="احجز على واتساب"
      className="fixed bottom-5 end-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-bold text-white shadow-[0_0_25px_rgba(37,211,102,0.5)] transition duration-300 hover:scale-105"
    >
      <MessageCircle className="size-6" />
      <span className="hidden sm:inline">احجز على واتساب</span>
    </a>
  )
}

export default WhatsAppButton