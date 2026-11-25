import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

type InstallEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function InstallButton() {
  const [promptEvent, setPromptEvent] = useState<InstallEvent | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
  )

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPromptEvent(e as InstallEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null
  if (!promptEvent && !isIos) return null

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt()
      setPromptEvent(null)
    } else {
      setShowHint(!showHint)
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={install}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gold px-5 py-2 text-sm font-bold text-gold transition hover:bg-gold hover:text-night"
      >
        <Download className="size-4" />
        ثبّت التطبيق على موبايلك
      </button>
      {showHint && (
        <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed opacity-80">
          دوس على زرار المشاركة في المتصفح، وبعدها اختار "إضافة إلى الشاشة الرئيسية".
        </p>
      )}
    </div>
  )
}

export default InstallButton